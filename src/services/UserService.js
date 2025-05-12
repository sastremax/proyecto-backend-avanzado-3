import { UsersDTO } from '../dto/UsersDTO.js';

export class UserService {
    formatUser(user) {
        return new UsersDTO(user);
    }
}