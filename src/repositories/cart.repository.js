import cartManager from '../dao/mongo/cart.manager.js';

class CartRepository {

    async create() {
        return await cartManager.create();
    }

    async getById(id) {
        return await cartManager.getById(id);
    }

    async addProduct(cid, pid, quantity = 1) {
        return await cartManager.addProduct(cid, pid, quantity);
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

export default new CartRepository();