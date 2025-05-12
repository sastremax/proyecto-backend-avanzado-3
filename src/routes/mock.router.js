import { Router } from 'express';
import { generateUser } from '../utils/generateUser.js';
import { generateProduct } from '../utils/generateProduct.js';

const router = Router();

router.get('/users', (req, res) => {
    const users = [];

    for (let i = 0; i < 100; i++) {
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

export default router;