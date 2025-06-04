const fs = require("fs");
const path = require("path");
const pool = require("../db");
const {
  cloudinaryUploadImage,
  cloudinaryUploadMultipleImages,
} = require("../utils/cloudinary");
const { handleDatabaseError } = require("../utils/errorHandlers");

// Get seller profile with average rating
exports.getSellerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Get seller info and calculate average rating from all their products' reviews
    const [sellerData] = await pool.query(
      `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(DISTINCT p.product_id) as total_products,
        COUNT(DISTINCT r.review_id) as total_reviews,
        AVG(r.rating) as average_rating
      FROM users u
      LEFT JOIN products p ON u.id = p.seller_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE u.id = ? AND u.role = 'seller'
      GROUP BY u.id`,
      [id]
    );

    if (!sellerData[0]) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Get seller's products with their individual ratings
    const [products] = await pool.query(
      `SELECT 
        p.product_id,
        p.part_name,
        p.title,
        p.price,
        p.image_url,
        COUNT(r.review_id) as review_count,
        AVG(r.rating) as product_rating
      FROM products p
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.seller_id = ? AND p.approval_status = 'approved'
      GROUP BY p.product_id
      ORDER BY p.created_at DESC`,
      [id]
    );

    const formattedSeller = {
      id: sellerData[0].id,
      name: `${sellerData[0].first_name} ${sellerData[0].last_name}`,
      email: sellerData[0].email,
      total_products: sellerData[0].total_products,
      total_reviews: sellerData[0].total_reviews,
      average_rating: parseFloat(sellerData[0].average_rating || 0).toFixed(1),
      products: products.map((product) => ({
        ...product,
        product_rating: parseFloat(product.product_rating || 0).toFixed(1),
      })),
    };

    res.json(formattedSeller);
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res.status(500).json({
      message: "Error fetching seller profile",
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
    numberOfParts,
    title,
    extraDetails,
    timeInStock,
    price,
    condition,
    id,
  } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }
    const filePaths = req.files.map((file) =>
      path.join(__dirname, "../images", file.filename)
    );

    const uploadResults = await cloudinaryUploadMultipleImages(filePaths);

    filePaths.forEach((filePath) => fs.unlinkSync(filePath));

    const [
      image_url,
      extra_image1_url = null,
      extra_image2_url = null,
      extra_image3_url = null,
    ] = uploadResults.map((r) => r.secure_url);

    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE category_name = ?",
      [category.trim()]
    );

    if (categoryRows.length === 0) {
      return res.status(400).json({ error: "Invalid category name." });
    }

    const category_id = categoryRows[0].id;

    // Insert product with initial approval_status as 'pending'
    await pool.query(
      `INSERT INTO products (
        company_name, car_name, start_year, end_year, category_id, part_name, status, parts_in_stock,
        title, image_url, extra_image1, extra_image2, extra_image3,
        description, storage_duration, price, \`condition\`, seller_id, approval_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        manufacturer.trim(),
        model.trim(),
        startYear,
        endYear,
        category_id,
        part.trim(),
        status.trim(),
        numberOfParts,
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
    res.status(500).json({ error: err.message });
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

// Get all reviews for a seller
exports.getSellerReviews = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Get total count of reviews
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as count FROM seller_reviews WHERE seller_id = ?",
      [id]
    );
    const totalReviews = countResult[0].count;

    // Get reviews with user info
    const [reviews] = await pool.query(
      `SELECT sr.*, CONCAT(u.first_name, ' ', u.last_name) as reviewer_name 
       FROM seller_reviews sr 
       JOIN users u ON sr.user_id = u.id 
       WHERE sr.seller_id = ? 
       ORDER BY sr.created_at DESC 
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    // Get average rating
    const [avgRating] = await pool.query(
      "SELECT ROUND(AVG(rating), 1) as average_rating FROM seller_reviews WHERE seller_id = ?",
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

// Add a new seller review
exports.addSellerReview = async (req, res) => {
  const { seller_id } = req.params;
  const { rating, comment } = req.body;
  const user_id = req.user.id;

  try {
    // Check if user has already reviewed this seller
    const [existingReview] = await pool.query(
      "SELECT * FROM seller_reviews WHERE user_id = ? AND seller_id = ?",
      [user_id, seller_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        message: "You have already reviewed this seller",
      });
    }

    // Add the review
    const [result] = await pool.query(
      `INSERT INTO seller_reviews (user_id, seller_id, rating, comment) 
       VALUES (?, ?, ?, ?)`,
      [user_id, seller_id, rating, comment]
    );

    // Get the inserted review with reviewer name
    const [review] = await pool.query(
      `SELECT sr.*, CONCAT(u.first_name, ' ', u.last_name) as reviewer_name 
       FROM seller_reviews sr 
       JOIN users u ON sr.user_id = u.id 
       WHERE sr.review_id = ?`,
      [result.insertId]
    );

    res.status(201).json(review[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

// Update a seller review
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

    // Get the updated review with reviewer name
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

// Delete a seller review
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
    const [products] = await pool.query(`
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
    `, [sellerId]);

    res.json({ products });
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    res.status(500).json({ error: 'Failed to fetch best-selling parts' });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const year = parseInt(req.params.year);

    // Validate year
    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    const [sales] = await pool.query(`
      SELECT 
        MONTH(o.created_at) as month,
        COUNT(oi.order_item_id) as total_sales,
        SUM(oi.quantity * p.price) as revenue
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ? 
      AND YEAR(o.created_at) = ?
      GROUP BY MONTH(o.created_at)
      ORDER BY month
    `, [sellerId, year]);

    // Fill in missing months with zero values
    const fullYearData = Array.from({ length: 12 }, (_, i) => {
      const existingData = sales.find(s => s.month === i + 1);
      return existingData || {
        month: i + 1,
        total_sales: 0,
        revenue: 0
      };
    });

    res.json({ sales: fullYearData });
  } catch (err) {
    console.error('Error fetching sales report:', err);
    res.status(500).json({ error: 'Failed to fetch sales report' });
  }
};

exports.getPaymentInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const [rows] = await pool.query(
      'SELECT bank_name, account_holder, account_number, iban FROM seller_payment_info WHERE seller_id = ?',
      [sellerId]
    );

    res.json({ payment_info: rows[0] || {} });
  } catch (err) {
    console.error('Error fetching payment info:', err);
    res.status(500).json({ error: 'Failed to fetch payment information' });
  }
};

exports.updatePaymentInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { bank_name, account_holder, account_number, iban } = req.body;

    // Validate required fields
    if (!bank_name || !account_holder || !account_number || !iban) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if payment info exists
    const [existing] = await pool.query(
      'SELECT seller_id FROM seller_payment_info WHERE seller_id = ?',
      [sellerId]
    );

    if (existing.length > 0) {
      // Update existing record
      await pool.query(
        `UPDATE seller_payment_info 
         SET bank_name = ?, account_holder = ?, account_number = ?, iban = ?
         WHERE seller_id = ?`,
        [bank_name, account_holder, account_number, iban, sellerId]
      );
    } else {
      // Insert new record
      await pool.query(
        `INSERT INTO seller_payment_info 
         (seller_id, bank_name, account_holder, account_number, iban)
         VALUES (?, ?, ?, ?, ?)`,
        [sellerId, bank_name, account_holder, account_number, iban]
      );
    }

    res.json({ message: 'Payment information updated successfully' });
  } catch (err) {
    console.error('Error updating payment info:', err);
    res.status(500).json({ error: 'Failed to update payment information' });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { sort = 'created_at', order = 'desc' } = req.query;

    // Validate sort field
    const allowedSortFields = ['created_at', 'stock', 'price'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
    
    // Validate order direction
    const orderDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const [products] = await pool.query(`
      SELECT *
      FROM products
      WHERE seller_id = ?
      ORDER BY ${sortField} ${orderDirection}
    `, [sellerId]);

    res.json({ products });
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const { stock } = req.body;

    // Validate stock value
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    // Verify product belongs to seller
    const [product] = await pool.query(
      'SELECT product_id FROM products WHERE product_id = ? AND seller_id = ?',
      [productId, sellerId]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update stock
    await pool.query(
      'UPDATE products SET stock = ? WHERE product_id = ?',
      [stock, productId]
    );

    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};
