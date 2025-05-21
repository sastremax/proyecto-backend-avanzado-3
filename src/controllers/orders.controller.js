import OrderService from '../services/order.service.js';

export async function createOrder(req, res) {
    const orderData = {
        ...req.body,
        user: req.user.id
    };
    const result = await OrderService.createOrder(orderData);

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

export async function getUserOrders(req, res) {
    
    try {
        const userId = req.user.id;
        const orders = await OrderService.getOrdersByUser(userId);

        req.logger.info(`Orders retrieved for user ${userId} (${orders.length})`);
        res.success('Orders retrieved', orders);
    } catch (error) {
        req.logger.error(`Error retrieving user orders: ${error.message}`);
        res.internalError('Error retrieving orders', error);
    }

}