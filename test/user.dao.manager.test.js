import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../src/config/config.js'
import { UserManager } from '../src/dao/mongo/user.manager.js'
import { mockUser } from '../src/mocks/mock.user.js'

const assert = Assert.strict
const userManager = new UserManager()
const testUser = mockUser

mongoose.connect(config.mongo_uri)

describe('Testing Users DAO', () => {
    beforeEach(async () => {
        await mongoose.connection.collection('users').deleteMany({})
    })

    it('getAllUsers debe devolver un arreglo', async () => {
        const result = await userManager.getAllUsers()
        assert.strictEqual(Array.isArray(result), false)
    })

    it('createUser debe crear un usuario con _id', async () => {
        const result = await userManager.createUser(testUser)
        assert.ok(result._id)
    })

    it('getByEmail debe encontrar al usuario creado', async () => {
        await userManager.createUser(testUser)
        const result = await userManager.getByEmail(testUser.email)
        assert.strictEqual(result.email, testUser.email)
    })

    it('El email del usuario no debe ser distinto al esperado', async () => {
        const result = await userManager.createUser(mockUser)
        assert.notStrictEqual(result.email, 'otro@email.com')
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
