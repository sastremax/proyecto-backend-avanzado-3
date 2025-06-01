import { expect } from 'chai'
import supertest from 'supertest'

const requester = supertest('http://localhost:8080')

describe('API /api/products', function () {

    it('GET /api/products debe devolver un arreglo de productos', async function () {
        const res = await requester.get('/api/products')

        console.log('RESPUESTA COMPLETA:', res._body)

        expect(res.status).to.equal(200)
        expect(res._body).to.have.property('data')
        expect(Array.isArray(res._body.data.docs)).to.be.true
    })

    
    
})
