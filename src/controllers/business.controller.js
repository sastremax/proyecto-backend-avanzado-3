import { BusinessModel } from '../dao/mongo/models/business.model.js';

export async function createBusiness(req, res) {

    try {
        const { name, address, products } = req.body;
        const newBusiness = await BusinessModel.create({ name, address, products });

        req.logger.info(`Business created: ${name} at ${address}`);
        res.success('Business created', newBusiness);
    } catch (error) {
        req.logger.error(`Error creating business: ${error.message}`);
        return res.internalError('Error creating business', error);
    }

}