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

        if (!cart) return res.notFound('Cart not found');
        res.success('Cart founded', cart);
    } catch (error) {
        return res.internalError('Error getting cart by id', error);
    }
}

export async function createCart(req, res) {
    try {
        const newCart = await Cart.create({ products: [] });
        res.created('Cart created successfully', newCart);
    } catch (error) {
        return res.internalError('Error creating cart', error);
    }
}

export async function addProductToCart(req, res) {
    try {
        const { cid, pid } = req.params;
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.badRequest('Quantity must be a positive integer');
        }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.badRequest('Invalid cart ID format');
        }

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.badRequest('Invalid product ID format');
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.notFound('Cart not found');

        const productExists = await Product.findById(pid);
        if (!productExists) return res.notFound('Product not found');

        if (quantity > productExists.stock) {
            return res.badRequest(`Requested quantity exceeds available stock (${productExists.stock})`);
        }

        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.success('Product added successfully', cart);
    } catch (error) {
        return res.internalError('Error adding product to cart', error);
    }
}

export async function removeProductFromCart(req, res) {
    try {
        const { id, productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.badRequest('Invalid cart ID format');
        }

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        const updatedProducts = cart.products.filter(p => p.product.toString() !== productId);
        if (updatedProducts.length === cart.products.length) {
            return res.notFound('Product not found in cart');
        }

        cart.products = updatedProducts;
        await cart.save();

        res.success('Product removed from cart', cart);
    } catch (error) {
        return res.internalError('Error removing product from cart', error);
    }
}

export async function clearCart(req, res) {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.badRequest('Invalid cart ID format');
        }

        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.notFound('Cart not found');

        cart.products = [];
        await cart.save();

        res.success('Cart cleared successfully', cart);
    } catch (error) {
        return res.internalError('Error clearing cart', error);
    }
}

export async function deleteCart(req, res) {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedCart) return res.notFound('Cart not found');

        res.success('Cart deleted successfully');
    } catch (error) {
        return res.internalError('Error deleting cart', error);
    }
}

export async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.badRequest('products must be a non-empty array');
        }

        for (const item of products) {
            if (!item.product || typeof item.product !== 'string' || !mongoose.Types.ObjectId.isValid(item.product)) {
                return res.badRequest('Each item must include a valid product ID');
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.badRequest('Each item must include a valid quantity greater than 0');
            }
        }

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        cart.products = products;
        await cart.save();

        res.success('Cart updated successfully', cart);
    } catch (error) {
        return res.internalError('Error updating cart', error);
    }
}

export async function updateProductQuantity(req, res) {
    try {
        const { id, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.badRequest('Invalid quantity');
        }

        const cart = await Cart.findById(id);
        if (!cart) return res.notFound('Cart not found');

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            return res.notFound('Product not found in cart');
        }

        const product = await Product.findById(productId);
        if (!product) return res.notFound('Product not found in database');

        if (quantity > product.stock) {
            return res.badRequest(`Requested quantity exceeds available stock (${product.stock})`);
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.success('Product quantity updated', cart);
    } catch (error) {
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
            return res.notFound('Cart not found');
        }

        const productsFromDB = cart.products.map(item => item.product);
        const unavailableProducts = getUnavailableProducts(cart, productsFromDB);

        if (unavailableProducts.length > 0) {
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

        const ticket = await TicketModel.create({
            code: Date.now().toString(),
            amount: totalAmount,
            purchaser: req.user.email
        });

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
        return res.internalError('Error processing cart purchase', error);
    }

}
