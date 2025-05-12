import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';

// middleware de validación
export function validateProduct(req, res, next) {
    const { title, description, price } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return next(new CustomError('Invalid or missing title', 400));
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return next(new CustomError('Invalid or missing description', 400));
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return next(new CustomError('Invalid or missing price', 400));
    }

    next();
}

export function validateProductId(req, res, next) {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomError('Invalid product ID format', 400));
    }

    next();

}

export function validatePartialProduct(req, res, next) {
    
    const { title, description, price } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return next(new CustomError('Invalid title', 400));
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        return next(new CustomError('Invalid description', 400));
    }

    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
        return next(new CustomError('Invalid price', 400));
    }

    next();

}