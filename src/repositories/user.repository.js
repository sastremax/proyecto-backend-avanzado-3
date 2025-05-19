import { UserManager } from '../dao/mongo/user.manager.js';

const userManager = new UserManager();

class UserRepository {

    async getAll() {
        return await userManager.getAll();
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