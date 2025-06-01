import dotenv from 'dotenv'
dotenv.config()

import { expect } from 'chai'
import supertest from 'supertest'
import mongoose from 'mongoose'
import UserModel from '../src/models/user.model.js'

const requester = supertest('http://localhost:8080')

describe('API /api/products', () => {
    let token
    let productId

    const mockAdmin = {
        first_name: 'Admin',
        last_name: 'Test',
        age: 35,
        email: `admin${Date.now()}@example.com`,
        password: 'adminpass',
        role: 'admin'
    }

    const newProduct = {
        title: 'Teclado Gamer',
        description: 'Teclado mecánico retroiluminado',
        code: `TG-${Date.now()}`,
        price: 12000,
        stock: 50,
        category: 'Periféricos'
    }

    before(async function () {
        this.timeout(10000)

        await mongoose.connect(process.env.MONGO_URI)

        console.log('→ Registro de admin')
        await requester.post('/api/sessions/register').send(mockAdmin)

        console.log('→ Update role admin en DB')
        await UserModel.updateOne({ email: mockAdmin.email }, { role: 'admin' })

        const login = await requester.post('/api/sessions/login').send({
            email: mockAdmin.email,
            password: mockAdmin.password
        })

        token = login._body.data.token
    })

    it('POST /api/products debe crear un producto', async () => {
        const res = await requester
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send(newProduct)

        expect(res.status).to.equal(201)
        expect(res._body).to.have.property('data')
        productId = res._body.data._id
    })

    it('PUT /api/products/:id debe actualizar el producto', async () => {
        const res = await requester
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Teclado Gamer RGB' })

        expect(res.status).to.equal(200)
        expect(res._body.data.title).to.equal('Teclado Gamer RGB')
    })

    it('DELETE /api/products/:id debe eliminar el producto', async () => {
        const res = await requester
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res._body.message).to.equal('Product deleted')
    })

    after(async () => {
        await mongoose.disconnect()
    })
})
