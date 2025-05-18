import OrderService from '../services/OrderService.js';

export async function createOrder(req, res) {

    const result = await OrderService.createOrder(req.body);

    if (result.error) {
        req.logger.warning(`Order creation error: ${result.error}`);
        return res.badRequest(result.error);
    }

    const { order, amount } = result.data;
    req.logger.info(`Order created by ${order.user}, total: $${amount}`);
    res.success('Order created successfully', order);

}

export async function getAllOrders(req, res) {

    try {
        const orders = await OrderService.getAllOrders();

        req.logger.info(`All orders retrieved (${orders.length})`);
        res.success('Orders retrieved', orders);

    } catch (error) {
        req.logger.error(`Error retrieving orders: ${error.message}`);
        res.internalError('Error retrieving orders', error);
    }

}