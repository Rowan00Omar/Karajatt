const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");

// Apply authentication middleware to all admin routes
router.use(authenticate);

// Pending requests routes
router.get("/pending-requests", adminController.getPendingRequests);
router.post("/approve-request/:id", adminController.approveRequest);
router.post("/reject-request/:id", adminController.rejectRequest);

module.exports = router; 