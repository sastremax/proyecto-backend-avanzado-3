import ProductRepository from '../repositories/product.repository.js';

class ProductService {

    async getAllProducts(filters) {

        return await ProductRepository.getAll(filters);
    }

    async getProductById(id) {
        return await ProductRepository.getById(id);
    }

    async createProduct(data) {
        return await ProductRepository.create(data);
    }

    async updateProduct(id, data) {
        return await ProductRepository.update(id, data);
    }

    async deleteProduct(id) {
        return await ProductRepository.delete(id);
    }

}

export default new ProductService();