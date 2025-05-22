import { expect } from 'chai'
import { hashPassword, isValidPassword } from '../src/utils/hash.js'

describe('Testing de utilidades y DTO de usuario', () => {
    describe('Testing de contraseñas', () => {
        it('Debe generar un hash distinto de la contraseña original', () => {
            const password = 'PasswordDificil!'
            const hashedPassword = hashPassword(password)

            expect(hashedPassword).to.not.equal(password)
        })

        it('Debe validar correctamente la contraseña con el hash', () => {
            const password = 'PasswordDificil!'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(password, hashedPassword)
            expect(result).to.be.true
        })

        it('Debe fallar si la contraseña es incorrecta', () => {
            const password = 'PasswordDificil!'
            const wrongPassword = 'ContraseñaIncorrecta'
            const hashedPassword = hashPassword(password)

            const result = isValidPassword(wrongPassword, hashedPassword)
            expect(result).to.be.false
        })
    })
})
