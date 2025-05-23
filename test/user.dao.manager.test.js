import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../src/config/config.js'
import { UserManager } from '../src/dao/mongo/user.manager.js'
import { mockUser } from '../src/mocks/mock.user.js'

const assert = Assert.strict

describe('Testing Users DAO', function () {
    
    before(async function () {
        await mongoose.connect(config.mongo_uri)
        this.userDAO = new UserManager()
        this.mockUser = { ...mockUser }
    })

    beforeEach(async function () {
        await mongoose.connection.collection('users').deleteMany({})
    })

    after(async function () {
        await mongoose.connection.close()
    })

    it('getAllUsers debe devolver un arreglo', async function () {
        const result = await this.userDAO.getAllUsers()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('createUser debe crear un usuario con _id', async function () {
        const result = await this.userDAO.createUser(this.mockUser)
        assert.ok(result._id)
    })

    it('getByEmail debe encontrar al usuario creado', async function () {
        await this.userDAO.createUser(this.mockUser)
        const result = await this.userDAO.getByEmail(this.mockUser.email)
        assert.strictEqual(result.email, this.mockUser.email)
    })

    it('El email del usuario no debe ser distinto al esperado', async function () {
        const result = await this.userDAO.createUser(this.mockUser)
        assert.notStrictEqual(result.email, 'another@gmail.com')
    })

    it('El DAO debe eliminar un usuario correctamente de la base de datos', async function () {
        const created = await this.userDAO.createUser(this.mockUser)
        const deleted = await this.userDAO.deleteById(created._id)
        assert.ok(deleted._id)

        const check = await this.userDAO.getById(created._id)
        assert.strictEqual(check, null)
    })

    it('El usuario recuperado debe coincidir con el creado', async function () {
        await this.userDAO.createUser(this.mockUser)
        const found = await this.userDAO.getByEmail(this.mockUser.email)

        assert.deepStrictEqual(
            {
                first_name: found.first_name,
                last_name: found.last_name,
                email: found.email
            },
            {
                first_name: this.mockUser.first_name,
                last_name: this.mockUser.last_name,
                email: this.mockUser.email
            }
        )
    })

    it('updateUserById debe actualizar el nombre correctamente', async function () {
        const created = await this.userDAO.createUser(this.mockUser)

        const updated = await this.userDAO.updateUserById(created._id, {
            first_name: 'NombreActualizado'
        })

        assert.strictEqual(updated.first_name, 'NombreActualizado')
    })

})