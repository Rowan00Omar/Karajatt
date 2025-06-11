const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

// Ensure all admin routes require authentication and admin role
router.use(authenticateToken);
router.use(checkRole("admin"));

// Import admin controllers
const {
  getAllUsers,
  deleteUser,
  getOrderHistory,
  getProductStats,
  updateProductStatus,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getUserStats,
  getSalesStats,
  getInventoryStats,
  getSellers,
} = require("../controllers/adminController");

const {
  getOrdersForInspection,
  startInspection,
  submitInspectionReport,
  getInspectionReport,
  verifyReport,
  downloadReport,
  getInspectionFee,
  updateInspectionFee,
} = require("../controllers/inspectionController");

// Dashboard statistics routes
router.get("/stats/users", getUserStats);
router.get("/stats/sales", getSalesStats);
router.get("/stats/inventory", getInventoryStats);

// Sellers management routes
router.get("/sellers", getSellers);

// User management routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Order management routes
router.get("/orders", getOrderHistory);

// Product management routes
router.get("/products/stats", getProductStats);
router.patch("/products/:id/status", updateProductStatus);

// Pending requests routes
router.get("/pending-requests", getPendingRequests);
router.post("/approve-request/:id", approveRequest);
router.post("/reject-request/:id", rejectRequest);

// Inspection management routes
router.get("/inspection/fee", getInspectionFee);
router.put("/inspection/fee", updateInspectionFee);
router.get("/inspection/orders", getOrdersForInspection);
router.post("/inspection/orders/:orderId/start", startInspection);
router.post("/inspection/orders/:orderId/report", submitInspectionReport);
router.get("/inspection/orders/:orderId/report", getInspectionReport);
router.head("/inspection/orders/:orderId/report/verify", verifyReport);
router.post("/inspection/orders/:orderId/report/download", downloadReport);
router.get("/inspection/orders/:orderId/report/download", downloadReport);

module.exports = router;
