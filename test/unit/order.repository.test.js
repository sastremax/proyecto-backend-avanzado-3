process.env.NODE_ENV = 'test'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../../src/config/config.js'
import OrderRepository from '../../src/repositories/order.repository.js'
import UserModel from '../../src/models/user.model.js'
import BusinessModel from '../../src/models/business.model.js'
import ProductModel from '../../src/models/product.model.js'

describe('OrderRepository', function () {
    let testOrderId = null

    const userId = '6846da55df509b2f9ff740c1'
    const businessId = '6847058368b47f981d91fa54'
    const productId = '684208af21ab5c172b40b1e3'

    before(async function () {
        this.timeout(10000)
        await mongoose.connect(config.mongo_uri)
    })

    after(async function () {
        await mongoose.disconnect()
    })

    it('should create an order and return it', async function () {
        const orderData = {
            business: businessId,
            user: userId,
            products: [
                {
                    product: productId,
                    quantity: 2
                }
            ],
            totalAmount: 200
        }

        const result = await OrderRepository.create(orderData)
        testOrderId = result._id.toString()

        expect(result).to.have.property('_id')
        expect(result.business.toString()).to.equal(businessId)
        expect(result.user.toString()).to.equal(userId)
        expect(result.products).to.be.an('array')
        expect(result.products.length).to.equal(1)
        expect(result.products[0].quantity).to.equal(2)
        expect(result.totalAmount).to.equal(200)
    })

    it('should return a list of existing orders', async function () {
        const orders = await OrderRepository.getAll()
        expect(orders).to.be.an('array')
        expect(orders.length).to.be.greaterThan(0)

        const createdOrder = orders.find(o => o._id.toString() === testOrderId)
        expect(createdOrder).to.exist
    })
})
