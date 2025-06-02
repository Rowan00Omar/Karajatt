const fs = require("fs");
const path = require("path");
const pool = require("../db");
const {
  cloudinaryUploadImage,
  cloudinaryUploadMultipleImages,
} = require("../utils/cloudinary");

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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
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

// Get seller reviews
exports.getSellerReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Get all reviews for the seller's products with user information
    const [reviews] = await pool.query(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) as reviewer_name,
        p.title as product_title
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      JOIN users u ON r.user_id = u.id
      WHERE p.seller_id = ?
      ORDER BY r.created_at DESC`,
      [id]
    );

    // Calculate average rating
    const [ratingStats] = await pool.query(
      `SELECT AVG(r.rating) as average_rating
       FROM reviews r
       JOIN products p ON r.product_id = p.product_id
       WHERE p.seller_id = ?`,
      [id]
    );

    const formattedReviews = reviews.map((review) => ({
      review_id: review.review_id,
      rating: review.rating,
      comment: review.comment,
      reviewer_name: review.reviewer_name,
      product_title: review.product_title,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user_id: review.user_id,
    }));

    res.json({
      reviews: formattedReviews,
      average_rating: parseFloat(ratingStats[0].average_rating || 0).toFixed(1),
    });
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    res.status(500).json({
      message: "Error fetching seller reviews",
      error: error.message,
    });
  }
};
