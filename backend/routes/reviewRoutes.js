const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/productController");
const {
  getSellerReviews,
  addSellerReview,
  updateSellerReview,
  deleteSellerReview,
} = require("../controllers/sellerController");
const {
  authenticateToken,
  checkReviewOwnership,
  checkRole,
} = require("../middleware/authMiddleware");
const {
  reviewLimiter,
  reviewUpdateLimiter,
} = require("../middleware/rateLimit");

// Product Reviews
// Get paginated reviews for a product (public access)
router.get("/product/:id", getProductReviews);

// Add a new review (requires authenticated user)
router.post(
  "/product/:product_id",
  authenticateToken,
  checkRole("user", "seller"),
  reviewLimiter,
  addReview
);

// Update a product review (requires review ownership)
router.put(
  "/product/:review_id",
  authenticateToken,
  checkRole("user", "seller"),
  checkReviewOwnership,
  reviewUpdateLimiter,
  updateReview
);

// Delete a product review (requires review ownership)
router.delete(
  "/product/:review_id",
  authenticateToken,
  checkRole("user", "seller"),
  checkReviewOwnership,
  deleteReview
);

// Seller Reviews
// Get paginated reviews for a seller (public access)
router.get("/seller/:id", getSellerReviews);

// Add a new seller review (requires authenticated user)
router.post(
  "/seller/:seller_id",
  authenticateToken,
  checkRole("user"),
  reviewLimiter,
  addSellerReview
);

// Update a seller review (requires review ownership)
router.put(
  "/seller/:review_id",
  authenticateToken,
  checkRole("user"),
  checkReviewOwnership,
  reviewUpdateLimiter,
  updateSellerReview
);

// Delete a seller review (requires review ownership)
router.delete(
  "/seller/:review_id",
  authenticateToken,
  checkRole("user"),
  checkReviewOwnership,
  deleteSellerReview
);

module.exports = router;
