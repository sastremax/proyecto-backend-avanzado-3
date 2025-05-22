import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../src/config/config.js'
import userService from '../src/services/user.service.js'
import { mockUser } from '../src/mocks/mock.user.js'

const assert = Assert.strict
const testUser = { ...mockUser }

describe('Testing UserService', () => {
    before(async () => {
    await mongoose.connect(config.mongo_uri)
    })

    beforeEach(async () => {
        await mongoose.connection.collection('users').deleteMany({})
    })

    it('create debe crear un usuario con DTO y devolver fullname', async () => {
        const result = await userService.create(testUser)
        assert.ok(result.fullname)
        assert.strictEqual(result.email, testUser.email)
    })

    it('getUserByEmail debe devolver un UsersDTO con los datos esperados', async () => {
        await userService.create(testUser)
        const result = await userService.getUserByEmail(testUser.email)
        assert.ok(result.fullname)
        assert.strictEqual(result.email, testUser.email)
    })

    it('assignCartToUser debe asignar correctamente un carrito', async () => {
        await userService.create(testUser)
        const userRaw = await mongoose.connection.collection('users').findOne({ email: testUser.email })

        const dummyCartId = new mongoose.Types.ObjectId()
        const updated = await userService.assignCartToUser(userRaw._id, dummyCartId)

        assert.ok(updated.cart)
        assert.strictEqual(String(updated.cart), String(dummyCartId))
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
