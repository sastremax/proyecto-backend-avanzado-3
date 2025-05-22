import { UserManager } from '../dao/mongo/user.manager.js';

const userManager = new UserManager();

class UserRepository {

    async getAllUsers() {
        return await userManager.getAllUsers();
    }

    async getById(id) {
        return await userManager.getById(id);
    }

    async create(data) {
        return await userManager.createUser(data);
    }

    async updateById(id, data) {
        return await userManager.updateUserById(id, data);
    }

    async deleteById(id) {
        return await userManager.deleteById(id);
    }

}

export default new UserRepository();