import { Router } from 'express';
import { generateUser } from '../utils/generateUser.js';
import { generateProduct } from '../utils/generateProduct.js';
import { generateFakeUsersWithCarts } from '../services/mock.service.js';

const router = Router();

router.get('/users', (req, res) => {
    const users = [];

    for (let i = 0; i < 50; i++) {
        users.push(generateUser());
    }

    res.json({ status: 'success', payload: users });
});

router.get('/products', (req, res) => {
    const products = [];

    for (let i = 0; i < 50; i++) {
        products.push(generateProduct());
    }

    res.json({ status: 'success', payload: products });
});

router.post('/generateData', async (req, res) => {
    try {
        const { users } = req.body;

        if (!users || Number.isNaN(users)) {
            return res.status(400).json({ status: 'error', message: 'The field "users" is required and must be a number.' });
        }

        const insertedUsers = await generateFakeUsersWithCarts(Number(users));

        res.status(201).json({
            status: 'success',
            message: `${insertedUsers.length} users with carts inserted.`,
            payload: insertedUsers
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
    }
});

export default router;