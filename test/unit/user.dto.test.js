process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import { hashPassword, isValidPassword } from '../../src/utils/hash.js'

describe('Testing de utilidades y DTO de usuario', () => {
    describe('Testing de contraseñas', () => {
        it('should generate a hash different from the original password', () => {
            const password = 'PasswordDificil!'
            const hashedPassword = hashPassword(password)

            expect(hashedPassword).to.not.equal(password)
        })

        it('should validate the password correctly with the hash', () => {
            const password = 'PasswordDificil!'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(password, hashedPassword)
            expect(result).to.be.true
        })

        it('should fail if the password is incorrect', () => {
            const password = 'PasswordDificil!'
            const wrongPassword = 'ContraseñaIncorrecta'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(wrongPassword, hashedPassword)
            expect(result).to.be.false
        })
    })
})
