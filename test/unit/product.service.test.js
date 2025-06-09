process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import Assert from 'node:assert'
import config from '../../src/config/config.js'
import productService from '../../src/services/product.service.js'

const assert = Assert.strict

describe('Testing ProductService', () => {
    before(async () => {
        await mongoose.connect(config.mongo_uri)
    })

    it('createProduct should create a product and return _id', async () => {
        const mockProduct = {
            title: 'Product Test',
            description: 'Test description',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const result = await productService.createProduct(mockProduct)
        assert.ok(result._id)
    })

    it('getAllProducts should return at least one created product', async () => {
        const mockProduct = {
            title: 'Product Test',
            description: 'Test description',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        await productService.createProduct(mockProduct)
        const result = await productService.getAllProducts({})
        assert.ok(Array.isArray(result.docs))
        assert.ok(result.docs.length > 0)
    })

    it('getProductById should return the correct product by id', async () => {
        const mockProduct = {
            title: 'Product Test',
            description: 'Test description',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const created = await productService.createProduct(mockProduct)
        const result = await productService.getProductById(created._id)
        assert.strictEqual(result.title, mockProduct.title)
    })

    it('updateProduct should update the product title', async () => {
        const mockProduct = {
            title: 'Product Test',
            description: 'Test description',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const created = await productService.createProduct(mockProduct)
        const updated = await productService.updateProduct(created._id, { title: 'Update' })
        assert.strictEqual(updated.title, 'Update')
    })

    it('deleteProduct should delete the product successfully', async () => {
        const mockProduct = {
            title: 'Product Test',
            description: 'Test description',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const created = await productService.createProduct(mockProduct)
        const deleted = await productService.deleteProduct(created._id)
        assert.ok(deleted._id)
        const check = await productService.getProductById(created._id)
        assert.strictEqual(check, null)
    })
})
