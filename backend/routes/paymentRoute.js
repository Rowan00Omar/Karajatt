const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { validateCart } = require("../middleware/cartMiddleware");
const { validateBillingData } = require("../middleware/paymentMiddleware");

// Initialize payment
router.post(
  "/initiate",
  validateCart,
  validateBillingData,
  paymentController.initiatePayment
);

// Handle PayMob webhook
router.post("/webhook", paymentController.handleWebHook);

// Checkout endpoint
router.post(
  "/checkout",
  validateCart,
  validateBillingData,
  paymentController.checkout
);

module.exports = router;
