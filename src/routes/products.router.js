import CustomRouter from './CustomRouter.js';
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
import passportCall from '../middlewares/passportCall.middleware.js';
import { authorizationRole } from '../middlewares/auth.middleware.js';

export default class ProductsRouter extends CustomRouter {

    init() {

        this.get('/', getProducts);
        this.get('/:id', validateProductId, getProductById);
        this.post('/', passportCall('current'), authorizationRole('admin'), validateProduct, addProduct);
        this.put('/:id', passportCall('current'), authorizationRole('admin'), validateProductId, validatePartialProduct, updateProduct);
        this.delete('/:id', passportCall('current'), authorizationRole('admin'), validateProductId, deleteProduct);

    }

}