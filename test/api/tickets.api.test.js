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
        first_name: 'Ticket',
        last_name: 'Test',
        email: `tickettest_${Date.now()}@example.com`,
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

describe('Tickets API - functional test', function () {
    this.timeout(20000);

    it('Step 3 → should add a product to the cart', async function () {
        const res = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
    });

    it('Step 4 → should purchase the cart and generate a ticket', async function () {
        const res = await requester
            .post(`/api/carts/${cartId}/purchase`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.data.ticket).to.have.property('code');
        expect(res.body.data.ticket).to.have.property('amount');
        expect(res.body.data.ticket).to.have.property('purchaser');
    });
});

after(async function () {
    await mongoose.disconnect();
});
