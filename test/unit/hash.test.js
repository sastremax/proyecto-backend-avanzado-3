import { expect } from 'chai';
import { hashPassword, isValidPassword } from '../../src/utils/hash.js';

describe('Hash Utils', function () {

    const plainPassword = '12345678';
    let hashedPassword = null;

    it('should generate a hash different from the original password', function () {
        hashedPassword = hashPassword(plainPassword);
        expect(hashedPassword).to.be.a('string');
        expect(hashedPassword).to.not.equal(plainPassword);
    });

    it('should validate the password correctly with the hash', async function () {
        const isValid = await isValidPassword(plainPassword, hashedPassword);
        expect(isValid).to.be.true;
    });

    it('should fail if the password is incorrect', async function () {
        const isValid = await isValidPassword('wrongpassword', hashedPassword);
        expect(isValid).to.be.false;
    });

});
