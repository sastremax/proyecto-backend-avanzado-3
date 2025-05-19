import mongoose from 'mongoose';
import CartService from '../services/cart.service.js';

export async function getCartById(req, res) {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid cart ID format: ${id}`);
            return res.badRequest('Invalid cart ID format');
        }

        const cart = await CartService.getCartById(id);
        if (!cart) {
            req.logger.warning(`Cart not found: ${id}`);
            return res.notFound('Cart not found');
        }

        req.logger.info(`Cart retrieved: ${id}`);
        res.success('Cart retrieved', cart);
    } catch (error) {
        req.logger.error(`Error retrieving cart: ${error.message}`);
        return res.internalError('Error getting cart');
    }

}

export async function createCart(req, res) {

    try {
        const cart = await CartService.createCart();
        req.logger.info(`Cart created: ${cart._id}`);
        res.created('Cart created successfully', cart);
    } catch (error) {
        req.logger.error(`Error creating cart: ${error.message}`);
        return res.internalError('Error creating cart');
    }

}

export async function addProductToCart(req, res) {

    try {
        const { cid, pid } = req.params;
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            req.logger.warning('Invalid quantity');
            return res.badRequest('Quantity must be a positive integer');
        }

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            req.logger.warning('Invalid ID format');
            return res.badRequest('Invalid cart or product ID format');
        }

        const result = await CartService.addProductToCart(cid, pid, quantity);
        if (!result) return res.notFound('Cart or product not found');
        if (result === 'insufficient_stock') return res.badRequest('Requested quantity exceeds available stock');

        req.logger.info(`Product ${pid} added to cart ${cid}`);
        res.success('Product added to cart', result);
    } catch (error) {
        req.logger.error(`Error adding product to cart: ${error.message}`);
        return res.internalError('Error adding product to cart');
    }

}

export async function removeProductFromCart(req, res) {

    try {
        const { id, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
            req.logger.warning('Invalid cart or product ID format');
            return res.badRequest('Invalid ID format');
        }

        const updatedCart = await CartService.removeProductFromCart(id, productId);
        if (!updatedCart) return res.notFound('Cart not found');

        req.logger.info(`Product ${productId} removed from cart ${id}`);
        res.success('Product removed from cart', updatedCart);
    } catch (error) {
        req.logger.error(`Error removing product: ${error.message}`);
        return res.internalError('Error removing product from cart');
    }

}

export async function clearCart(req, res) {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid cart ID format: ${id}`);
            return res.badRequest('Invalid cart ID format');
        }

        const clearedCart = await CartService.clearCart(id);
        if (!clearedCart) return res.notFound('Cart not found');

        req.logger.info(`Cart cleared: ${id}`);
        res.success('Cart cleared successfully', clearedCart);
    } catch (error) {
        req.logger.error(`Error clearing cart: ${error.message}`);
        return res.internalError('Error clearing cart');
    }

}

export async function updateCart(req, res) {

    try {
        const { id } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            req.logger.warning('Invalid or empty products array');
            return res.badRequest('Products must be a non-empty array');
        }

        const updatedCart = await CartService.updateCart(id, products);
        if (!updatedCart) return res.notFound('Cart not found');

        req.logger.info(`Cart updated: ${id}`);
        res.success('Cart updated successfully', updatedCart);
    } catch (error) {
        req.logger.error(`Error updating cart: ${error.message}`);
        return res.internalError('Error updating cart');
    }

}

export async function updateProductQuantity(req, res) {

    try {
        const { id, productId } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            req.logger.warning('Invalid quantity');
            return res.badRequest('Invalid quantity');
        }

        const updated = await CartService.updateProductQuantity(id, productId, quantity);
        if (!updated) return res.notFound('Cart or product not found');

        req.logger.info(`Updated quantity of ${productId} in cart ${id}`);
        res.success('Product quantity updated', updated);
    } catch (error) {
        req.logger.error(`Error updating quantity: ${error.message}`);
        return res.internalError('Error updating product quantity');
    }

}

export async function purchaseCart(req, res) {

    try {
        console.log('req.user en purchaseCart:', req.user);
        const { id } = req.params;
        const result = await CartService.purchaseCart(id, req.user);

        if (result.error === 'not_found') return res.notFound('Cart not found');

        if (result.error === 'unavailable_products') {
            return res.badRequest({
                message: 'Some products are unavailable',
                code: 'UNAVAILABLE_PRODUCTS',
                cause: result.data
            });
        }

        res.success('Purchase completed', result);
    } catch (error) {
        req.logger.error(`Error processing purchase: ${error.message}`);
        return res.internalError('Error processing purchase');
    }

}