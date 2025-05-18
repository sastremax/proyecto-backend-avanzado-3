import { UsersDTO } from '../dto/UsersDTO.js';
import UserRepository from '../repositories/UserRepository.js';
import { hashPassword, isValidPassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

class UserService {

    async getUserByEmail(email) {
        const user = await UserRepository.getBy({ email });
        if (!user) return null;
        return new UsersDTO(user);
    }

    async getRawUserByEmail(email) {
        return await UserRepository.getBy({ email }); // para resetPassword
    }

    isSamePassword(newPassword, oldHashedPassword) {
        return isValidPassword(newPassword, oldHashedPassword);
    }

    hashNewPassword(password) {
        return hashPassword(password);
    }

    async updateUserPassword(user, newHashedPassword) {
        user.password = newHashedPassword;
        return await user.save();
    }

    generateToken(user) {
        return jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
    }

    verifyResetToken(token) {
        return jwt.verify(token, config.jwt_secret);
    }

    formatUser(user) {
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };
    }

}

export default new UserService();