const express = require("express");
const router = express.Router();
const sellerUpload =  require("../controllers/sellerController")
const multer = require("multer");
const upload = multer(); 

router.post("/upload", upload.none() , sellerUpload.sellerUpload);
module.exports = router;
