const db = require("../db");

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching product with ID:", id);

    // Fetch product details with seller info
    const [product] = await db.query(
      `SELECT p.*, u.first_name, u.last_name, c.category_name 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       JOIN categories c ON p.category_id = c.id 
       WHERE p.product_id = ? AND u.role = 'seller'`,
      [id]
    );

    if (!product[0]) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch reviews for the product
    const [reviews] = await db.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Calculate average rating
    const ratings = reviews.map((review) => review.rating);
    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;

    // Format reviews to include reviewer name and remove sensitive info
    const formattedReviews = reviews.map((review) => ({
      review_id: review.review_id,
      rating: review.rating,
      comment: review.comment,
      reviewer_name: `${review.first_name} ${review.last_name}`,
      created_at: review.created_at,
      updated_at: review.updated_at,
    }));

    const seller_name = `${product[0].first_name} ${product[0].last_name}`;
    const productData = {
      ...product[0],
      seller_name,
      reviews: formattedReviews,
      average_rating: averageRating,
      review_count: reviews.length,
    };

    delete productData.first_name;
    delete productData.last_name;

    console.log("Product data:", productData);
    res.json(productData);
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Get paginated reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count and sum of ratings
    const [ratingStats] = await db.query(
      `SELECT 
        COUNT(*) as count,
        AVG(rating) as average_rating
       FROM reviews 
       WHERE product_id = ?`,
      [id]
    );

    // Fetch paginated reviews with user information
    const [reviews] = await db.query(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) as reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    const formattedReviews = reviews.map((review) => ({
      review_id: review.review_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      reviewer_name: review.reviewer_name,
      created_at: review.created_at,
      updated_at: review.updated_at,
    }));

    res.json({
      reviews: formattedReviews,
      total: ratingStats[0].count,
      average_rating: parseFloat(ratingStats[0].average_rating || 0).toFixed(1),
      page,
      total_pages: Math.ceil(ratingStats[0].count / limit),
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// Add a new review
const addReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id; // Assuming user info is added by auth middleware

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user has already reviewed this product
    const [existingReview] = await db.query(
      "SELECT review_id FROM reviews WHERE product_id = ? AND user_id = ?",
      [product_id, user_id]
    );

    if (existingReview.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add the review
    const [result] = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [product_id, user_id, rating, comment]
    );

    const [newReview] = await db.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.review_id = ?`,
      [result.insertId]
    );

    const formattedReview = {
      review_id: newReview[0].review_id,
      rating: newReview[0].rating,
      comment: newReview[0].comment,
      reviewer_name: `${newReview[0].first_name} ${newReview[0].last_name}`,
      created_at: newReview[0].created_at,
      updated_at: newReview[0].updated_at,
    };

    res.status(201).json(formattedReview);
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id; // Assuming user info is added by auth middleware

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if review exists and belongs to user
    const [existingReview] = await db.query(
      "SELECT * FROM reviews WHERE review_id = ? AND user_id = ?",
      [review_id, user_id]
    );

    if (existingReview.length === 0) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }

    // Update the review
    await db.query(
      `UPDATE reviews 
       SET rating = ?, comment = ?, updated_at = NOW()
       WHERE review_id = ? AND user_id = ?`,
      [rating, comment, review_id, user_id]
    );

    const [updatedReview] = await db.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.review_id = ?`,
      [review_id]
    );

    const formattedReview = {
      review_id: updatedReview[0].review_id,
      rating: updatedReview[0].rating,
      comment: updatedReview[0].comment,
      reviewer_name: `${updatedReview[0].first_name} ${updatedReview[0].last_name}`,
      created_at: updatedReview[0].created_at,
      updated_at: updatedReview[0].updated_at,
    };

    res.json(formattedReview);
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id; // Assuming user info is added by auth middleware

    // Check if review exists and belongs to user
    const [existingReview] = await db.query(
      "SELECT * FROM reviews WHERE review_id = ? AND user_id = ?",
      [review_id, user_id]
    );

    if (existingReview.length === 0) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }

    // Delete the review
    await db.query("DELETE FROM reviews WHERE review_id = ? AND user_id = ?", [
      review_id,
      user_id,
    ]);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

exports.getProduct = getSingleProduct;
exports.getProductReviews = getProductReviews;
exports.addReview = addReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
