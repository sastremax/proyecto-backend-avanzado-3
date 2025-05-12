import { UserModel } from '../../models/User.model.js';

export class UserManager {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }
    
    async createUser(userData) {
        return await UserModel.create(userData);
    }

    async getById(id) {
        return await UserModel.findById(id);
    }
}
