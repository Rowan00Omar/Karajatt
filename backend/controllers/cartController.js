const pool = require("../db");

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [cartItems] = await pool.query(
      `SELECT c.*, p.part_name, p.price, p.image_url, p.stock_quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      items: cartItems,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check product exists and has enough stock
    const [product] = await pool.query(
      "SELECT stock_quantity FROM products WHERE product_id = ?",
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product[0].stock_quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Check if item already in cart
    const [existingItem] = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existingItem.length > 0) {
      // Update quantity if already in cart
      const newQuantity = existingItem[0].quantity + quantity;
      if (newQuantity > product[0].stock_quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [newQuantity, existingItem[0].cart_item_id]
      );
    } else {
      // Add new item to cart
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    // Return updated cart
    const [updatedCart] = await pool.query(
      `SELECT c.*, p.part_name, p.price, p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    const total = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      items: updatedCart,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    // Check if item exists and belongs to user
    const [cartItem] = await pool.query(
      `SELECT c.*, p.stock_quantity 
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.cart_item_id = ? AND c.user_id = ?`,
      [itemId, userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > cartItem[0].stock_quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await pool.query("DELETE FROM cart_items WHERE cart_item_id = ?", [
        itemId,
      ]);
    } else {
      // Update quantity
      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [quantity, itemId]
      );
    }

    // Return updated cart
    const [updatedCart] = await pool.query(
      `SELECT c.*, p.part_name, p.price, p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    const total = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      items: updatedCart,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res
      .status(500)
      .json({ message: "Error updating cart item", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Check if item exists and belongs to user
    const [cartItem] = await pool.query(
      "SELECT * FROM cart_items WHERE cart_item_id = ? AND user_id = ?",
      [itemId, userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Remove item
    await pool.query("DELETE FROM cart_items WHERE cart_item_id = ?", [itemId]);

    // Return updated cart
    const [updatedCart] = await pool.query(
      `SELECT c.*, p.part_name, p.price, p.image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    const total = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      items: updatedCart,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res
      .status(500)
      .json({ message: "Error removing cart item", error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    res.json({
      items: [],
      total: "0.00",
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
