export class UsersDTO {
    constructor(user) {
        this.fullname = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.fullname || 'unknown';
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role || 'user';
        this.cart = user.cart;
    }
}