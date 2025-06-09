process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import TicketRepository from '../../src/repositories/ticket.repository.js'

describe('TicketRepository', function () {
    let testTicketId = null
    const testPurchaser = `tickettest_${Date.now()}@example.com`

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)
    })

    after(async function () {
        await mongoose.disconnect()
    })

    it('should create a ticket and return it', async function () {
        const ticketData = {
            code: `T-${Date.now()}`,
            amount: 1000,
            purchaser: testPurchaser
        }

        const result = await TicketRepository.create(ticketData)
        testTicketId = result._id.toString()

        expect(result).to.have.property('_id')
        expect(result.code).to.equal(ticketData.code)
        expect(result.amount).to.equal(ticketData.amount)
        expect(result.purchaser).to.equal(ticketData.purchaser)
    })

    it('should return a list of existing tickets', async function () {
        const tickets = await TicketRepository.getAll()
        expect(tickets).to.be.an('array')
        expect(tickets.length).to.be.greaterThan(0)
    })

    it('should return the correct ticket by ID', async function () {
        const ticket = await TicketRepository.getById(testTicketId)
        expect(ticket).to.have.property('_id')
        expect(ticket._id.toString()).to.equal(testTicketId)
        expect(ticket.purchaser).to.equal(testPurchaser)
    })
})
