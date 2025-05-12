import { handlePolicies } from '../middlewares/handlePolicies.js';
import CustomRouter from './CustomRouter.js';
import multerUpload from '../middlewares/multer.middleware.js';
import { attachUserFromToken } from '../middlewares/viewUser.middleware.js';
import {
    renderRegister,
    renderLogin,
    renderProducts,
    renderCart,
    updateProductView,
    deleteProductView,
    uploadProductImage,
    renderProductDetails
} from '../controllers/views.controller.js';

export default class ViewsRouter extends CustomRouter {

    init() {

        // vista de registro
        this.get('/register', renderRegister);

        // vista de logueo
        this.get('/login', renderLogin);

        // vista de productos
        this.get('/products/view',
            attachUserFromToken,
            handlePolicies(['USER', 'ADMIN']),
            renderProducts
        );

        // vista de un carrito
        this.get('/cart/:id', renderCart);

        // Vista para actualizar un producto desde el navegador
        this.post('/products/update/:id', updateProductView);

        // Vista para eliminar un producto desde el navegador
        this.post('/products/delete/:id', deleteProductView);

        // Subir imagenes desde el navegador
        this.post('/products/:id/upload', multerUpload.single('image'), uploadProductImage);

        // Vista de productos
        this.get('/products/details/:id',
            attachUserFromToken,
            handlePolicies(['USER', 'ADMIN']),
            renderProductDetails
        );

    }

}