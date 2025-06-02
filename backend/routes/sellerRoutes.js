const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const photoupload = require("../middleware/photoUpload");

// Get seller profile with ratings
router.get("/profile/:id", sellerController.getSellerProfile);

// Get seller reviews
router.get("/:id/reviews", sellerController.getSellerReviews);

// Upload product
router.post(
  "/upload",
  photoupload.array("images", 4),
  sellerController.sellerUpload
);

// Get filtered products
router.get("/filtered-part", sellerController.filterProducts);

module.exports = router;
