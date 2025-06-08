const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const photoupload = require("../middleware/photoUpload");
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

router.get("/profile/:id", sellerController.getSellerProfile);

router.post(
  "/upload",
  photoupload.array("images", 4),
  sellerController.sellerUpload
);

router.get("/filtered-part", sellerController.filterProducts);

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
