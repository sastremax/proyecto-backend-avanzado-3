process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import { hashPassword, isValidPassword } from '../../src/utils/hash.js'

describe('Testing of utilities & DTO user', () => {
    describe('Paswords testing', () => {
        it('should generate a hash different from the original password', () => {
            const password = 'PasswordDificult!'
            const hashedPassword = hashPassword(password)

            expect(hashedPassword).to.not.equal(password)
        })

        it('should validate the password correctly with the hash', () => {
            const password = 'PasswordDificult!'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(password, hashedPassword)
            expect(result).to.be.true
        })

        it('should fail if the password is incorrect', () => {
            const password = 'PasswordDificult!'
            const wrongPassword = 'IncorrectPasword'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(wrongPassword, hashedPassword)
            expect(result).to.be.false
        })
    })
})
