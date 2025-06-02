const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db");

// Main authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const [revoked] = await pool.query(
      "SELECT 1 FROM revoked_tokens where token = ? and expires_at > NOW()",
      [token]
    );

    if (revoked.length > 0) {
      return res.status(401).json({ error: "Token has been revoked" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details including role
    const [user] = await pool.query(
      "SELECT id, email, role, first_name, last_name FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user[0]) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add full user details to request
    req.user = {
      ...decoded,
      role: user[0].role,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user owns the review
const checkReviewOwnership = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id;

    const [review] = await pool.query(
      "SELECT user_id FROM reviews WHERE review_id = ?",
      [review_id]
    );

    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "You can only modify your own reviews" });
    }

    next();
  } catch (error) {
    console.error("Error checking review ownership:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to verify user roles
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "User role not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  checkReviewOwnership,
  checkRole,
};
