import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';
import EErrors from '../utils/EErrors.js';

export function validateProduct(req, res, next) {
    const { title, description, price } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return next(new CustomError({
            message: 'Invalid or missing title',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Title must be a non-empty string'
        }));
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return next(new CustomError({
            message: 'Invalid or missing description',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Description must be a non-empty string'
        }));
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return next(new CustomError({
            message: 'Invalid or missing price',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Price must be a number greater than 0'
        }));
    }

    next();
}

export function validateProductId(req, res, next) {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomError({
            message: 'Invalid product ID format',
            statusCode: 400,
            code: EErrors.INVALID_PARAM,
            cause: 'Expected a valid MongoDB ObjectId'
        }));
    }
    next();

}

export function validatePartialProduct(req, res, next) {
    
    const { title, description, price } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return next(new CustomError({
            message: 'Invalid title',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Title must be a non-empty string if provided'
        }));
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        return next(new CustomError({
            message: 'Invalid description',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Description must be a non-empty string if provided'
        }));
    }

    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
        return next(new CustomError({
            message: 'Invalid price',
            statusCode: 400,
            code: EErrors.INCOMPLETE_DATA,
            cause: 'Price must be a number greater than 0 if provided'
        }));
    }

    next();

}