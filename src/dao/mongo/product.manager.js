import ProductModel from '../../models/product.model.js'

export class ProductManager {

    async getAll({ limit = 10, page = 1, sort, category, status }) {
        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const options = {
            limit,
            page,
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        return await ProductModel.paginate(query, options);
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