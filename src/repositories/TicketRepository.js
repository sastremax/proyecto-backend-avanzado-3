import TicketManager from '../dao/mongo/TicketManager.js';

class TicketRepository {

    async create(data) {
        return await TicketManager.create(data);
    }

    async getById(id) {
        return await TicketManager.getById(id);
    }

    async getAll() {
        return await TicketManager.getAll();
    }

}

export default new TicketRepository();