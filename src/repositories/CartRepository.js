import dao from '../dao/factory.js';

const { cartManager } = dao;

export class CartRepository {

    async create() {
        return await cartManager.create();
    }

    async getById(id) {
        return await cartManager.getById(id);
    }

    async addProduct(cid, pid) {
        return await cartManager.addProduct(cid, pid);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await cartManager.updateProductQuantity(cid, pid, quantity);
    }

    async removeProduct(cid, pid) {
        return await cartManager.removeProduct(cid, pid);
    }

    async clearCart(cid) {
        return await cartManager.clearCart(cid);
    }

}