const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { validateCart } = require("../middleware/cartMiddleware");
const { validateBillingData } = require("../middleware/paymentMiddleware");

router.post(
  "/initiate",
  validateCart,
  validateBillingData,
  paymentController.initiatePayment
);

router.post("/webhook", paymentController.handleWebHook);

router.post(
  "/checkout",
  validateCart,
  validateBillingData,
  paymentController.checkout
);

router.get("/result", paymentController.verifyPayment);

router.get("/paymob-callback", paymentController.paymobCallback);

module.exports = router;
