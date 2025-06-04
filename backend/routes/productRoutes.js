const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/getSingleProduct/:id", productController.getProduct);

module.exports = router;
