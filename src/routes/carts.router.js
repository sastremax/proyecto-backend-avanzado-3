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

export default class CartsRouter extends CustomRouter {
    init() {

        this.get('/:id', ['user'], getCartById);
        this.post('/', createCart);
        this.post('/:cid/product/:pid', ['user'], addProductToCart);
        this.post('/:id/purchase', ['user'], purchaseCart);
        this.put('/:id', ['user'], clearCart);
        this.put('/:id/products', ['user'], updateCart);
        this.put('/:id/products/:productId', ['user'], updateProductQuantity);
        this.delete('/:id/products/:productId', ['user'], removeProductFromCart);
    }
}
