import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../src/config/config.js'
import TicketRepository from '../src/repositories/ticket.repository.js'

const assert = Assert.strict

const mockTicket = {
    code: `T-${Date.now()}`,
    amount: 1000,
    purchaser: 'juan@example.com'
}

describe('Testing TicketService', () => {
    before(async () => {
        await mongoose.connect(config.mongo_uri)
    })

    beforeEach(async () => {
        await mongoose.connection.collection('tickets').deleteMany({})
    })

    it('create debe generar un ticket con _id y code único', async () => {
        const result = await TicketRepository.create(mockTicket)
        assert.ok(result._id)
        assert.strictEqual(result.code, mockTicket.code)
    })

    it('getAll debe devolver una lista de tickets existentes', async () => {
        await TicketRepository.create(mockTicket)
        const result = await TicketRepository.getAll()
        assert.ok(Array.isArray(result))
        assert.strictEqual(result.length, 1)
    })

    it('getById debe devolver el ticket correcto', async () => {
        const created = await TicketRepository.create(mockTicket)
        const result = await TicketRepository.getById(created._id)
        assert.strictEqual(result.purchaser, mockTicket.purchaser)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
