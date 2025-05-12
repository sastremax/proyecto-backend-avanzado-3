import dao from '../dao/factory.js';

const { productManager } = dao;

export class ProductRepository {

    async getAll() {
        return await productManager.getAll();
    }

    async getById(id) {
        return await productManager.getById(id);
    }

    async create(data) {
        return await productManager.create(data);
    }

    async update(id, data) {
        return await productManager.update(id, data);
    }

    async delete(id) {
        return await productManager.delete(id);
    }

}