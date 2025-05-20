import { UserManager } from '../dao/mongo/user.manager.js';

const userManager = new UserManager();

class UserRepository {

    async getAllUsers() {
        return await userManager.getAllUsers();
    }

    async getBy(filter) {
        return await userManager.getBy(filter);
    }

    async create(data) {
        return await userManager.create(data);
    }

    async deleteById(id) {
        return await userManager.deleteById(id);
    }

}

export default new UserRepository();