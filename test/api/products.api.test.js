process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import { setSharedProductId } from '../utils/testData.js';

let requester
let token = null

before(async function () {
    const { default: app } = await import('../../src/appExpress.js')
    requester = supertest(app)
    console.log('Connecting to DB:', config.mongo_uri);
    await mongoose.connect(config.mongo_uri)

    const login = await requester.post('/api/sessions/login').send({
        email: 'maxi@example.com',
        password: '12345678'
    })
    console.log('LOGIN STATUS:', login.status)
    console.log('LOGIN BODY:', login.body)
    expect(login.status).to.equal(200)
    token = login.body.data.token
    console.log('TOKEN:', token)
})

after(async function () {
    await mongoose.disconnect()
})

describe('API /api/products', function () {
    this.timeout(10000)

    let createdProductId = null
    const uniqueCode = `TEST-${Date.now()}`

    it('should create a new product', async function () {
        const productData = {
            title: 'Product API Test',
            description: 'Description of API product',
            price: 1000,
            code: uniqueCode,
            stock: 50,
            category: 'test',
            status: 'available',
            thumbnails: []
        }

        const res = await requester
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send(productData)

        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body.data).to.have.property('_id')
        createdProductId = res.body.data._id
        setSharedProductId(createdProductId);
    })

    it('should retrieve the created product', async function () {
        const res = await requester
            .get(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body.data._id).to.equal(createdProductId)
    })

    it('should update the product title', async function () {
        const res = await requester
            .put(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Tittle update API' })

        expect(res.status).to.equal(200)
        expect(res.body.data.title).to.equal('Tittle update API')
    })

    it('should delete the product', async function () {
        const res = await requester
            .delete(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
    })
})
