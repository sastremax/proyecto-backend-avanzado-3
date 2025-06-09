process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import ProductRepository from '../../src/repositories/product.repository.js'

describe('ProductRepository', function () {
    let testProductId = null

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)
    })

    after(async function () {
        await mongoose.disconnect()
    })

    it('should create a product and return it', async function () {
        const productData = {
            title: 'Unit Test Product',
            description: 'Testing product',
            price: 99,
            code: `test-${Date.now()}`,
            stock: 10,
            category: 'test'
        }

        const result = await ProductRepository.create(productData)
        testProductId = result._id.toString()

        expect(result).to.have.property('_id')
        expect(result.title).to.equal(productData.title)
        expect(result.code).to.equal(productData.code)
    })

    it('should retrieve the created product by ID', async function () {
        const product = await ProductRepository.getById(testProductId)
        expect(product).to.have.property('_id')
        expect(product._id.toString()).to.equal(testProductId)
    })

    it('should update the product title', async function () {
        const newTitle = 'Updated Unit Test Product'
        const result = await ProductRepository.update(testProductId, { title: newTitle })

        const updatedProduct = await ProductRepository.getById(testProductId)
        expect(updatedProduct).to.have.property('title', newTitle)
    })

    it('should delete the product successfully', async function () {
        const result = await ProductRepository.delete(testProductId)

        const deletedProduct = await ProductRepository.getById(testProductId)
        expect(deletedProduct).to.be.null
    })
})
