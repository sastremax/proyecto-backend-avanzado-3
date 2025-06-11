import ProductModel from '../../src/models/product.model.js';
import { setSharedProductId } from './testData.js';
import BusinessModel from '../../src/models/business.model.js';

export const setupTestProduct = async () => {
    const productData = {
        title: 'Test Product Shared',
        description: 'Test product for carts and tickets',
        price: 100,
        code: `TEST-${Date.now()}`,
        stock: 50,
        category: 'test',
        status: 'available',
        thumbnails: []
    };

    const product = await ProductModel.create(productData);
    setSharedProductId(product._id.toString());

    await BusinessModel.updateOne(
        { name: 'Business Test' },
        { $addToSet: { products: product._id } },
        { upsert: true }
    );
};
