const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Remove or decrease item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Product not found in cart' });

        // If quantity is provided, decrease it
        if (quantity && quantity > 0) {
            cart.items[itemIndex].quantity -= quantity;

            if (cart.items[itemIndex].quantity <= 0) {
                // Remove the item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
        } else {
            // If no quantity provided, remove the whole item
            cart.items.splice(itemIndex, 1);
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// View cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) return res.status(404).json({ success: false, message: 'Cart is empty' });

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};