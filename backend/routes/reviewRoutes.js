const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/productController");
const {
  authenticateToken,
  checkReviewOwnership,
  checkRole,
} = require("../middleware/authMiddleware");
const {
  reviewLimiter,
  reviewUpdateLimiter,
} = require("../middleware/rateLimit");

// Get paginated reviews for a product (public access)
router.get("/product/:id/reviews", getProductReviews);

// Add a new review (requires authenticated user)
router.post(
  "/product/:product_id/reviews",
  authenticateToken,
  checkRole("user", "seller"),
  reviewLimiter,
  addReview
);

// Update a review (requires review ownership)
router.put(
  "/reviews/:review_id",
  authenticateToken,
  checkRole("user", "seller"),
  checkReviewOwnership,
  reviewUpdateLimiter,
  updateReview
);

// Delete a review (requires review ownership)
router.delete(
  "/reviews/:review_id",
  authenticateToken,
  checkRole("user", "seller"),
  checkReviewOwnership,
  deleteReview
);

module.exports = router;
