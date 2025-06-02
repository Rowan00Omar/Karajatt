const pool = require("../db");

exports.getPendingRequests = async (req, res) => {
  try {
    // Get all products with status 'pending' and join with users table to get seller info
    const [requests] = await pool.query(`
      SELECT p.*, u.first_name, u.last_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.approval_status = 'pending'
      ORDER BY p.created_at DESC
    `);

    // Format the response
    const formattedRequests = requests.map((request) => ({
      ...request,
      seller_name: `${request.first_name} ${request.last_name}`,
    }));

    res.json({ requests: formattedRequests });
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE products SET status = "approved" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product approved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving product", error: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the product status to 'rejected'
    await pool.query(
      "UPDATE products SET approval_status = 'rejected' WHERE product_id = ?",
      [id]
    );

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT id, email, first_name, last_name, role, created_at 
       FROM users 
       WHERE role != 'admin'
       ORDER BY created_at DESC`
    );

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists and is not an admin
    const [user] = await pool.query("SELECT role FROM users WHERE id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    // Start transaction
    await pool.query("START TRANSACTION");

    try {
      // Delete user's cart items
      await pool.query("DELETE FROM cart_items WHERE user_id = ?", [id]);

      // Delete user's reviews
      await pool.query("DELETE FROM reviews WHERE user_id = ?", [id]);

      // Delete user's orders
      await pool.query("DELETE FROM orders WHERE user_id = ?", [id]);

      // Finally, delete the user
      await pool.query("DELETE FROM users WHERE id = ?", [id]);

      // Commit transaction
      await pool.query("COMMIT");

      res.json({ message: "User and associated data deleted successfully" });
    } catch (error) {
      // Rollback in case of error
      await pool.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Get order history for all users
const getOrderHistory = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let query = `
      SELECT 
        o.id AS order_id,
        o.user_id,
        u.email,
        u.first_name,
        u.last_name,
        o.total_price,
        o.order_date,
        o.status,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];
    const conditions = [];

    if (userId) {
      conditions.push("o.user_id = ?");
      params.push(userId);
    }

    if (startDate) {
      conditions.push("o.order_date >= ?");
      params.push(startDate);
    }

    if (endDate) {
      conditions.push("o.order_date <= ?");
      params.push(endDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY o.id ORDER BY o.order_date DESC";

    const [orders] = await pool.query(query, params);

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res
      .status(500)
      .json({ message: "Error fetching order history", error: error.message });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    // Get overall product stats
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_stock,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products
    `);

    // Get top selling products
    const [topSelling] = await pool.query(`
      SELECT 
        p.product_id,
        p.part_name,
        p.price,
        SUM(oi.quantity) as total_sold
      FROM products p
      JOIN order_items oi ON p.product_id = oi.product_id
      GROUP BY p.product_id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Get low stock products
    const [lowStock] = await pool.query(`
      SELECT product_id, part_name, stock_quantity
      FROM products
      WHERE stock_quantity <= 5
      ORDER BY stock_quantity ASC
    `);

    res.json({
      overall_stats: stats[0],
      top_selling: topSelling,
      low_stock: lowStock,
    });
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json({
      message: "Error fetching product statistics",
      error: error.message,
    });
  }
};

// Update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["active", "inactive", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await pool.query(
      `UPDATE products 
       SET status = ?, 
           status_reason = ?,
           updated_at = NOW()
       WHERE product_id = ?`,
      [status, reason || null, id]
    );

    const [updatedProduct] = await pool.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
    );

    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product status updated successfully",
      product: updatedProduct[0],
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res
      .status(500)
      .json({ message: "Error updating product status", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getOrderHistory,
  getProductStats,
  updateProductStatus,
};
