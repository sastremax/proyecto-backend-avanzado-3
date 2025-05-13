import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import TicketModel from '../models/Ticket.model.js';
import mongoose from 'mongoose';
import { sendWhatsAppMessage } from '../utils/twilio.js';
import config from '../config/config.js';
import { calculateCartTotal, getUnavailableProducts } from 'cart-utils-maxi';

export async function getCartById(req, res) {
    try {
        const cart = await Cart.findById(req.params.id).populate({
            path: 'products.product',
            select: 'title price description stock category thumbnails'
        });

        if (!cart) {
            req.logger.warning(`Cart not found: ${req.params.id}`);
            return res.notFound('Cart not found');
        }

        req.logger.info(`Cart retrieved: ${req.params.id}`);
        res.success('Cart founded', cart);

    } catch (error) {
        req.logger.error(`Error retrieving cart: ${error.message}`);
        return res.internalError('Error getting cart by id', error);
    }
}

export async function createCart(req, res) {
    try {
        const newCart = await Cart.create({ products: [] });
        req.logger.info(`Cart created: ${newCart._id}`);
        res.created('Cart created successfully', newCart);

    } catch (error) {
        req.logger.error(`Error creating cart: ${error.message}`);
        return res.internalError('Error creating cart', error);
    }
}

export async function addProductToCart(req, res) {
    try {
        const { cid, pid } = req.params;
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            req.logger.warning('Invalid quantity value');
            return res.badRequest('Quantity must be a positive integer');
        }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            req.logger.warning(`Invalid cart ID format: ${cid}`);
            return res.badRequest('Invalid cart ID format');
        }

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            req.logger.warning(`Invalid product ID format: ${pid}`);
            return res.badRequest('Invalid product ID format');
        }

        const cart = await Cart.findById(cid);
        req.logger.warning(`Cart not found: ${cid}`);
        if (!cart) return res.notFound('Cart not found');

        const productExists = await Product.findById(pid);
        req.logger.warning(`Product not found: ${pid}`);
        if (!productExists) return res.notFound('Product not found');

        if (quantity > productExists.stock) {
            req.logger.warning(`Stock exceeded for product ${pid}. Requested: ${quantity}, Available: ${productExists.stock}`);
            return res.badRequest(`Requested quantity exceeds available stock (${productExists.stock})`);
        }

        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        req.logger.info(`Product ${pid} added to cart ${cid} with quantity ${quantity}`);
        res.success('Product added successfully', cart);

    } catch (error) {
        req.logger.error(`Error adding product to cart: ${error.message}`);
        return res.internalError('Error adding product to cart', error);
    }
}

