const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/item/:itemId", updateCartItem);

// Remove item from cart
router.delete("/item/:itemId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

module.exports = router;
