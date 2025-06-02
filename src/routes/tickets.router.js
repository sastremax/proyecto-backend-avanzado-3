import CustomRouter from './custom.router.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import {
    createTicket,
    getAllTickets,
    getTicketById
} from '../controllers/tickets.controller.js'

export default class TicketsRouter extends CustomRouter {
    init() {
        this.post(
            '/',
            ['user'],
            ...passportWithPolicy(['user']),
            createTicket
        )

        this.get(
            '/',
            ['admin'],
            ...passportWithPolicy(['admin']),
            getAllTickets
        )

        this.get(
            '/:id',
            ['user', 'admin'],
            ...passportWithPolicy(['user', 'admin']),
            getTicketById
        )
    }
}
