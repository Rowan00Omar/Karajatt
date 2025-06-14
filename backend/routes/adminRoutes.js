const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
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

// Configure multer storage
const storage = multer.memoryStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads", "reports");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      console.error("Error creating upload directory:", error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const orderId = req.params.orderId;
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    const safeFileName = `inspection_report_${orderId}_${timestamp}_${originalName}`;
    cb(null, safeFileName);
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log("Processing file upload:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    if (!file.mimetype.includes("pdf")) {
      console.error("Invalid file type:", file.mimetype);
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

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

// Submit inspection report with multer middleware
router.post(
  "/inspection/orders/:orderId/report",
  (req, res, next) => {
    console.log("Before upload - Headers:", req.headers);
    console.log("Before upload - Body:", req.body);
    next();
  },
  upload.single("report"),
  (req, res, next) => {
    console.log("After upload - Body:", req.body);
    console.log("After upload - File:", req.file);

    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({
        message: "No file uploaded",
        debug: {
          headers: req.headers,
          body: req.body,
        },
      });
    }

    next();
  },
  submitInspectionReport
);

router.get("/inspection/orders/:orderId/report", getInspectionReport);
router.head("/inspection/orders/:orderId/report/verify", verifyReport);
router.get("/inspection/orders/:orderId/report/download", downloadReport);

module.exports = router;
