const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const fs = require("fs").promises;
require("dotenv").config();


// Import routes
const authRoutes = require("./routes/authRoutes");
const filteringRoutes = require("./routes/filteringRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");
const apiRoutes = require("./routes/api");

const allowedOrigins = [
  "http://localhost:5173",
  "http://16.171.198.163",
  "https://karajatt.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/filtering", filteringRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Handle multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File is too large. Maximum size is 10MB",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Create necessary directories
async function createDirectories() {
  const dirs = [
    path.join(__dirname, "uploads"),
    path.join(__dirname, "uploads", "reports"),
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
}

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

// Initialize server
async function initServer() {
  try {
    // Create required directories
    await createDirectories();

    // Test database connection
    await testConnection();

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
}

initServer();
