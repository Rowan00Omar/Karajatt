const db = require("../db");

const getCart = async (req, res, next) => {
  try {
    const [cartItems] = await pool.query(
      `SELECT * FROM cart_items 
       WHERE cart_id = UUID_TO_BIN(?)`,
      [req.user.cartId]
    );

    res.json(cartItems);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    await pool.query(
      `INSERT INTO cart_items 
       (cart_id, product_id, quantity)
       VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
      [req.user.cartId, productId, quantity]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};


module.exports = { getCart, addToCart };
