const Cart = require("../models/cartModel");

async function validateCart(req, res, next) {
  try {
    let cartItems;

    // Handle both cartId and direct cartItems formats
    if (req.body.cartId) {
      // Legacy format using cartId
      cartItems = await Cart.getCartById(req.body.cartId);
      if (!cartItems || !cartItems.length) {
        return res.status(404).json({ error: "Cart not found" });
      }
    } else if (req.body.cartItems && Array.isArray(req.body.cartItems)) {
      // New format using direct cartItems array
      cartItems = req.body.cartItems;
    } else {
      return res.status(400).json({
        error: "Invalid cart data. Expected cartId or cartItems array",
      });
    }

    // Calculate total including inspection fees if applicable
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    req.cart = {
      items: cartItems,
      subtotal,
      total: subtotal + (req.body.inspectionFees || 0),
    };

    next();
  } catch (error) {
    console.error("Cart validation error:", error);
    res.status(500).json({ error: "Failed to validate cart" });
  }
}

module.exports = { validateCart };
