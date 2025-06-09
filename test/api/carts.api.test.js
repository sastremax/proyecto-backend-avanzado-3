import { expect, assert } from 'chai';
import supertest from 'supertest';
import { app } from '../../src/appServer.js';
import mongoose from 'mongoose';
import config from '../../src/config/config.js';
process.env.NODE_ENV = 'test';

const requester = supertest(app);

describe('Carts API - funtional complete', function () {
    this.timeout(10000);

    let cartId = null;
    let token = null;
    const mockUser = {
        first_name: 'Test',
        last_name: 'Cart',
        email: `testcart_${Date.now()}@example.com`,
        password: '12345678',
        age: 30
    };

    before(async function () {
        await mongoose.connect(config.mongo_uri);
    });

    after(async function () {
        await mongoose.disconnect();
    });

    it('Step 1 → should register a new user and obtain cartId', async function () {
        try {
            console.log('TEST INIT: Carts API - Register');
            const res = await requester.post('/api/sessions/register').send(mockUser);

            console.log('REGISTER STATUS:', res.status);
            console.log('REGISTER BODY:', res.body);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('cart');

            cartId = res.body.data.cart;
            console.log('cartId:', cartId);
            expect(cartId).to.exist;

        } catch (error) {
            console.error('REGISTER ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 2 → should login and obtain token', async function () {
        try {
            const res = await requester.post('/api/sessions/login').send({
                email: mockUser.email,
                password: mockUser.password
            });

            console.log('LOGIN STATUS:', res.status);
            console.log('LOGIN BODY:', res.body);

            expect(res.status).to.equal(200);
            token = res.body?.data?.token;
            console.log('TOKEN:', token);
            expect(token).to.exist;

        } catch (error) {
            console.error('LOGIN ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 3 → should retrieve the cart (GET /api/carts/:cartId)', async function () {
        try {
            const res = await requester
                .get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('GET CART STATUS:', res.status);
            console.log('GET CART BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('products');
            expect(res.body.data.products).to.be.an('array');
        } catch (error) {
            console.error('GET CART ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 4 → should add a product to the cart (POST /api/carts/:cartId/product/:productId)', async function () {
        try {
            const productId = '6842093cd752f8ca394712a2';

            const res = await requester
                .post(`/api/carts/${cartId}/product/${productId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 2
                });

            console.log('ADD PRODUCT STATUS:', res.status);
            console.log('ADD PRODUCT BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('products');
            const addedProduct = res.body.data.products.find(p => {
                const prodId = typeof p.product === 'string' ? p.product : p.product._id;
                return prodId === productId;
            });
            expect(addedProduct).to.exist;
            expect(addedProduct.quantity).to.equal(2);
        } catch (error) {
            console.error('ADD PRODUCT ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 5 → should update product quantity in cart (PUT /api/carts/:cartId/products/:productId)', async function () {
        try {
            const productId = '6842093cd752f8ca394712a2';

            const res = await requester
                .put(`/api/carts/${cartId}/products/${productId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 5
                });

            console.log('UPDATE PRODUCT QUANTITY STATUS:', res.status);
            console.log('UPDATE PRODUCT QUANTITY BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('acknowledged', true);
            expect(res.body.data).to.have.property('modifiedCount').that.is.greaterThan(0);

            const getRes = await requester
                .get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('VERIFY UPDATED CART STATUS:', getRes.status);
            console.log('VERIFY UPDATED CART BODY:', getRes.body);

            expect(getRes.status).to.equal(200);
            const updatedProduct = getRes.body.data.products.find(p => {
                const prodId = typeof p.product === 'string' ? p.product : p.product._id;
                return prodId === productId;
            });
            expect(updatedProduct).to.exist;
            expect(updatedProduct.quantity).to.equal(5);
        } catch (error) {
            console.error('UPDATE PRODUCT QUANTITY ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 6 → should remove product from cart (DELETE /api/carts/:cartId/products/:productId)', async function () {
        try {
            const productId = '6842093cd752f8ca394712a2';

            const res = await requester
                .delete(`/api/carts/${cartId}/products/${productId}`)
                .set('Authorization', `Bearer ${token}`);

            console.log('REMOVE PRODUCT STATUS:', res.status);
            console.log('REMOVE PRODUCT BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('products');
            const removedProduct = res.body.data.products.find(p => {
                const prodId = typeof p.product === 'string' ? p.product : p.product._id;
                return prodId === productId;
            });
            expect(removedProduct).to.not.exist;
        } catch (error) {
            console.error('REMOVE PRODUCT ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

});
