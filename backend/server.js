const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const filteringRoutes = require("./routes/filteringRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/filtering", filteringRoutes);
app.use("./api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
