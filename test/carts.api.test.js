import mongoose from 'mongoose'
import dotenv from 'dotenv'
import supertest from 'supertest'
import { expect } from 'chai'
import UserModel from '../src/models/user.model.js'

dotenv.config()
const requester = supertest('http://localhost:8080')

describe('API /api/carts/:cid', () => {
    let tokenUser
    let cartId
    let productId;

    const mockUser = {
        first_name: 'Maxi',
        last_name: 'Test',
        age: 30,
        email: `test${Date.now()}@example.com`,
        password: '12345678'
    }

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(process.env.MONGO_URI)

        await requester.post('/api/sessions/register').send(mockUser)
        const login = await requester.post('/api/sessions/login').send({
            email: mockUser.email,
            password: mockUser.password
        })
        tokenUser = login.body.data.token

        const user = await UserModel.findOne({ email: mockUser.email })
        cartId = user.cart.toString()

        const adminUser = {
            first_name: 'Admin',
            last_name: 'Test',
            age: 40,
            email: `admin${Date.now()}@example.com`,
            password: 'adminpass'
        }

        await requester.post('/api/sessions/register').send(adminUser)
        await UserModel.updateOne({ email: adminUser.email }, { role: 'admin' })

        const adminLogin = await requester.post('/api/sessions/login').send({
            email: adminUser.email,
            password: 'adminpass'
        })

        const tokenAdmin = adminLogin.body.data.token

        const mockProduct = {
            title: 'Producto test',
            description: 'Producto para test',
            code: `CODE-${Date.now()}`,
            price: 100,
            stock: 20,
            category: 'test'
        }

        const productRes = await requester
            .post('/api/products')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(mockProduct)        

        productId = productRes.body.data._id;
        
        await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set('Authorization', `Bearer ${tokenUser}`)
            .send({ quantity: 1 })
    })

    it('Debe obtener el carrito por ID', async () => {
        const res = await requester
            .get(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${tokenUser}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('_id')
        expect(res.body.data).to.have.property('products')
    })

    it('Debe agregar un producto al carrito', async () => {
        const res = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set('Authorization', `Bearer ${tokenUser}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('products');
        expect(res.body.data.products).to.be.an('array');
        expect(res.body.data.products[0]).to.have.property('quantity', 3);
    });

})
