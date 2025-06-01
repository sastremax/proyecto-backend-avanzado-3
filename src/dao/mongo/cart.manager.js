import CartModel from '../../models/cart.model.js';

class CartManager {

    async create() {
        return await CartModel.create({ products: [] });
    }

    async getById(id) {
        try {
            console.log('[CartManager] getById - ID recibido:', id);
            const cart = await CartModel.findById(id).populate({
                path: 'products.product',
                match: {},
            });
            console.log('[CartManager] Resultado antes de filtrar:', cart);
            if (!cart) return null;
            cart.products = cart.products.filter(p => p.product !== null);
            return cart;
        } catch (error) {
            console.error('Error in cartManager.getById:', error.message);
            throw error;
        }
    }

    async addProduct(cid, pid, quantity = 1) {
        const cart = await CartModel.findById(cid);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: new mongoose.Types.ObjectId(pid), quantity });
        }

        return await cart.save();
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