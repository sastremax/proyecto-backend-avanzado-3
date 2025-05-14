import { generateUser } from '../utils/generateUser.js';
import CartModel from '../models/Cart.model.js';
import { UserModel } from '../models/User.model.js';

export const generateFakeUsersWithCarts = async (quantity) => {
    const insertedUsers = [];

    for (let i = 0; i < quantity; i++) {
        const newCart = await CartModel.create({ products: [] });

        const fakeUser = generateUser();
        fakeUser.cart = newCart._id;

        const newUser = await UserModel.create(fakeUser);
        insertedUsers.push(newUser);
    }

    return insertedUsers;
};
