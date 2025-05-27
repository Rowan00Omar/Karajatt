const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db");
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
      return res.status(401).json({ error: "Token Revoked" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
