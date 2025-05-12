import ProductModel from '../models/Product.model.js';
import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';

// GET /api/products
export async function getProducts(req, res, next) {
    try {
        const products = await ProductModel.find();
        res.success('Products retrieved', products);
    } catch (error) {
        throw new CustomError('Error getting products', 500, error);
    }
}

// GET /api/products/:id
export async function getProductById(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new CustomError('Invalid product ID format', 400));
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return next(new CustomError('Product not found', 404));
        }

        res.success('Product retrieved', product);

    } catch (error) {
        throw new CustomError('Error getting product', 500, error);
    }
}

// POST /api/products
export async function addProduct(req, res, next) {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.created('Product created successfully', newProduct);
    } catch (error) {
        throw new CustomError('Error creating product', 500, error);
    }
}

// PUT /api/products/:id
export async function updateProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new CustomError('Invalid product ID format', 400));
        }

        const updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return next(new CustomError('Product not found', 400));
        }

        res.success('Product updated', updated);

    } catch (error) {
        throw new CustomError('Error updating product', 500, error);
    }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res, next) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new CustomError('Invalid product ID format', 400));
        }

        const deleted = await ProductModel.findByIdAndDelete(id);
        if (!deleted) {
            return next(new CustomError('Product not found', 400));
        }

        res.success('Product deleted', deleted);

    } catch (error) {
        throw new CustomError('Error deleting product', 500, error);
    }
}