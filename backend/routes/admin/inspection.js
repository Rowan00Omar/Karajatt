const express = require('express');
const router = express.Router();
const inspectionController = require('../../controllers/inspectionController');
const { authenticateToken } = require('../../middleware/auth');

// Get all orders that need inspection
router.get('/orders', authenticateToken, inspectionController.getOrdersForInspection);

// Start inspection process
router.post('/orders/:orderId/start', authenticateToken, inspectionController.startInspection);

// Submit inspection report
router.post('/orders/:orderId/report', authenticateToken, inspectionController.submitInspectionReport);

// Verify report exists
router.head('/orders/:orderId/report/verify', authenticateToken, inspectionController.verifyReport);

// Download inspection report (accept both POST and GET)
router.post('/orders/:orderId/report/download', authenticateToken, inspectionController.downloadReport);
router.get('/orders/:orderId/report/download', authenticateToken, inspectionController.downloadReport);

module.exports = router; 