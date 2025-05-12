import { UserModel } from '../../models/User.model.js'

export class UsersDAO {
    
    static async getAll() {
        return await UserModel.find().lean()
    }

    static async getBy(filter) {
        return await UserModel.findOne(filter).lean()
    }

    static async create(userData) {
        return await UserModel.create(userData)
    }

    static async deleteById(id) {
        return await UserModel.findByIdAndDelete(id)
    }

}
