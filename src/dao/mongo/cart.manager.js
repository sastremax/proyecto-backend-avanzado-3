import CartModel from './models/cart.model.js';

class CartManager {

    async create() {
        return await CartModel.create({ products: [] });
    }

    async getById(id) {
        const cart = await CartModel.findById(id).populate('products.product');
        if (!cart) return null;
        cart.products = cart.products.filter(p => p.product !== null);
        return cart;
    }

    async addProduct(cid, pid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $push: { products: { product: pid, quantity: 1 } } },
            { new: true }
        ).lean();
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await CartModel.updateOne(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } }
        );
    }

    async removeProduct(cid, pid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        ).lean();
    }

    async clearCart(cid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        ).lean();
    }

}

export default new CartManager();