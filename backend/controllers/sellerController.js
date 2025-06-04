const fs = require('fs');
const path = require('path');
const pool = require("../db");
const { cloudinaryUploadImage, cloudinaryUploadMultipleImages } = require("../utils/cloudinary");

exports.sellerUpload = async (req, res) => {
  console.log("hittt")
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
  console.log(req.body)

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }
    console.log(req.files)
    const filePaths = req.files.map(file =>
      path.join(__dirname, "../images", file.filename)
    );

    const uploadResults = await cloudinaryUploadMultipleImages(filePaths);

    filePaths.forEach(filePath => fs.unlinkSync(filePath));

    const [image_url, extra_image1_url = null, extra_image2_url = null, extra_image3_url = null] = uploadResults.map(r => r.secure_url);

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
      images: uploadResults.map(r => r.secure_url)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { manufacturer, model, year, category, part } = req.query;
    console.log("Received filters:", {
      manufacturer,
      model,
      year,
      category,
      part,
    });

    let categoryId = null;
    if (category) {
      const [categoryRows] = await pool.query(
        "SELECT id FROM categories WHERE category_name = ?",
        [category]
      );
      categoryId = categoryRows[0]?.id || null;
    }

    let query = `
      SELECT 
        p.product_id,
        p.company_name AS manufacturer,
        p.car_name AS model,
        p.part_name,
        p.price,
        p.description,
        p.start_year,
        p.end_year,
        p.image_url,
        p.condition,
        p.storage_duration,
        p.rating,
        p.review_count,
        c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.approval_status = 'approved'
    `;

    const params = [];

    if (manufacturer) {
      query += ` AND p.company_name = ?`;
      params.push(manufacturer);
    }

    if (model) {
      query += ` AND p.car_name = ?`;
      params.push(model);
    }

    if (year) {
      query += ` AND ? BETWEEN p.start_year AND IFNULL(p.end_year, p.start_year)`;
      params.push(year);
    }

    if (categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(categoryId);
    }

    if (part) {
      query += ` AND p.part_name = ?`;
      params.push(part);
    }

    query += ` ORDER BY p.created_at DESC`;

    console.log("Final query:", query);
    console.log("Query parameters:", params);

    const [products] = await pool.query(query, params);
    console.log(`Found ${products.length} products`);

    res.json(products);
  } catch (err) {
    console.error("Database error:", err.message);
    console.error("Full error stack:", err.stack);
    res.status(500).json({
      error: "Database query failed",
      details: err.message,
    });
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
