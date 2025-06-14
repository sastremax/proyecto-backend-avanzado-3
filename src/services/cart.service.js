import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';
import { calculateCartTotal, getUnavailableProducts } from 'cart-utils-maxi';
import { sendWhatsAppMessage } from '../utils/twilio.js';
import config from '../config/config.js';
import OrderService from './order.service.js';

class CartService {
    async createCart() {
        return await CartRepository.create();
    }

    async getCartById(id) {
        try {
            console.log('[CartService] getCartById - ID recibido:', id);
            const cart = await CartRepository.getById(id);
            console.log('[CartService] getCartById - Resultado:', cart);
            return cart;
        } catch (error) {
            console.error('Error en CartService.getCartById:', error.message);
            throw error;
        }
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await CartRepository.getById(cid);
        if (!cart) return null;

        const product = await ProductRepository.getById(pid);
        if (!product) return null;

        if (quantity > product.stock) return 'insufficient_stock';

        const existingProduct = cart.products.find(p => p.product._id.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: product._id, quantity });
        }
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cid, pid) {
        return await CartRepository.removeProduct(cid, pid);
    }

    async clearCart(cid) {
        return await CartRepository.clearCart(cid);
    }

    async updateCart(id, products) {
        const cart = await CartRepository.getById(id);
        if (!cart) return null;
        cart.products = products;
        return cart;
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await CartRepository.updateProductQuantity(cid, pid, quantity);
    }

    async purchaseCart(cartId, user) {
        try {
            console.log('Entered purchaseCart with cartId:', cartId);
            console.log('User object:', user);

            const cart = await CartRepository.getById(cartId);
            if (!cart) return { error: 'not_found' };

            if (!cart.products.length) throw new Error('Cart is empty');

            const unavailable = getUnavailableProducts(cart, cart.products.map(p => p.product));
            if (unavailable.length > 0) {
                return { error: 'unavailable_products', data: unavailable };
            }

            const firstProductId = cart.products[0]?.product?._id;
            if (!firstProductId) throw new Error('Cart has no products');

            const BusinessModel = (await import('../models/business.model.js')).default;
            const business = await BusinessModel.findOne({ products: firstProductId });

            if (!business) throw new Error('Business not found for product');

            const elBusinessId = business._id;

            const totalAmount = calculateCartTotal(cart);
            const productsPurchased = [];

            for (const item of cart.products) {
                const { product, quantity } = item;
                product.stock -= quantity;
                await product.save();
                productsPurchased.push(product._id.toString());
            }

            const ticket = await TicketRepository.create({
                code: Date.now().toString(),
                amount: totalAmount,
                purchaser: user.email
            });

            await OrderService.createOrder({
                business: elBusinessId,
                user: user.id,
                products: cart.products.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                totalAmount
            });
            
            try {
                await sendWhatsAppMessage(
                    config.whatsapp_dest,
                    `Hello ${user.first_name}, your purchase was confirmed. Total: $${totalAmount}`
                );
            } catch (e) {
                console.warn('WhatsApp error (non-blocking):', e.message);
            }

            cart.products = cart.products.filter(item => {
                const id = item.product?._id?.toString();
                return !productsPurchased.includes(id);
            });

            await cart.save();
            console.log('Creating ticket with amount:', totalAmount, 'and purchaser:', user.email);
            return {
                ticket,
                productsNotPurchased: []
            };
        } catch (error) {
            console.error('Error purchaseCart:', error.message);
            console.error('Full stack:', error.stack);
            throw error;
        }
    }
}

export default new CartService();