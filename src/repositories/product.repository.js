import { ProductManager } from '../dao/mongo/product.manager.js';

const productManager = new ProductManager();

class ProductRepository {

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

    async findByIdWithSession(id, session) {
        return await productManager.findByIdWithSession(id, session);
    }

};

export default new ProductRepository();