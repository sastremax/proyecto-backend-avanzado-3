import { fakerES as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const generateUser = () => {

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 70 }),
        password: hashPassword('coder123'),
        role: faker.helpers.arrayElement(['user', 'admin']),
        cart: faker.database.mongodbObjectId()
    };

}