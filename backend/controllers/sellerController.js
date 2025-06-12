const fs = require("fs");
const path = require("path");
const pool = require("../db");
const {
  cloudinaryUploadImage,
  cloudinaryUploadMultipleImages,
} = require("../utils/cloudinary");
const { handleDatabaseError } = require("../utils/errorHandlers");

exports.getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const [sellerData] = await pool.query(
      `SELECT 
        u.id, u.first_name, u.last_name, u.email, u.phone_number as user_phone,
        s.bank_name, s.account_number, s.address, s.phone_number as seller_phone,
        COUNT(DISTINCT p.product_id) as total_products,
        COUNT(DISTINCT r.review_id) as total_reviews,
        AVG(r.rating) as average_rating
      FROM users u
      LEFT JOIN sellers s ON u.id = s.user_id
      LEFT JOIN products p ON u.id = p.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE u.id = ? AND u.role = 'seller'
      GROUP BY u.id`,
      [sellerId]
    );

    if (sellerData.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const [products] = await pool.query(
      `SELECT 
        p.product_id,
        p.title,
        p.price,
        p.image_url,
        p.company_name,
        p.car_name,
        p.part_name,
        p.status,
        p.description,
        p.condition,
        p.approval_status,
        COUNT(DISTINCT r.review_id) as review_count,
        AVG(r.rating) as product_rating
      FROM products p
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.seller_id = ?
      GROUP BY p.product_id`,
      [sellerId]
    );

    const formattedSeller = {
      id: sellerData[0].id,
      name: `${sellerData[0].first_name} ${sellerData[0].last_name}`,
      email: sellerData[0].email,
      bank_name: sellerData[0].bank_name,
      account_number: sellerData[0].account_number,
      address: sellerData[0].address,
      phone_number:
        sellerData[0].seller_phone || sellerData[0].user_phone || null,
      total_products: sellerData[0].total_products || 0,
      total_reviews: sellerData[0].total_reviews || 0,
      average_rating: parseFloat(sellerData[0].average_rating || 0).toFixed(1),
      products: products.map((product) => ({
        ...product,
        product_rating: parseFloat(product.product_rating || 0).toFixed(1),
      })),
    };

    res.json(formattedSeller);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching seller profile",
      error: error.message,
    });
  }
};

exports.updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { name, email, phone_number, address, bank_name, account_number } =
      req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [first_name, ...lastNameParts] = name.split(" ");
      const last_name = lastNameParts.join(" ");

      await connection.query(
        `UPDATE users 
         SET first_name = ?, last_name = ?, email = ?
         WHERE id = ?`,
        [first_name, last_name, email, sellerId]
      );

      const [sellerExists] = await connection.query(
        "SELECT 1 FROM sellers WHERE user_id = ?",
        [sellerId]
      );

      if (sellerExists.length > 0) {
        await connection.query(
          `UPDATE sellers 
           SET phone_number = ?, address = ?, bank_name = ?, account_number = ?
           WHERE user_id = ?`,
          [phone_number, address, bank_name, account_number, sellerId]
        );
      } else {
        await connection.query(
          `INSERT INTO sellers (user_id, phone_number, address, bank_name, account_number)
           VALUES (?, ?, ?, ?, ?)`,
          [sellerId, phone_number, address, bank_name, account_number]
        );
      }

      await connection.commit();
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating seller profile",
      error: error.message,
    });
  }
};

