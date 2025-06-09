process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../../src/config/config.js'
import { UserManager } from '../../src/dao/mongo/user.manager.js'
import { mockUser } from '../../src/mocks/mock.user.js'

const assert = Assert.strict

describe('Testing Users DAO', function () {
    this.timeout(10000) // ← esto es lo que faltaba

    let userDAO
    let uniqueUser

    before(async function () {
        console.log('NODE_ENV:', process.env.NODE_ENV)
        await mongoose.connect(config.mongo_uri)
        userDAO = new UserManager()
    })

    beforeEach(function () {
        uniqueUser = {
            ...mockUser,
            email: `test+${Date.now()}@example.com`
        }
    })

    after(async function () {
        await mongoose.connection.close()
    })

    it('getAllUsers should return an array of users', async function () {
        const result = await userDAO.getAllUsers()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('createUser should create a user with _id', async function () {
        const result = await userDAO.createUser(uniqueUser)
        assert.ok(result._id)
    })

    it('getByEmail should find the created user by email', async function () {
        await userDAO.createUser(uniqueUser)
        const result = await userDAO.getByEmail(uniqueUser.email)
        assert.strictEqual(result.email, uniqueUser.email)
    })

    it('should not return a different email than expected', async function () {
        const result = await userDAO.createUser(uniqueUser)
        assert.notStrictEqual(result.email, 'another@gmail.com')
    })

    it('should delete a user from the database', async function () {
        const created = await userDAO.createUser(uniqueUser)
        const deleted = await userDAO.deleteById(created._id)
        assert.ok(deleted._id)

        const check = await userDAO.getById(created._id)
        assert.strictEqual(check, null)
    })

    it('should match the retrieved user with the created one', async function () {
        await userDAO.createUser(uniqueUser)
        const found = await userDAO.getByEmail(uniqueUser.email)

        assert.deepStrictEqual(
            {
                first_name: found.first_name,
                last_name: found.last_name,
                email: found.email
            },
            {
                first_name: uniqueUser.first_name,
                last_name: uniqueUser.last_name,
                email: uniqueUser.email
            }
        )
    })

    it('updateUserById should update the user name correctly', async function () {
        const created = await userDAO.createUser(uniqueUser)

        const updated = await userDAO.updateUserById(created._id, {
            first_name: 'NameUpdate'
        })

        assert.strictEqual(updated.first_name, 'NameUpdate')
    })
})
