import TicketModel from '../../models/Ticket.model.js';

export class TicketManager {

    async create(data) {
        return await TicketModel.create(data);
    }

    async getById(id) {
        return await TicketModel.findById(id).lean();
    }

    async getAll() {
        return await TicketModel.find().lean();
    }

}