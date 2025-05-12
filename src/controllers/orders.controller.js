import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.model.js';
import ProductModel from '../models/Product.model.js';

export async function createOrder(req, res) {

    const session = await mongoose.startSession();
    let userErrorMessage = null;
    try {
        const { business, user, products, totalAmount } = req.body;
        if (!business || !user || !products || !totalAmount) {
            return res.badRequest('Missing required fields');
        }

        let finalAmount = 0;

        await session.withTransaction(async () => {
            const updatedProducts = [];

            for (const item of products) {
                const dbProduct = await ProductModel.findById(item.product).session(session);

                if (!dbProduct) {
                    userErrorMessage = 'Product not found';
                    throw new Error();
                }

                if (dbProduct.stock < item.quantity) {
                    userErrorMessage = `Insufficient stock for product ${dbProduct.title}`;
                    throw new Error();
                }

                dbProduct.stock -= item.quantity;
                await dbProduct.save({ session });

                finalAmount += dbProduct.price * item.quantity;

                updatedProducts.push({
                    product: dbProduct._id,
                    quantity: item.quantity
                });
            }

            const order = await OrderModel.create(
                [
                    {
                        business,
                        user,
                        products: updatedProducts,
                        totalAmount: finalAmount
                    }
                ],
                { session }
            );

            return res.success('Order created successfully', order[0]);
        });
    } catch (error) {
        if (userErrorMessage) {
            return res.badRequest(userErrorMessage);
        }        
        return res.internalError('Unexpected error during order creation', error);
    } finally {
        session.endSession();
    }

}

export async function getAllOrders(req, res) {

    try {
        const orders = await OrderModel.find().populate('user').populate('business').populate('products.product');
        res.success('Orders retrieved', orders);
    } catch (error) {
        res.internalError('Error retrieving orders', error);
    }

}