import TicketRepository from '../repositories/ticket.repository.js'

class TicketService {
    async createTicket({ code, amount, purchaser }) {
        if (!code || !amount || !purchaser) {
            return { error: 'Missing required ticket data' }
        }

        try {
            const ticket = await TicketRepository.create({ code, amount, purchaser })

            if (!ticket) {
                return { error: 'Ticket creation failed' }
            }

            return { success: true, data: ticket }
        } catch (error) {
            return { error: error.message || 'Error creating ticket' }
        }
    }

    async getAllTickets() {
        try {
            const tickets = await TicketRepository.getAll()
            return { success: true, data: tickets }
        } catch (error) {
            return { error: error.message || 'Error retrieving tickets' }
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await TicketRepository.getById(id)
            if (!ticket) {
                return { error: 'Ticket not found' }
            }
            return { success: true, data: ticket }
        } catch (error) {
            return { error: error.message || 'Error retrieving ticket' }
        }
    }
}

export default new TicketService()
