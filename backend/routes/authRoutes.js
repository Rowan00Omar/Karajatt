const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  UserInfo,
  getAllUsers,
  deleteUser,
  getOrderHistory,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/userInfo", authenticateToken, UserInfo);

router.get("/users", authenticateToken, checkRole("admin"), getAllUsers);
router.delete("/users/:id", authenticateToken, checkRole("admin"), deleteUser);

router.get("/orders/:userId", authenticateToken, getOrderHistory);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
