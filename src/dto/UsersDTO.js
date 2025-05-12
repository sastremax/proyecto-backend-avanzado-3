export class UsersDTO {
    constructor(user) {
        const fullname =
            user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.fullname || 'unknown';

        this.fullname = fullname;
        this.email = user.email;
        this.role = user.role || 'user';
    }
}