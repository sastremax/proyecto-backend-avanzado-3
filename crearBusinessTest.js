process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import config from './src/config/config.js'
import BusinessModel from './src/models/business.model.js'

dotenv.config({
    path: config.mode === 'test' ? './.env.test' : './.env'
})

const run = async () => {
    try {
        console.log('[Script] Connecting to database...')
        await mongoose.connect(config.mongo_uri)

        const existing = await BusinessModel.findOne({ name: 'Business Test' })
        if (existing) {
            console.log('Business already exists:', existing._id.toString())
            process.exit(0)
        }

        const newBusiness = await BusinessModel.create({
            name: 'Business Test',
            address: 'Test Address',
            products: []
        })

        console.log('Business created with ID:', newBusiness._id.toString())
        process.exit(0)
    } catch (error) {
        console.error('Error creating Business:', error.message)
        process.exit(1)
    }
}

run()
