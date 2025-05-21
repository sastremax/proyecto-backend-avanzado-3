import mongoose from 'mongoose';
import ProductService from '../services/product.service.js';

export async function getProducts(req, res, next) {
    try {
        const filters = {
            limit: Number.parseInt(req.query.limit) || 10,
            page: Number.parseInt(req.query.page) || 1,
            sort: req.query.sort,
            category: req.query.category,
            status: req.query.status
        };
        const products = await ProductService.getAllProducts(filters);

        req.logger.info(`Retrieved ${products.length} products`);
        res.success('Products retrieved', products);
    } catch (error) {
        req.logger.error(`Error retrieving products: ${error.message}`);
        res.internalError('Error getting products');
    }
}

export async function getProductById(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return res.badRequest('Invalid product ID format');
        }

        const product = await ProductService.getProductById(id);

        if (!product) {
            req.logger.warning(`Product not found: ${id}`);
            return res.notFound('Product not found');
        }

        req.logger.info(`Product retrieved: ${id}`);
        res.success('Product retrieved', product);

    } catch (error) {
        req.logger.error(`Error retrieving product ${req.params.id}: ${error.message}`);
        res.internalError('Error getting product');
    }
}

export async function addProduct(req, res, next) {
    try {
        const newProduct = await ProductService.createProduct(req.body);
        req.logger.info(`Product created: ${newProduct._id}`);
        res.created('Product created successfully', newProduct);

    } catch (error) {
        req.logger.error(`Error creating product: ${error.message}`);
        res.internalError('Error creating product');
    }
}

export async function updateProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return res.badRequest('Invalid product ID format');
        }

        const updated = await ProductService.updateProduct(id, req.body);
        if (!updated) {
            req.logger.warning(`Product not found for update: ${id}`);
            return res.badRequest('Product not found');
        }

        req.logger.info(`Product updated: ${id}`);
        res.success('Product updated', updated);

    } catch (error) {
        req.logger.error(`Error updating product ${req.params.id}: ${error.message}`)
        res.internalError('Error updating product');
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return res.badRequest('Invalid product ID format');
        }

        const deleted = await ProductService.deleteProduct(id);
        if (!deleted) {
            req.logger.warning(`Product not found for deletion: ${id}`);
            return res.badRequest('Product not found');
        }

        req.logger.info(`Product deleted: ${id}`);
        res.success('Product deleted', deleted);

    } catch (error) {
        req.logger.error(`Error deleting product ${req.params.id}: ${error.message}`);
        res.internalError('Error deleting product');
    }
}