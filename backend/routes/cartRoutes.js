const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const { getCart, addToCart } = require("../controllers/cartController");

router.use(authenticate);

router.get("/", getCart);
router.post("/", addToCart);

module.exports = router;
