const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const filteringRoutes = require("./routes/filteringRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
//Routes
app.use("/api", reviewRoutes);
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/filtering", filteringRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
