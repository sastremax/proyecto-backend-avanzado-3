import CustomRouter from './custom.router.js';
import {
    getCartById,
    createCart,
    addProductToCart,
    clearCart,
    updateCart,
    updateProductQuantity,
    removeProductFromCart,
    purchaseCart
} from '../controllers/carts.controller.js';
import passportCall from '../middlewares/passportCall.middleware.js';
import { authorizationRole } from '../middlewares/auth.middleware.js';

export default class CartsRouter extends CustomRouter {
    init() {

        this.get('/:id', getCartById);
        this.post('/', createCart);
        this.post(
            '/:cid/product/:pid',
            passportCall('current'),
            authorizationRole('user'),
            addProductToCart
        );
        this.post(
            '/:id/purchase',
            passportCall('current'),
            authorizationRole('user'),
            purchaseCart
        );
        this.put(
            '/:id',
            passportCall('current'),
            authorizationRole('user'),
            clearCart
        );
        this.put(
            '/:id/products',
            passportCall('current'),
            authorizationRole('user'),
            updateCart
        );
        this.put(
            '/:id/products/:productId',
            passportCall('current'),
            authorizationRole('user'),
            updateProductQuantity
        );
        this.delete(
            '/:id/products/:productId',
            passportCall('current'),
            authorizationRole('user'),
            removeProductFromCart
        );
    }
}
