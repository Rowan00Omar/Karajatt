const pool = require("../db");

// Get all pending product requests
exports.getPendingRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT 
        p.*,
        CONCAT(u.first_name, ' ', u.last_name) as seller_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.approval_status = 'pending'
      ORDER BY p.created_at DESC`
    );

    res.json({ requests });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Failed to fetch pending requests" });
  }
};

// Approve a product request
exports.approveRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE products SET approval_status = 'approved' WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

// Reject a product request
exports.rejectRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE products SET approval_status = 'rejected' WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

// Get all users (excluding master admin)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, first_name, last_name, email, role FROM users WHERE role != 'master'"
    );
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // First check if the user exists and is not a master admin
    const [user] = await pool.query("SELECT role FROM users WHERE id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].role === "master") {
      return res.status(403).json({ message: "Cannot delete master admin" });
    }

    // Temporarily disable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    // Delete the user
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    // Re-enable foreign key checks
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get order history
exports.getOrderHistory = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.*,
        u.first_name as buyer_first_name,
        u.last_name as buyer_last_name,
        p.title as product_title,
        p.part_name,
        s.first_name as seller_first_name,
        s.last_name as seller_last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.product_id
      JOIN users s ON p.seller_id = s.id
      ORDER BY o.created_at DESC`
    );

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    // Get total products count
    const [totalProducts] = await pool.query(
      "SELECT COUNT(*) as count FROM products"
    );

    // Get products count by status
    const [statusCounts] = await pool.query(
      `SELECT 
        approval_status,
        COUNT(*) as count
      FROM products
      GROUP BY approval_status`
    );

    // Get products count by category
    const [categoryCounts] = await pool.query(
      `SELECT 
        c.category_name,
        COUNT(p.product_id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.category_name`
    );

    res.json({
      total: totalProducts[0].count,
      byStatus: statusCounts,
      byCategory: categoryCounts,
    });
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json({ message: "Failed to fetch product statistics" });
  }
};

// Update product status
exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE products SET approval_status = ? WHERE product_id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product status updated successfully" });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ message: "Failed to update product status" });
  }
};

// Get user statistics for dashboard
exports.getUserStats = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Get total users
    const [totalUsers] = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    // Get active users (users who placed orders in last 30 days)
    const [activeUsers] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM orders 
       WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Get user registration data for the selected year
    const [registrationData] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as date,
        COUNT(*) as count
       FROM users
       WHERE created_at BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY date`,
      [startDate, endDate]
    );

    // Calculate user growth
    const [lastMonthUsers] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );
    const [previousMonthUsers] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );

    const userGrowth =
      previousMonthUsers[0].count === 0
        ? "+100%"
        : `${(
            ((lastMonthUsers[0].count - previousMonthUsers[0].count) /
              previousMonthUsers[0].count) *
            100
          ).toFixed(1)}%`;

    // Calculate active users growth
    const [lastMonthActive] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM orders 
       WHERE order_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );
    const [previousMonthActive] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM orders 
       WHERE order_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );

    const activeGrowth =
      previousMonthActive[0].count === 0
        ? "+100%"
        : `${(
            ((lastMonthActive[0].count - previousMonthActive[0].count) /
              previousMonthActive[0].count) *
            100
          ).toFixed(1)}%`;

    // Format registration data to include all months
    const formattedRegistrationData = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0");
      const dateStr = `${year}-${monthStr}`;
      const monthData = registrationData.find((d) => d.date === dateStr);
      formattedRegistrationData.push({
        name: dateStr,
        value: monthData ? monthData.count : 0,
      });
    }

    res.json({
      totalUsers: totalUsers[0].count,
      activeUsers: activeUsers[0].count,
      userGrowth,
      activeGrowth,
      registrationData: formattedRegistrationData,
      visitData: formattedRegistrationData, // Using same data for visits for now
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user statistics" });
  }
};

exports.getSalesStats = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Get total completed orders
    const [totalOrders] = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'passed'"
    );

    // Get sales data for completed orders only
    const [salesData] = await pool.query(
      `SELECT 
        DATE_FORMAT(order_date, '%Y-%m') as date,
        COUNT(*) as count,
        SUM(total_price) as amount
       FROM orders
       WHERE order_date BETWEEN ? AND ?
       AND status = 'passed'
       GROUP BY DATE_FORMAT(order_date, '%Y-%m')
       ORDER BY date`,
      [startDate, endDate]
    );

    // Calculate order growth for completed orders
    const [lastMonthOrders] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM orders 
       WHERE order_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
       AND status = 'passed'`
    );
    const [previousMonthOrders] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM orders 
       WHERE order_date BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)
       AND status = 'passed'`
    );

    const orderGrowth =
      previousMonthOrders[0].count === 0
        ? "+100%"
        : `${(
            ((lastMonthOrders[0].count - previousMonthOrders[0].count) /
              previousMonthOrders[0].count) *
            100
          ).toFixed(1)}%`;

    // Format sales data to include all months
    const formattedSalesData = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0");
      const dateStr = `${year}-${monthStr}`;
      const monthData = salesData.find((d) => d.date === dateStr);
      formattedSalesData.push({
        name: dateStr,
        value: monthData ? monthData.amount || 0 : 0,
      });
    }

    res.json({
      totalOrders: totalOrders[0].count,
      orderGrowth,
      salesData: formattedSalesData,
    });
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res.status(500).json({ message: "Failed to fetch sales statistics" });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Get total available products
    const [totalProducts] = await pool.query(
      "SELECT COUNT(*) as count FROM products WHERE approval_status = 'approved'"
    );

    // Get new products added this month
    const [newProducts] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM products 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );

    // Get inventory movement data for selected year
    const [inventoryMovement] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as date,
        COUNT(*) as stock_count
       FROM products
       WHERE created_at BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY date`,
      [startDate, endDate]
    );

    // Calculate trends
    const [lastMonthProducts] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM products 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );
    const [previousMonthProducts] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM products 
       WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)`
    );

    const stockTrend =
      previousMonthProducts[0].count === 0 ||
      previousMonthProducts[0].count === null
        ? "+100%"
        : `${(
            ((lastMonthProducts[0].count - previousMonthProducts[0].count) /
              previousMonthProducts[0].count) *
            100
          ).toFixed(1)}%`;

    const productsTrend =
      newProducts[0].count === 0 ? "0%" : `+${newProducts[0].count}%`;

    // Format inventory data to include all months
    const formattedInventoryData = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0");
      const dateStr = `${year}-${monthStr}`;
      const monthData = inventoryMovement.find((d) => d.date === dateStr);
      formattedInventoryData.push({
        name: dateStr,
        value: monthData ? monthData.stock_count : 0,
      });
    }

    res.json({
      totalStock: totalProducts[0].count || 0,
      stockTrend,
      newProducts: newProducts[0].count,
      productsTrend,
      inventoryMovement: formattedInventoryData,
    });
  } catch (error) {
    console.error("Error fetching inventory stats:", error);
    res.status(500).json({ message: "Failed to fetch inventory statistics" });
  }
};
