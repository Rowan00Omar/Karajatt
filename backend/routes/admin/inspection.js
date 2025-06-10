const express = require("express");
const router = express.Router();
const inspectionController = require("../../controllers/inspectionController");
const { authenticateToken } = require("../../middleware/auth");

router.get("/fee", authenticateToken, inspectionController.getInspectionFee);

router.put("/fee", authenticateToken, inspectionController.updateInspectionFee);

router.get(
  "/orders",
  authenticateToken,
  inspectionController.getOrdersForInspection
);

router.post(
  "/orders/:orderId/start",
  authenticateToken,
  inspectionController.startInspection
);

// Submit inspection report
router.post(
  "/orders/:orderId/report",
  authenticateToken,
  inspectionController.submitInspectionReport
);

router.head(
  "/orders/:orderId/report/verify",
  authenticateToken,
  inspectionController.verifyReport
);

router.post(
  "/orders/:orderId/report/download",
  authenticateToken,
  inspectionController.downloadReport
);
router.get(
  "/orders/:orderId/report/download",
  authenticateToken,
  inspectionController.downloadReport
);

module.exports = router;
