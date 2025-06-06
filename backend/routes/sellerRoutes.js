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

// Inventory routes
router.get("/inventory", authenticateToken, checkRole("seller"), sellerController.getInventory);
router.patch("/inventory/:id", authenticateToken, checkRole("seller"), sellerController.updateStock);
router.delete("/inventory/:id", authenticateToken, checkRole("seller"), sellerController.deleteProduct);

// Sales report routes
router.get("/sales-report/:year", authenticateToken, checkRole("seller"), sellerController.getSalesReport);
router.get("/best-selling", authenticateToken, checkRole("seller"), sellerController.getBestSelling);

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
