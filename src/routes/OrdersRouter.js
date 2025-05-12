import CustomRouter from './CustomRouter.js';
import { createOrder, getAllOrders } from '../controllers/orders.controller.js';

export default class OrdersRouter extends CustomRouter {

    init() {
        this.get('/', [], getAllOrders);
        this.post('/', [], createOrder);
    }

}