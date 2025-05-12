export class MemoryUserManager {
    
    constructor() {
        this.users = [];
    }

    async createUser(userData) {
        const newUser = {id: this.user.length + 1, ...userData}
        this.users.push(newUser);
    }

    async getByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    async getById(id) {
        return this.users.find(user => user.id === id);
    }
    
}