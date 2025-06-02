const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const photoupload = require("../middleware/photoUpload");
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

// Get seller profile with ratings
router.get("/profile/:id", sellerController.getSellerProfile);

// Upload product
router.post(
  "/upload",
  photoupload.array("images", 4),
  sellerController.sellerUpload
);

// Get filtered products
router.get("/filtered-part", sellerController.filterProducts);

// Review routes
router.get("/reviews/:id", sellerController.getSellerReviews);
router.post(
  "/reviews/:seller_id",
  authenticateToken,
  sellerController.addSellerReview
);
router.put(
  "/reviews/:review_id",
  authenticateToken,
  sellerController.updateSellerReview
);
router.delete(
  "/reviews/:review_id",
  authenticateToken,
  sellerController.deleteSellerReview
);

module.exports = router;
