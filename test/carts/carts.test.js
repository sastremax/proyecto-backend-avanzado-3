import { expect, assert } from 'chai';
import supertest from 'supertest';
import { app } from '../../src/appServer.js';
import mongoose from 'mongoose';

const requester = supertest(app);

describe('Carts API - Step 1: Register user', function () {
    this.timeout(5000);

    before(async function () {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connection.asPromise();
        }
    });

    it('should register a new user successfully', async function () {
        try {
            console.log('TEST INICIADO: Carts API Register');
            const uniqueEmail = `testuser_${Date.now()}@example.com`;

            const res = await requester.post('/api/sessions/register').send({
                first_name: 'Test',
                last_name: 'User',
                email: uniqueEmail,
                password: '12345678',
                age: 25
            });

            console.log('REGISTER STATUS:', res.status);
            console.log('REGISTER RAW BODY:', res.text);
            console.log('REGISTER PARSED BODY:', res.body);

            expect(res.status).to.equal(201);
        } catch (error) {
            console.error('REGISTER ERROR:', error);
            assert.fail('Test failed with exception: ' + error.message);
        }
    });

    after(async function () {
        await mongoose.disconnect();
    });
});
