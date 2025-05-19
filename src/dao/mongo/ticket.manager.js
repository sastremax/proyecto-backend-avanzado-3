import TicketModel from './models/ticket.model.js';

class TicketManager {

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

export default new TicketManager();