exports.sellerUpload = async (req, res) => {
  const {
    manufacturer,
    model,
    startYear,
    endYear,
    category,
    part,
    status,
    title,
    extraDetails,
    timeInStock,
    price,
    condition,
    id,
  } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Get file paths and ensure they exist
    const filePaths = req.files.map((file) => {
      const filePath = path.join(__dirname, "../images", file.filename);
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      return filePath;
    });

    // Upload to cloudinary with better error handling
    const uploadResults = await cloudinaryUploadMultipleImages(filePaths);

    if (
      !Array.isArray(uploadResults) ||
      uploadResults.some((result) => result instanceof Error)
    ) {
      throw new Error("Failed to upload images to cloud storage");
    }

    // Clean up local files
    for (const filePath of filePaths) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete temporary file: ${filePath}`, err);
      }
    }

    const [
      image_url,
      extra_image1_url = null,
      extra_image2_url = null,
      extra_image3_url = null,
    ] = uploadResults.map((r) => r.secure_url);

    // Validate category
    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE category_name = ?",
      [category.trim()]
    );

    if (categoryRows.length === 0) {
      return res.status(400).json({ message: "Invalid category name" });
    }

    const category_id = categoryRows[0].id;

    // Insert into database
    await pool.query(
      `INSERT INTO products (
        company_name, car_name, start_year, end_year, category_id, part_name, status, 
        title, image_url, extra_image1, extra_image2, extra_image3,
        description, storage_duration, price, \`condition\`, seller_id, approval_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        manufacturer.trim(),
        model.trim(),
        startYear,
        endYear,
        category_id,
        part.trim(),
        status.trim(),
        title.trim(),
        image_url || null,
        extra_image1_url || null,
        extra_image2_url || null,
        extra_image3_url || null,
        extraDetails.trim(),
        timeInStock,
        price,
        condition.trim(),
        id,
      ]
    );

    res.status(201).json({
      message: "Product uploaded successfully and pending approval.",
      images: uploadResults.map((r) => r.secure_url),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "حدث خطأ أثناء رفع القطعة",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { manufacturer, model, year, category, part, condition } = req.query;

    let categoryId = null;
    if (category) {
      const [categoryRows] = await pool.query(
        "SELECT id FROM categories WHERE category_name LIKE ?",
        [`%${category}%`]
      );
      categoryId = categoryRows[0]?.id || null;
    }

    let query = `
      SELECT 
        p.product_id,
        p.company_name AS manufacturer,
        p.car_name AS model,
        p.part_name,
        p.title,
        p.price,
        p.description,
        p.start_year,
        p.end_year,
        p.image_url,
        p.extra_image1,
        p.extra_image2,
        p.extra_image3,
        p.\`condition\`,
        p.storage_duration,
        p.rating,
        p.review_count,
        p.approval_status,
        c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.approval_status = 'approved'
    `;

    const params = [];

    if (manufacturer) {
      query += ` AND p.company_name LIKE ?`;
      params.push(`%${manufacturer}%`);
    }

    if (model) {
      query += ` AND p.car_name LIKE ?`;
      params.push(`%${model}%`);
    }

    if (year) {
      query += ` AND (? BETWEEN p.start_year AND IFNULL(p.end_year, p.start_year) 
                     OR p.start_year <= ? AND (p.end_year IS NULL OR p.end_year >= ?))`;
      params.push(year, year, year);
    }

    if (categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(categoryId);
    }

    if (part) {
      query += ` AND p.part_name LIKE ?`;
      params.push(`%${part}%`);
    }

    if (condition) {
      query += ` AND p.\`condition\` = ?`;
      params.push(condition);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSellerReviews = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [countResult] = await pool.query(
      `SELECT COUNT(DISTINCT r.review_id) as count 
       FROM reviews r
       JOIN products p ON r.product_id = p.product_id
       WHERE p.seller_id = ?`,
      [id]
    );
    const totalReviews = countResult[0].count;

    const [reviews] = await pool.query(
      `SELECT 
         r.review_id,
         r.rating,
         r.comment,
         r.created_at,
         r.updated_at,
         u.id as user_id,
         CONCAT(u.first_name, ' ', u.last_name) as reviewer_name,
         p.product_id,
         p.title as product_title
       FROM reviews r
       JOIN products p ON r.product_id = p.product_id
       JOIN users u ON r.user_id = u.id
       WHERE p.seller_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    const [avgRating] = await pool.query(
      `SELECT ROUND(AVG(r.rating), 1) as average_rating
       FROM reviews r
       JOIN products p ON r.product_id = p.product_id
       WHERE p.seller_id = ?`,
      [id]
    );

    res.json({
      reviews,
      total: totalReviews,
      pages: Math.ceil(totalReviews / limit),
      current_page: page,
      average_rating: avgRating[0].average_rating || 0,
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

exports.addSellerReview = async (req, res) => {
  const { seller_id } = req.params;
  const { rating, comment, product_id } = req.body;
  const user_id = req.user.id;

  try {
    const [product] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ? AND seller_id = ?",
      [product_id, seller_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        message: "Product not found or does not belong to this seller",
      });
    }

    const [existingReview] = await pool.query(
      "SELECT * FROM reviews WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [user_id, product_id, rating, comment]
    );

    const [review] = await pool.query(
      `SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as reviewer_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.review_id = ?`,
      [result.insertId]
    );

    res.status(201).json(review[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

exports.updateSellerReview = async (req, res) => {
  const { review_id } = req.params;
  const { rating, comment } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE seller_reviews 
       SET rating = ?, comment = ? 
       WHERE review_id = ?`,
      [rating, comment, review_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    const [review] = await pool.query(
      `SELECT sr.*, CONCAT(u.first_name, ' ', u.last_name) as reviewer_name 
       FROM seller_reviews sr 
       JOIN users u ON sr.user_id = u.id 
       WHERE sr.review_id = ?`,
      [review_id]
    );

    res.json(review[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

exports.deleteSellerReview = async (req, res) => {
  const { review_id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM seller_reviews WHERE review_id = ?",
      [review_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

exports.getBestSelling = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const [products] = await pool.query(
      `
      SELECT 
        p.*,
        COALESCE(SUM(o.quantity), 0) as total_sales,
        COALESCE(SUM(o.quantity * p.price), 0) as revenue
      FROM products p
      LEFT JOIN order_items o ON p.product_id = o.product_id
      WHERE p.seller_id = ?
      GROUP BY p.product_id
      ORDER BY total_sales DESC
      LIMIT 6
    `,
      [sellerId]
    );

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch best-selling parts" });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const year = parseInt(req.params.year);

    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: "Invalid year" });
    }

    const fullYearData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total_sales: 0,
      revenue: 0,
    }));

    try {
      const [sales] = await pool.query(
        `
        SELECT 
          MONTH(o.order_date) as month,
          COUNT(oi.id) as total_sales,
          COALESCE(SUM(oi.quantity * p.price), 0) as revenue
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE p.seller_id = ? 
        AND YEAR(o.order_date) = ?
        GROUP BY MONTH(o.order_date)
        ORDER BY month
        `,
        [sellerId, year]
      );

      sales.forEach((sale) => {
        if (sale.month >= 1 && sale.month <= 12) {
          fullYearData[sale.month - 1] = {
            month: sale.month,
            total_sales: parseInt(sale.total_sales),
            revenue: parseFloat(sale.revenue),
          };
        }
      });
    } catch (err) {
      throw err;
    }

    res.json({ sales: fullYearData });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};

exports.getPaymentInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const [rows] = await pool.query(
      "SELECT bank_name, account_holder, account_number, iban FROM seller_payment_info WHERE seller_id = ?",
      [sellerId]
    );

    res.json({ payment_info: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment information" });
  }
};

exports.updatePaymentInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { bank_name, account_holder, account_number, iban } = req.body;

    if (!bank_name || !account_holder || !account_number || !iban) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [existing] = await pool.query(
      "SELECT seller_id FROM seller_payment_info WHERE seller_id = ?",
      [sellerId]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE seller_payment_info 
         SET bank_name = ?, account_holder = ?, account_number = ?, iban = ?
         WHERE seller_id = ?`,
        [bank_name, account_holder, account_number, iban, sellerId]
      );
    } else {
      await pool.query(
        `INSERT INTO seller_payment_info 
         (seller_id, bank_name, account_holder, account_number, iban)
         VALUES (?, ?, ?, ?, ?)`,
        [sellerId, bank_name, account_holder, account_number, iban]
      );
    }

    res.json({ message: "Payment information updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment information" });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { sort = "created_at", order = "desc" } = req.query;

    const allowedSortFields = ["created_at", "stock", "price"];
    const sortField = allowedSortFields.includes(sort) ? sort : "created_at";

    const orderDirection = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const [products] = await pool.query(
      `
      SELECT *
      FROM products
      WHERE seller_id = ?
      ORDER BY ${sortField} ${orderDirection}
    `,
      [sellerId]
    );

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ error: "Invalid stock value" });
    }

    const [product] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ? AND seller_id = ?",
      [productId, sellerId]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await pool.query("UPDATE products SET stock = ? WHERE product_id = ?", [
      stock,
      productId,
    ]);

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    const [product] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ? AND seller_id = ?",
      [productId, sellerId]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await pool.query("DELETE FROM products WHERE product_id = ?", [productId]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
