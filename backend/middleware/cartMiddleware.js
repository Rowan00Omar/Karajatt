const Cart = require("../models/cartModel");

async function validateCart(req, res, next) {
  try {
    const cart = await Cart.getCartById(req.body.cartId);
    if (!cart.length) {
      return res.staus(404).json({ error: "Cart not found" });
    }
    req.cart = {
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validateCart };
