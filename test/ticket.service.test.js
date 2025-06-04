process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../src/config/config.js'
import TicketRepository from '../src/repositories/ticket.repository.js'

const assert = Assert.strict

describe('Testing TicketService', () => {
    before(async () => {
        await mongoose.connect(config.mongo_uri)
    })

    it('create debe generar un ticket con _id y code único', async () => {
        const ticketData = {
            code: `T-${Date.now()}-1`,
            amount: 1000,
            purchaser: 'juan@example.com'
        }
        const result = await TicketRepository.create(ticketData)
        assert.ok(result._id)
        assert.strictEqual(result.code, ticketData.code)
    })

    it('getAll debe devolver una lista de tickets existentes', async () => {
        const ticketData = {
            code: `T-${Date.now()}-2`,
            amount: 1000,
            purchaser: 'juan@example.com'
        }
        await TicketRepository.create(ticketData)
        const result = await TicketRepository.getAll()
        assert.ok(Array.isArray(result))
        assert.ok(result.length >= 1)
    })

    it('getById debe devolver el ticket correcto', async () => {
        const ticketData = {
            code: `T-${Date.now()}-3`,
            amount: 1000,
            purchaser: 'juan@example.com'
        }
        const created = await TicketRepository.create(ticketData)
        const result = await TicketRepository.getById(created._id)
        assert.strictEqual(result.purchaser, ticketData.purchaser)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
