const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authenticate = require("../middleware/authMiddleware");

// Apply authentication middleware to all seller routes
router.use(authenticate);

// Best-selling parts
router.get("/best-selling", sellerController.getBestSelling);

// Sales report
router.get("/sales-report/:year", sellerController.getSalesReport);

// Payment info
router.get("/payment-info", sellerController.getPaymentInfo);
router.post("/payment-info", sellerController.updatePaymentInfo);

// Inventory management
router.get("/inventory", sellerController.getInventory);
router.patch("/inventory/:id", sellerController.updateStock);

module.exports = router;

