process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import { expect } from 'chai'
import config from '../src/config/config.js'
import UserModel from '../src/models/user.model.js'

describe('Basic MongoDB insert test', () => {
    const testEmail = `testuser_${Date.now()}@example.com`

    before(async () => {
        await mongoose.connect(config.mongo_uri)
    })

    it('should insert and find a user', async () => {
        const existing = await UserModel.findOne({ email: testEmail })
        if (!existing) {
            await UserModel.create({
                first_name: 'Test',
                last_name: 'User',
                email: testEmail,
                password: 'hashedpassword123',
                age: 25,
                role: 'user'
            })
        }
        const user = await UserModel.findOne({ email: testEmail })
        expect(user).to.not.be.null
        expect(user.email).to.equal(testEmail)
        expect(user.age).to.equal(25)
    })

    after(async () => {
        await mongoose.disconnect()
    })
})
