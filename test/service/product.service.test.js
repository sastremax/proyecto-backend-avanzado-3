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

    it('createProduct debe crear un producto y devolver un _id', async () => {
        const mockProduct = {
            title: 'Producto Test',
            description: 'Descripción de prueba',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const result = await productService.createProduct(mockProduct)
        assert.ok(result._id)
    })

    it('getAllProducts debe devolver al menos un producto creado', async () => {
        const mockProduct = {
            title: 'Producto Test',
            description: 'Descripción de prueba',
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

    it('getProductById debe devolver el producto correcto', async () => {
        const mockProduct = {
            title: 'Producto Test',
            description: 'Descripción de prueba',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const created = await productService.createProduct(mockProduct)
        const result = await productService.getProductById(created._id)
        assert.strictEqual(result.title, mockProduct.title)
    })

    it('updateProduct debe modificar el título del producto', async () => {
        const mockProduct = {
            title: 'Producto Test',
            description: 'Descripción de prueba',
            code: `test-${Date.now()}`,
            price: 150,
            stock: 10,
            category: 'testing'
        }
        const created = await productService.createProduct(mockProduct)
        const updated = await productService.updateProduct(created._id, { title: 'Actualizado' })
        assert.strictEqual(updated.title, 'Actualizado')
    })

    it('deleteProduct debe eliminar el producto correctamente', async () => {
        const mockProduct = {
            title: 'Producto Test',
            description: 'Descripción de prueba',
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
