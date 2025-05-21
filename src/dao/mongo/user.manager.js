import { UserModel } from './models/user.model.js';

export class UserManager {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async createUser(userData) {
        return await UserModel.create(userData);
    }

    async getById(id) {
        return await UserModel.findById(id, { password: 0 });
    }

    async getAllUsers() {
        return await UserModel.find({}, { password: 0 })
    }

    async updateUserById(uid, data) {
        return await UserModel.findByIdAndUpdate(uid, data, { new: true });
    }

    async deleteById(uid) {
        return await UserModel.findByIdAndDelete(uid);
    }
}
