const express = require("express");
const router = express.Router();
const { authenticateToken, checkRole } = require("../middleware/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require("../controllers/couponController");

// Admin routes (protected)
router.post("/", authenticateToken, checkRole("admin"), createCoupon);
router.get("/", authenticateToken, checkRole("admin"), getAllCoupons);
router.put("/:id", authenticateToken, checkRole("admin"), updateCoupon);
router.delete("/:id", authenticateToken, checkRole("admin"), deleteCoupon);

// Public routes
router.post("/validate", validateCoupon);

module.exports = router; 