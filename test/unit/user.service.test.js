process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import { expect } from 'chai'
import config from '../../src/config/config.js'
import UserService from '../../src/services/user.service.js'

const userService = UserService

describe('Testing UserService', function () {
    const testEmail = `service_${Date.now()}@example.com`

    before(async function () {
        await mongoose.connect(config.mongo_uri)
    })

    it('create debe crear un usuario con DTO y devolver fullname', async () => {
        const user = await userService.create({
            first_name: 'Maxi',
            last_name: 'Test',
            email: testEmail,
            password: '12345678',
            age: 30
        })
        expect(user).to.have.property('fullname')
        expect(user.fullname).to.equal('Maxi Test')
    })

    it('getUserByEmail debe devolver un UsersDTO con los datos esperados', async () => {
        const user = await userService.getUserByEmail(testEmail)
        expect(user).to.have.property('email', testEmail)
        expect(user).to.have.property('fullname', 'Maxi Test')
    })

    after(async function () {
        await mongoose.disconnect()
    })
})
