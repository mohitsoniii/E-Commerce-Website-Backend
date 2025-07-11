const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { addToCart, removeFromCart, getCart } = require('../controllers/cart.controller');

// All routes are protected
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);
router.get('/', protect, getCart);

module.exports = router;