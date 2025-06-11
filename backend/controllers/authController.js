const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const register = async (req, res) => {
  const { first_name, last_name, email, password, role, phone_number } =
    req.body;

  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if email already exists
      const [existingUser] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into users table with phone number
      const [result] = await connection.query(
        `INSERT INTO users (first_name, last_name, email, password, role, phone_number) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email, hashedPassword, role, phone_number]
      );

      const userId = result.insertId;

      // If user is a seller, create seller record
      if (role === "seller" && seller_info) {
        await connection.query(
          "INSERT INTO sellers (user_id, bank_name, account_number, address, phone_number) VALUES (?, ?, ?, ?, ?)",
          [
            userResult.insertId,
            seller_info.bank_name.trim(),
            seller_info.account_number.trim(),
            seller_info.address.trim(),
            seller_info.phone_number.trim(),
          ]
        );
      }

      // Commit transaction
      await connection.commit();

      // Generate JWT token
      const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(201).json({
        message: "تم إنشاء الحساب بنجاح",
        token,
        user: {
          id: userId,
          first_name,
          last_name,
          email,
          role,
          phone_number,
        },
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الحساب",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
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

    await pool.query(
      "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?",
      [userRows[0].id]
    );

    const user = userRows[0];
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};

const logout = async (req, res) => {
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

const UserInfo = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        role: user.role,
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("UserInfo error:", err);
    res
      .status(500)
      .json({ message: "Error fetching user information", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.role, 
        COALESCE(u.phone_number, s.phone_number) as phone_number
       FROM users u
       LEFT JOIN sellers s ON u.id = s.user_id
       WHERE role != 'master'`
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("hit me");
    const userId = req.params.id;
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    const [user] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully", deletedUser: user });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getOrderHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orderItems] = await pool.query(
      `
  SELECT 
    o.id AS orderId,
    o.total_price AS totalPrice,
    o.order_date AS orderDate,
    oi.id AS id,
    oi.price AS itemPrice,
    oi.quantity AS quantity,
    p.part_name AS partName,
    u.first_name AS sellerFirstName,
    u.last_name AS sellerLastName
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
  JOIN users u ON p.seller_id = u.id
  WHERE o.user_id = ?
  ORDER BY o.order_date DESC
`,
      [userId]
    );

    const ordersMap = {};
    console.log("ALOOOOOOO");

    for (const row of orderItems) {
      if (!ordersMap[row.orderId]) {
        ordersMap[row.orderId] = {
          id: row.orderId,
          orderDate: row.orderDate,
          totalPrice: row.totalPrice,
          items: [],
        };
      }

      ordersMap[row.orderId].items.push({
        partName: row.partName,
        price: row.itemPrice,
        quantity: row.quantity,
        seller: row.sellerFirstName + " " + row.sellerLastName,
      });
    }
    const orders = Object.values(ordersMap);
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني" });
    }

    const resetToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "1h" }
    );

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE id = ?",
      [resetToken, user.rows[0].id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "إعادة تعيين كلمة المرور - خليجي",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>إذا لم تقم بطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
          <p>لإعادة تعيين كلمة المرور، يرجى النقر على الرابط أدناه:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            إعادة تعيين كلمة المرور
          </a>
          <p>ينتهي هذا الرابط خلال ساعة واحدة.</p>
          <p>مع تحيات،<br>فريق كراجات</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "حدث خطأ أثناء معالجة طلبك" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, user.rows[0].id]
    );

    res.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تغيير كلمة المرور" });
  }
};

module.exports = {
  register,
  login,
  logout,
  UserInfo,
  getAllUsers,
  deleteUser,
  getOrderHistory,
  forgotPassword,
  resetPassword,
};
