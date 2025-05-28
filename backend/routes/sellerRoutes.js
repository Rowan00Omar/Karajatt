const express = require("express");
const router = express.Router();
const sellerUpload = require("../controllers/sellerController");
const photoupload = require("../middleware/photoUpload")

router.post("/upload", photoupload.array('images', 4) , sellerUpload.sellerUpload);
router.get("/filtered-part", sellerUpload.filterProducts);
module.exports = router;

