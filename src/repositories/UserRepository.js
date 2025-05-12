import dao from '../dao/factory.js';

const { userManager } = dao;

export class UserRepository {

    async getAll() {
        return await userManager.getAll();
    }

    async getBy(filter) {
        return await userManager.getBy(filter);
    }

    async create(data) {
        return await userManager.create(data);
    }

    async deleteById(id) {
        return await userManager.deleteById(id);
    }

}