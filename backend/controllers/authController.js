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
        role || "user",
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};
