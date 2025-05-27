const express = require("express");
const router = express.Router();
const filteringController = require("../controllers/filteringController");

router.get("/unified-data", filteringController.unifiedData);
module.exports = router;
