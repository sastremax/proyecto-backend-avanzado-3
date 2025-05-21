import CustomRouter from './custom.router.js';
import {
    createOrder,
    getAllOrders,
    getUserOrders
} from '../controllers/orders.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

export default class OrdersRouter extends CustomRouter {

    init() {
        this.get('/', ['admin'], ...passportWithPolicy(['admin']), getAllOrders);
        this.get('/my-orders', ['user'], ...passportWithPolicy(['user']), getUserOrders);
        this.post('/', ['user'], ...passportWithPolicy(['user']), createOrder);
    }

}