require("dotenv").config();
const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const filteringRoutes = require("./routes/filteringRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/filtering", filteringRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
