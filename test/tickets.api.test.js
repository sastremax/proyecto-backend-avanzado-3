import mongoose from 'mongoose'
import dotenv from 'dotenv'
import supertest from 'supertest'
import { expect } from 'chai'
import UserModel from '../src/models/user.model.js'

dotenv.config()
const requester = supertest('http://localhost:8080')

describe('API /api/carts/:cid/purchase', () => {
    let tokenUser
    let cartId
    let productId

    const mockUser = {
        first_name: 'Maxi',
        last_name: 'Test',
        age: 30,
        email: `test${Date.now()}@example.com`,
        password: '12345678'
    }

    const mockAdmin = {
        first_name: 'Admin',
        last_name: 'Test',
        age: 35,
        email: `admin${Date.now()}@example.com`,
        password: 'adminpass',
        role: 'admin'
    }

    const newProduct = {
        title: 'Mouse Inalámbrico',
        description: 'Mouse ergonómico con batería recargable',
        code: `MI-${Date.now()}`,
        price: 8000,
        stock: 20,
        category: 'Periféricos'
    }

    before(async function () {
        this.timeout(10000)

        await mongoose.connect(process.env.MONGO_URI)

        await requester.post('/api/sessions/register').send(mockAdmin)
        await UserModel.updateOne({ email: mockAdmin.email }, { role: 'admin' })
        const loginAdmin = await requester.post('/api/sessions/login').send({
            email: mockAdmin.email,
            password: mockAdmin.password
        })
        const tokenAdmin = loginAdmin.body.data.token

        const res = await requester
            .post('/api/products')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(newProduct)

        productId = res.body.data._id

        await requester.post('/api/sessions/register').send(mockUser)
        const loginUser = await requester.post('/api/sessions/login').send({
            email: mockUser.email,
            password: mockUser.password
        })

        console.log('LOGIN USER RESPONSE:', loginUser.body)

        tokenUser = loginUser.body.data.token

        const user = await UserModel.findOne({ email: mockUser.email })
        cartId = user.cart.toString()

        await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set('Authorization', `Bearer ${tokenUser}`)
            .send({ quantity: 1 })
    })

    it('Debe agregar el producto al carrito y generar un ticket', async () => {
        const res = await requester
            .post(`/api/carts/${cartId}/purchase`)
            .set('Authorization', `Bearer ${tokenUser}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.ticket).to.have.property('code')
        expect(res.body.data.ticket).to.have.property('amount')
    })
})
