process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../../src/config/config.js'
import TicketRepository from '../../src/repositories/ticket.repository.js'

const assert = Assert.strict

describe('Testing TicketService', () => {
    before(async () => {
        await mongoose.connect(config.mongo_uri)
    })

    it('create should generate a ticket with _id and unique code', async () => {
        const ticketData = {
            code: `T-${Date.now()}-1`,
            amount: 1000,
            purchaser: 'juan@example.com'
        }
        const result = await TicketRepository.create(ticketData)
        assert.ok(result._id)
        assert.strictEqual(result.code, ticketData.code)
    })

    it('getAll should return a list of existing tickets', async () => {
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

    it('getById should return the correct ticket by id', async () => {
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
