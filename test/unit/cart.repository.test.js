process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import CartRepository from '../../src/repositories/cart.repository.js'
import ProductRepository from '../../src/repositories/product.repository.js'

describe('CartRepository', function () {
    let testCartId = null
    let testProductId = null

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)

        const cart = await CartRepository.create()
        testCartId = cart._id.toString()

        const productData = {
            title: 'Unit Test Product Repo',
            description: 'Testing product repo',
            price: 120,
            code: `test-repo-${Date.now()}`,
            stock: 15,
            category: 'test'
        }
        const product = await ProductRepository.create(productData)
        testProductId = product._id.toString()
    })

    after(async function () {
        await mongoose.disconnect()
    })

    it('should retrieve the created cart by ID', async function () {
        const cart = await CartRepository.getById(testCartId)
        expect(cart).to.have.property('_id')
        expect(cart._id.toString()).to.equal(testCartId)
    })

    it('should add product to cart', async function () {
        const cart = await CartRepository.getById(testCartId)
        cart.products.push({ product: testProductId, quantity: 2 })
        const savedCart = await cart.save()

        const addedProduct = savedCart.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })

        expect(addedProduct).to.exist
        expect(addedProduct.quantity).to.equal(2)
    })

    it('should update product quantity in cart', async function () {
        const result = await CartRepository.updateProductQuantity(testCartId, testProductId, 5)
        expect(result).to.have.property('acknowledged', true)
        expect(result).to.have.property('modifiedCount').that.is.greaterThan(0)

        const cart = await CartRepository.getById(testCartId)
        const updatedProduct = cart.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })
        expect(updatedProduct).to.exist
        expect(updatedProduct.quantity).to.equal(5)
    })

    it('should remove product from cart', async function () {
        const updatedCart = await CartRepository.removeProduct(testCartId, testProductId)

        const removedProduct = updatedCart.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })

        expect(removedProduct).to.not.exist
    })

    it('should clear the cart', async function () {
        await CartRepository.updateProductQuantity(testCartId, testProductId, 1)
        const clearedCart = await CartRepository.clearCart(testCartId)
        expect(clearedCart.products).to.be.an('array').that.is.empty
    })
})
