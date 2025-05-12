import dao from '../dao/factory.js';

const { ticketManager } = dao;

export class TicketRepository {

    async create(data) {
        return await ticketManager.create(data);
    }

    async getById(id) {
        return await ticketManager.getById(id);
    }

    async getAll() {
        return await ticketManager.getAll();
    }

}