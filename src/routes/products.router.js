import CustomRouter from './custom.router.js';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js';
import {
    validateProduct,
    validateProductId,
    validatePartialProduct
} from '../middlewares/error.middleware.js';

export default class ProductsRouter extends CustomRouter {

    init() {

        this.get('/', getProducts);
        this.get('/:id', validateProductId, getProductById);
        this.post('/', ['admin'], validateProduct, addProduct);
        this.put('/:id', ['admin'], validateProductId, validatePartialProduct, updateProduct);
        this.delete('/:id', ['admin'], validateProductId, deleteProduct);

    }

}