process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import CartService from '../../src/services/cart.service.js'
import ProductRepository from '../../src/repositories/product.repository.js'
import CartRepository from '../../src/repositories/cart.repository.js'

describe('CartService', function () {
    let testCartId = null
    let testProductId = null

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)

        const cart = await CartRepository.create()
        testCartId = cart._id.toString()

        const productData = {
            title: 'Unit Test Product',
            description: 'Testing product',
            price: 100,
            code: `test-${Date.now()}`,
            stock: 10,
            category: 'test'
        }
        console.log(`[DEBUG] addProductToCart - productId recibido: ${testProductId}`);
        const product = await ProductRepository.create(productData)
        testProductId = product._id.toString()
    })

    after(async function () {
        await mongoose.disconnect()
    })

    it('should retrieve a cart by ID', async function () {
        const cart = await CartService.getCartById(testCartId)
        expect(cart).to.have.property('_id')
        expect(cart._id.toString()).to.equal(testCartId)
    })

    it('should add a product to the cart', async function () {
        const result = await CartService.addProductToCart(testCartId, testProductId, 2)
        const addedProduct = result.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })
        expect(addedProduct).to.exist
        expect(addedProduct.quantity).to.equal(2)
    })

    it('should update product quantity in cart', async function () {
        const result = await CartService.updateProductQuantity(testCartId, testProductId, 5)
        expect(result).to.have.property('acknowledged', true)
        expect(result).to.have.property('modifiedCount').that.is.greaterThan(0)

        const cart = await CartService.getCartById(testCartId)
        const updatedProduct = cart.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })
        expect(updatedProduct).to.exist
        expect(updatedProduct.quantity).to.equal(5)
    })

    it('should remove product from cart', async function () {
        const updatedCart = await CartService.removeProductFromCart(testCartId, testProductId)
        const removedProduct = updatedCart.products.find(p => {
            const prodId = typeof p.product === 'string' ? p.product : p.product._id
            return prodId.toString() === testProductId
        })
        expect(removedProduct).to.not.exist
    })

    it('should clear the cart', async function () {
        await CartService.addProductToCart(testCartId, testProductId, 1)
        const clearedCart = await CartService.clearCart(testCartId)
        expect(clearedCart.products).to.be.an('array').that.is.empty
    })
})
