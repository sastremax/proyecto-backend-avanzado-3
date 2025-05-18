import orderManager from '../dao/mongo/OrderManager.js';

class OrderRepository {

    async create(orderData, session = null) {
        return await orderManager.create(orderData, session);
    }

    async getAll() {
        return await orderManager.getAll();
    }

}

export default new OrderRepository();