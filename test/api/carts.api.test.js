process.env.NODE_ENV = 'test';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../../src/config/config.js';
import { setupTestProduct } from '../utils/setupTestData.js';
import { sharedProductId } from '../utils/testData.js';

let requester;
let token = null;
let cartId = null;
let productId = null;

before(async function () {
    const { default: app } = await import('../../src/appExpress.js');
    requester = supertest(app);

    await mongoose.connect(config.mongo_uri);
    await setupTestProduct();
    productId = sharedProductId;

    const mockUser = {
        first_name: 'Cart',
        last_name: 'Test',
        email: `carttest_${Date.now()}@example.com`,
        age: 30,
        password: '12345678'
    };

    const resUser = await requester.post('/api/sessions/register').send(mockUser);

    console.log('REGISTER STATUS:', resUser.status);
    console.log('REGISTER BODY:', resUser._body);

    const resLogin = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password
    });

    token = resLogin.body.data.token;
    cartId = resLogin.body.data.user.cart;
});

describe('Carts API - funtional complete', function () {
    this.timeout(20000);

    beforeEach(async function () {
        const ProductModel = (await import('../../src/models/product.model.js')).default;
        await ProductModel.updateOne(
            { _id: sharedProductId },
            { $set: { stock: 50 } }
        );
        console.log('Stock reset to 50 in carts.api.test.js');
    });

    it('Step 1 → should retrieve the cart (GET /api/carts/:cartId)', async function () {
        const res = await requester
            .get(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('products');
    });

    it('Step 2 → should add a product to the cart (POST /api/carts/:cartId/product/:productId)', async function () {
        const res = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('products');
    });

    it('Step 3 → should update product quantity in cart (PUT /api/carts/:cartId/products/:productId)', async function () {
        const res = await requester
            .put(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 5 });

        expect(res.status).to.equal(200);
        expect(res.body.data.modifiedCount).to.be.greaterThan(0);
    });

    it('Step 4 → should remove product from cart (DELETE /api/carts/:cartId/products/${productId})', async function () {
        const res = await requester
            .delete(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('products');
    });
});

after(async function () {
    await mongoose.disconnect();
});
