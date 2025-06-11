const db = require("../db");

class Cart {
  static async getCartById(cartId) {
    const [rows] = await db.query(
      `
            SELECT cart_items.*, products.*
            FROM cart_items
            JOIN products ON cart_items.product_id = products.product_id
            WHERE cart_id = ?`,
      [cartId]
    );
    return rows;
  }
  static async markCartAsPaid(cartId) {
    await db.query('UPDATE carts SET status = "paid" WHERE id = ?', [cartId]);
  }
}
module.exports = Cart;
