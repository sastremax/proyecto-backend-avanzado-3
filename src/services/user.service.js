import { UsersDTO } from '../dto/users.dto.js';
import UserRepository from '../repositories/user.repository.js';
import { hashPassword, isValidPassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

class UserService {

    async getAllUsers() {
        return await UserRepository.getAllUsers()
    }

    async getUserById(id) {
        const user = await UserRepository.getById(id)
        if (!user) return null;
        return new UsersDTO(user);
    }

    async getUserByEmail(email) {
        const user = await UserRepository.getBy({ email });
        if (!user) return null;
        return new UsersDTO(user);
    }

    async getRawUserByEmail(email) {
        return await UserRepository.getBy({ email }); // para resetPassword
    }

    async updateUserById(id, data) {
        const updatedUser = await UserRepository.updateById(id, data);
        if (!updatedUser) throw new Error('User not found');
        return new UsersDTO(updatedUser);
    }

    async deleteUserById(id) {
        const deletedUser = await UserRepository.deleteById(id);
        if (!deletedUser) throw new Error('User not found');
        return deletedUser;
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

    async create(userData) {
        const hashedPassword = await hashPassword(userData.password);
        const newUser = {
            ...userData,
            password: hashedPassword
        };
        const createdUser = await UserRepository.create(newUser);
        return new UsersDTO(createdUser);
    }

    async assignCartToUser(userId, cartId) {
        return await UserRepository.updateById(userId, { cart: cartId });
    }

}

export default new UserService();