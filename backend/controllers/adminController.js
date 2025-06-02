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
    const formattedRequests = requests.map(request => ({
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
  const { id } = req.params;
  console.log(id);
  try {
    // Update the product status to 'approved'
    await pool.query(
      "UPDATE products SET approval_status = 'approved' WHERE product_id = ?",
      [id]
    );

    res.json({ message: "Request approved successfully" });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ error: "Failed to approve request" });
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