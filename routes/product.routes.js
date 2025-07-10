const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only Routes
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;