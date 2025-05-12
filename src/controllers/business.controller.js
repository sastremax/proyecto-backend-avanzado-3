import { BusinessModel } from '../models/Business.model.js';

export async function createBusiness(req, res) {

    try {
        const { name, address, products } = req.body;
        const newBusiness = await BusinessModel.create({ name, address, products });
        res.success('Business created', newBusiness);
    } catch (error) {
        return res.internalError('Error creating business', error);
    }

}