import mongoose from 'mongoose';
import OrderRepository from '../repositories/order.repository.js';
import ProductModel from '../dao/mongo/models/product.model.js';

const orderRepository = OrderRepository;

class OrderService {
    async createOrder({ business, user, products, totalAmount }) {
        if (!business || !user || !products || !totalAmount) {
            return { error: 'Missing required fields' };
        }

        const session = await mongoose.startSession();
        let finalAmount = 0;

        try {
            let orderCreated = null;

            await session.withTransaction(async () => {
                const updatedProducts = [];

                for (const item of products) {
                    const dbProduct = await ProductModel.findById(item.product).session(session);

                    if (!dbProduct) {
                        throw new Error('Product not found');
                    }

                    if (dbProduct.stock < item.quantity) {
                        throw new Error(`Insufficient stock for product ${dbProduct.title}`);
                    }

                    dbProduct.stock -= item.quantity;
                    await dbProduct.save({ session });

                    finalAmount += dbProduct.price * item.quantity;

                    updatedProducts.push({
                        product: dbProduct._id,
                        quantity: item.quantity
                    });
                }

                const created = await orderRepository.create({
                    business,
                    user,
                    products: updatedProducts,
                    totalAmount: finalAmount
                }, session);

                orderCreated = created;
            });

            return { success: true, data: { order: orderCreated, amount: finalAmount } };

        } catch (error) {
            return { error: error.message || 'Unknown error' };
        } finally {
            session.endSession();
        }
    }

    async getAllOrders() {
        return await orderRepository.getAll();
    }

}

export default new OrderService();