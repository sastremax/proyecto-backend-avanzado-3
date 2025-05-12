import Product from '../models/Product.model.js';
import Cart from '../models/Cart.model.js';
import mongoose from 'mongoose';

export const renderRegister = (req, res) => {
    const { error, first_name, last_name, email, age } = req.query;
    res.render('register', { error, first_name, last_name, email, age });
};

export const renderLogin = (req, res) => {
    const { error, success } = req.query;
    res.render('login', { error, success });
};

export const renderProducts = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const result = await Product.paginate({}, { page, limit, lean: true });

        res.render('home', {
            products: result.docs,
            pagination: {
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                currentPage: result.page
            },
            user: req.user,
            cartId: req.user?.cart,
            layout: "main"
        });
    } catch (error) {
        console.error("Error loading paginated products:", error);
        res.status(500).send("Error loading product list");
    }
};

export const renderCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate("products.product");

        if (!cart || !cart.products) {
            return res.status(404).render("error", { message: "Cart not found" });
        }

        res.render("cart", { layout: "main", cart });
    } catch (error) {
        console.error("Error loading cart view:", error);
        res.status(500).send("Error loading cart page");
    }
};

export const updateProductView = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database connection lost");
        }

        const { id } = req.params;
        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send("No fields provided for update.");
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).send("Product not found.");
        }

        res.redirect(`/views/products/details/${id}?success=2`);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
};

export const deleteProductView = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send("Product not found.");
        }

        res.redirect("/views/products/view");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
};

export const uploadProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).send("No image uploaded.");
        }

        const imagePath = `/img/${req.file.filename}`;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        if (!Array.isArray(product.thumbnails)) {
            product.thumbnails = [];
        }

        product.thumbnails.push(imagePath);
        await product.save();

        res.redirect(`/views/products/details/${id}?success=1`);
    } catch (error) {
        console.error("Error uploading product image:", error);
        res.status(500).send("Error uploading image.");
    }
};

export const renderProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).render("error", { message: "Product not founded" });
        }

        res.render('productDetails', {
            product,
            user: req.user,
            cartId: req.user?.cart,
            layout: "main"
        });
    } catch (error) {
        console.error("Error loading product details:", error);
        res.status(500).send("Error loading product details");
    }
};