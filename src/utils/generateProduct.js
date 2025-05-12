import { fakerES as faker } from '@faker-js/faker';

export const generateProduct = () => {

    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        code: faker.string.alphanumeric(8),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        status: faker.helpers.arrayElement(['available', 'unavailable']),
        thumbnails: [
            faker.image.url()
        ]
    };

};