import ProductModel from '../models/Product.model.js';
import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';

export async function getProducts(req, res, next) {
    try {
        const products = await ProductModel.find();
        req.logger.info(`Retrieved ${products.length} products`);
        res.success('Products retrieved', products);
    } catch (error) {
        req.logger.error(`Error retrieving products: ${error.message}`);
        throw new CustomError('Error getting products', 500, error);
    }
}

export async function getProductById(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return next(new CustomError('Invalid product ID format', 400));
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            req.logger.warning(`Product not found: ${id}`);
            return next(new CustomError('Product not found', 404));
        }

        req.logger.info(`Product retrieved: ${id}`);
        res.success('Product retrieved', product);

    } catch (error) {
        req.logger.error(`Error retrieving product ${req.params.id}: ${error.message}`);
        throw new CustomError('Error getting product', 500, error);
    }
}

export async function addProduct(req, res, next) {
    try {
        const newProduct = await ProductModel.create(req.body);
        req.logger.info(`Product created: ${newProduct._id}`);
        res.created('Product created successfully', newProduct);

    } catch (error) {
        req.logger.error(`Error creating product: ${error.message}`);
        throw new CustomError('Error creating product', 500, error);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return next(new CustomError('Invalid product ID format', 400));
        }

        const updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            req.logger.warning(`Product not found for update: ${id}`);
            return next(new CustomError('Product not found', 400));
        }

        req.logger.info(`Product updated: ${id}`);
        res.success('Product updated', updated);

    } catch (error) {
        req.logger.error(`Error updating product ${req.params.id}: ${error.message}`)
        throw new CustomError('Error updating product', 500, error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.logger.warning(`Invalid product ID format: ${id}`);
            return next(new CustomError('Invalid product ID format', 400));
        }

        const deleted = await ProductModel.findByIdAndDelete(id);
        if (!deleted) {
            req.logger.warning(`Product not found for deletion: ${id}`);
            return next(new CustomError('Product not found', 400));
        }

        req.logger.info(`Product deleted: ${id}`);
        res.success('Product deleted', deleted);

    } catch (error) {
        req.logger.error(`Error deleting product ${req.params.id}: ${error.message}`);
        throw new CustomError('Error deleting product', 500, error);
    }
}