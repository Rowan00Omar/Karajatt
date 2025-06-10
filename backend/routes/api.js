const express = require("express");
const router = express.Router();
const { getInspectionFee } = require("../controllers/inspectionController");

// Public routes that don't require authentication
router.get("/inspection/fee", getInspectionFee);

module.exports = router;
