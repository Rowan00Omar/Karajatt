const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  try {
    const [userExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        first_name.trim(),
        last_name.trim(),
        email.toLowerCase(),
        hashedPassword,
        role.trim() ,
      ]
    );

    console.log("ziad");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (userRows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, userRows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: userRows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    // res.status(500).json({ error: err.message });
  }
};
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      await pool.query(
        "INSERT INTO revoked_tokens (token, expires_at) VALUES (?, ?)",
        [token, new Date(Date.now() + 3600 * 1000)]
      );
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};
exports.UserInfo = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ role: user.role, id: user.id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Server error:", err);
    // res.status(500).json({ error: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * from users")
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    console.log("hit me")
    const userId = req.params.id; 
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    
    const [user] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    if (!user) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully", deletedUser: user });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
