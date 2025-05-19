import { generateUser } from '../utils/generateUser.js';
import CartModel from '../dao/mongo/models/cart.model.js';
import { UserModel } from '../dao/mongo/models/user.model.js';

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
