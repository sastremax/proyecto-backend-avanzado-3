process.env.NODE_ENV = 'test';
import { expect, assert } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../../src/config/config.js';
import { app } from '../../src/appServer.js';

const requester = supertest(app);

describe('Tickets API - functional test', function () {
    this.timeout(10000);

    let cartId = null;
    let token = null;
    const productId = '6842093cd752f8ca394712a2';
    const mockUser = {
        first_name: 'Ticket',
        last_name: 'Test',
        email: `tickettest_${Date.now()}@example.com`,
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
            const res = await requester.post('/api/sessions/register').send(mockUser);

            console.log('REGISTER STATUS:', res.status);
            console.log('REGISTER BODY:', res.body);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('cart');

            cartId = res.body.data.cart;
            console.log('cartId obtained:', cartId);
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
            console.log('TOKEN obtained:', token);
            expect(token).to.exist;
        } catch (error) {
            console.error('LOGIN ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 3 → should add a product to the cart', async function () {
        try {
            const res = await requester
                .post(`/api/carts/${cartId}/product/${productId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 1
                });

            console.log('ADD PRODUCT STATUS:', res.status);
            console.log('ADD PRODUCT BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
        } catch (error) {
            console.error('ADD PRODUCT ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    it('Step 4 → should purchase the cart and generate a ticket', async function () {
        try {
            const res = await requester
                .post(`/api/carts/${cartId}/purchase`)
                .set('Authorization', `Bearer ${token}`);

            console.log('PURCHASE STATUS:', res.status);
            console.log('PURCHASE BODY:', res.body);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('ticket');
            expect(res.body.data.ticket).to.have.property('code');
            expect(res.body.data.ticket).to.have.property('amount');
            expect(res.body.data.ticket).to.have.property('purchaser');

        } catch (error) {
            console.error('PURCHASE ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });
});
