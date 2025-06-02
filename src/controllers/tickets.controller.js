import TicketService from '../services/ticket.service.js'

export async function createTicket(req, res) {
    try {
        const ticketData = req.body
        const result = await TicketService.createTicket(ticketData)

        if (result.error) {
            req.logger.warning(`Ticket creation failed: ${result.error}`)
            return res.badRequest(result.error)
        }

        req.logger.info(`Ticket created successfully for ${ticketData.purchaser}`)
        return res.created('Ticket created successfully', result.data)
    } catch (error) {
        req.logger.error(`Ticket creation error: ${error.message}`)
        return res.internalError('Error creating ticket', error)
    }
}

export async function getAllTickets(req, res) {
    try {
        const result = await TicketService.getAllTickets()

        if (result.error) {
            req.logger.warning(`Error retrieving tickets: ${result.error}`)
            return res.badRequest(result.error)
        }

        req.logger.info(`Tickets retrieved: ${result.data.length}`)
        return res.success('Tickets retrieved', result.data)
    } catch (error) {
        req.logger.error(`Error retrieving tickets: ${error.message}`)
        return res.internalError('Error retrieving tickets', error)
    }
}

export async function getTicketById(req, res) {
    try {
        const { id } = req.params
        const result = await TicketService.getTicketById(id)

        if (result.error) {
            req.logger.warning(`Ticket not found: ${id}`)
            return res.notFound(result.error)
        }

        req.logger.info(`Ticket retrieved: ${id}`)
        return res.success('Ticket retrieved', result.data)
    } catch (error) {
        req.logger.error(`Error retrieving ticket: ${error.message}`)
        return res.internalError('Error retrieving ticket', error)
    }
}
