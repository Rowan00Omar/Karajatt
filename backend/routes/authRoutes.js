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
  getPassedOrdersHistory,
  downloadInspectionReport,
  deleteOwnAccount,
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

router.get("/orders/passed/:userId", authenticateToken, getPassedOrdersHistory);

router.get("/orders/:orderId/report/download", authenticateToken, downloadInspectionReport);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.delete("/me", authenticateToken, deleteOwnAccount);

module.exports = router;
