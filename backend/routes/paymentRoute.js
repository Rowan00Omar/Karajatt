const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { validateCart } = require("../middleware/cartMiddleware");

router.post("/stc-pay", validateCart, paymentController.initiateSTCPayment);
router.post("/paymob-callback", paymentController.handleWebHook);
router.post('/checkout',paymentController.checkout);
module.exports = router;
