process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import { app } from '../../src/appServer.js'

const requester = supertest(app)

describe('User Auth Flow - register → login → current', function () {
    let token = null

    const mockUser = {
        first_name: 'Maxi',
        last_name: 'Test',
        age: 30,
        email: `test${Date.now()}@example.com`,
        password: '12345678'
    }

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)
    })

    it('Debe registrar un nuevo usuario', async function () {
        const res = await requester.post('/api/sessions/register').send(mockUser)

        console.log('REGISTER STATUS:', res.status)
        console.log('REGISTER BODY:', res._body)

        expect(res.status).to.equal(201)
        expect(res._body).to.have.property('message')
        expect(res._body.message).to.equal('User registered successfully')
    })

    it('Debe hacer login y devolver un token válido', async function () {
        const res = await requester.post('/api/sessions/login').send({
            email: mockUser.email,
            password: mockUser.password
        })

        expect(res.status).to.equal(200)

        token = res._body?.data?.token
        console.log('TOKEN OBTENIDO:', token)
        expect(token).to.exist
    })

    it('Debe acceder a /current y devolver el usuario logueado', async function () {
        const res = await requester
            .get('/api/sessions/current')
            .set('Authorization', `Bearer ${token}`)

        console.log('CURRENT STATUS:', res.status)
        console.log('CURRENT BODY:', res._body)

        expect(res.status).to.equal(200)
        expect(res._body).to.have.property('data')
        expect(res._body.data).to.have.property('email', mockUser.email)
    })

    after(async function () {
        await mongoose.disconnect()
    })
    
})
