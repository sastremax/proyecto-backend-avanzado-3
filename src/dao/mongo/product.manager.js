import ProductModel from './models/product.model.js';

export class ProductManager {

    async getAll() {
        return await ProductModel.find().lean();
    }

    async getById(id) {
        return await ProductModel.findById(id).lean();
    }

    async create(data) {
        return await ProductModel.create(data);
    }

    async update(id, data) {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id).lean();
    }

    async findByIdWithSession(id, session) {
        return await ProductModel.findById(id).session(session);
    }

}