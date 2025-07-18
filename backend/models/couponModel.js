const pool = require("../db");

class Coupon {
  static async create(code, discount_percentage, expiry_date, is_active = true, type = 'total') {
    const [result] = await pool.query(
      "INSERT INTO coupons (code, discount_percentage, expiry_date, is_active, type) VALUES (?, ?, ?, ?, ?)",
      [code, discount_percentage, expiry_date, is_active, type]
    );
    return result.insertId;
  }

  static async getAll() {
    const [coupons] = await pool.query("SELECT * FROM coupons");
    return coupons;
  }

  static async getByCode(code) {
    const [coupons] = await pool.query("SELECT * FROM coupons WHERE code = ?", [code]);
    return coupons[0];
  }

  static async update(id, { code, discount_percentage, expiry_date, is_active, type }) {
    await pool.query(
      "UPDATE coupons SET code = ?, discount_percentage = ?, expiry_date = ?, is_active = ?, type = ? WHERE id = ?",
      [code, discount_percentage, expiry_date, is_active, type, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM coupons WHERE id = ?", [id]);
  }

  static async validateCoupon(code) {
    const [coupons] = await pool.query(
      "SELECT * FROM coupons WHERE code = ? AND is_active = true AND expiry_date > NOW()",
      [code]
    );
    return coupons[0];
  }
}

module.exports = Coupon; 