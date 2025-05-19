import { OrderModel } from './models/order.model.js';

class OrderManager {

    async create(orderData, session = null) {
        const [order] = await OrderModel.create([orderData], { session });
        return order;
    }

    async getAll() {
        return await OrderModel.find()
            .populate('user')
            .populate('business')
            .populate('products.product');
    }

}

export default new OrderManager();