export async function removeProductFromCart(req, res) {
    try {
        const { id, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid cart ID format: ${id}`);
            return res.badRequest('Invalid cart ID format');
        }

        const cart = await Cart.findById(id);
        req.logger.warning(`Cart not found: ${id}`);
        if (!cart) return res.notFound('Cart not found');

        const updatedProducts = cart.products.filter(p => p.product.toString() !== productId);
        if (updatedProducts.length === cart.products.length) {
            req.logger.warning(`Product ${productId} not found in cart ${id}`);
            return res.notFound('Product not found in cart');
        }

        cart.products = updatedProducts;
        await cart.save();

        req.logger.info(`Product ${productId} removed from cart ${id}`);
        res.success('Product removed from cart', cart);

    } catch (error) {
        req.logger.error(`Error removing product from cart: ${error.message}`);
        return res.internalError('Error removing product from cart', error);
    }
}

export async function clearCart(req, res) {
    try {

        const cartId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            req.logger.warning(`Invalid cart ID format: ${cartId}`);
            return res.badRequest('Invalid cart ID format');
        }

        const cart = await Cart.findById(req.params.id);
        req.logger.warning(`Cart not found: ${cartId}`);
        if (!cart) return res.notFound('Cart not found');

        cart.products = [];
        await cart.save();

        req.logger.info(`Cart cleared: ${cartId}`);
        res.success('Cart cleared successfully', cart);

    } catch (error) {
        req.logger.error(`Error clearing cart: ${error.message}`);
        return res.internalError('Error clearing cart', error);
    }
}

export async function deleteCart(req, res) {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);

        if (!deletedCart) {
            req.logger.warning(`Cart not found for deletion: ${cartId}`);
            return res.notFound('Cart not found');
        }

        req.logger.info(`Cart deleted: ${cartId}`);
        res.success('Cart deleted successfully');

    } catch (error) {
        req.logger.error(`Error deleting cart: ${error.message}`);
        return res.internalError('Error deleting cart', error);
    }
}

export async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            req.logger.warning('Invalid or empty products array');
            return res.badRequest('products must be a non-empty array');
        }

        for (const item of products) {
            if (!item.product || typeof item.product !== 'string' || !mongoose.Types.ObjectId.isValid(item.product)) {
                req.logger.warning('Invalid product ID in updateCart');
                return res.badRequest('Each item must include a valid product ID');
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                req.logger.warning('Invalid quantity in updateCart');
                return res.badRequest('Each item must include a valid quantity greater than 0');
            }
        }

        const cart = await Cart.findById(id);
        if (!cart) {
            req.logger.warning(`Cart not found: ${id}`);
            return res.notFound('Cart not found');
        }

        cart.products = products;
        await cart.save();

        req.logger.info(`Cart updated: ${id} with ${products.length} products`);
        res.success('Cart updated successfully', cart);
    } catch (error) {
        req.logger.error(`Error updating cart: ${error.message}`);
        return res.internalError('Error updating cart', error);
    }
}

export async function updateProductQuantity(req, res) {
    try {
        const { id, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            req.logger.warning('Invalid quantity provided for updateProductQuantity');
            return res.badRequest('Invalid quantity');
        }

        const cart = await Cart.findById(id);
        if (!cart) {
            req.logger.warning(`Cart not found: ${id}`);
            return res.notFound('Cart not found');
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            req.logger.warning(`Product ${productId} not found in cart ${id}`);
            return res.notFound('Product not found in cart');
        }

        const product = await Product.findById(productId);
        if (!product) {
            req.logger.warning(`Product ${productId} not found in DB`);
            return res.notFound('Product not found in database');
        }

        if (quantity > product.stock) {
            req.logger.warning(`Quantity ${quantity} exceeds stock for product ${productId} (stock: ${product.stock})`);
            return res.badRequest(`Requested quantity exceeds available stock (${product.stock})`);
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        req.logger.info(`Quantity updated for product ${productId} in cart ${id} to ${quantity}`);
        res.success('Product quantity updated', cart);
    } catch (error) {
        req.logger.error(`Error updating product quantity: ${error.message}`);
        return res.internalError('Error updating product quantity', error);
    }
}

export async function purchaseCart(req, res) {

    try {
        const cartId = req.params.id;

        const cart = await Cart.findById(cartId).populate({
            path: 'products.product',
            select: 'title price stock'
        });

        if (!cart) {
            req.logger.warning(`Cart not found: ${cartId}`);
            return res.notFound('Cart not found');
        }

        const productsFromDB = cart.products.map(item => item.product);
        const unavailableProducts = getUnavailableProducts(cart, productsFromDB);

        if (unavailableProducts.length > 0) {
            req.logger.warning(`Unavailable products in cart ${cartId}: ${unavailableProducts.map(p => p._id).join(', ')}`);
            return res.badRequest({
                message: 'Some products are not available for purchase',
                code: 'UNAVAILABLE_PRODUCTS',
                cause: unavailableProducts
            });
        }

        let totalAmount = calculateCartTotal(cart);
        const productsPurchased = [];

        for (const item of cart.products) {
            const { product, quantity } = item;
            product.stock -= quantity;
            await product.save();
            productsPurchased.push(product._id.toString());
        }

        if (productsPurchased.length === 0) {
            req.logger.info(`No products were purchased in cart ${cartId}`);
            return res.success('No products were purchased', {
                productsNotPurchased
            });
        }

        const ticket = await TicketModel.create({
            code: Date.now().toString(),
            amount: totalAmount,
            purchaser: req.user.email
        });

        req.logger.info(`Purchase completed for ${req.user.email} - Ticket: ${ticket.code}, Amount: ${totalAmount}`);

        await sendWhatsAppMessage(
            config.whatsapp_dest,
            `Hello ${req.user.first_name}, your purchase was confirmed. Total amount: $${totalAmount}`
        );
        cart.products = cart.products.filter(item => {
            const id = item.product?._id?.toString();
            return !productsPurchased.includes(id);
        });

        await cart.save();

        res.success('Purchase completed', {
            ticket,
            productsNotPurchased: []
        });

    } catch (error) {
        req.logger.error(`Error processing purchase: ${error.message}`);
        return res.internalError('Error processing cart purchase', error);
    }

}
