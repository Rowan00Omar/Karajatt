const pool = require("../db");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.includes("pdf")) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
}).single("report");

// Export the configured upload middleware
exports.upload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "File is too large. Maximum size is 10MB",
        });
      }
      return res.status(400).json({
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      if (err.message === "Only PDF files are allowed") {
        return res.status(415).json({
          message: err.message,
        });
      }
      return res.status(500).json({
        message: `Upload error: ${err.message}`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    next();
  });
};

// Get all orders that need inspection
exports.getOrdersForInspection = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.id,
        o.user_id,
        o.status,
        o.order_date,
        o.total_price,
        u.first_name as buyer_first_name,
        u.last_name as buyer_last_name,
        GROUP_CONCAT(DISTINCT s.email) as seller_emails,
        GROUP_CONCAT(DISTINCT p.title) as product_titles,
        GROUP_CONCAT(DISTINCT p.part_name) as part_names,
        GROUP_CONCAT(DISTINCT oi.quantity) as quantities,
        GROUP_CONCAT(DISTINCT s.email ORDER BY p.product_id) as seller_emails_ordered,
        MAX(ir.inspector_phone) as inspector_phone,
        MAX(ir.report_file_path) as report_file_path
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      JOIN users s ON p.seller_id = s.id
      LEFT JOIN inspection_reports ir ON o.id = ir.order_id
      GROUP BY 
        o.id,
        o.user_id,
        o.status,
        o.order_date,
        o.total_price,
        u.first_name,
        u.last_name
      ORDER BY o.order_date DESC`
    );

    // Transform the data to handle multiple products per order
    const transformedOrders = orders.map((order) => {
      const productTitles = order.product_titles?.split(",") || [];
      const partNames = order.part_names?.split(",") || [];
      const quantities = order.quantities?.split(",") || [];
      const sellerEmails = order.seller_emails_ordered?.split(",") || [];

      return {
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        created_at: order.order_date,
        total_price: order.total_price,
        buyer_first_name: order.buyer_first_name,
        buyer_last_name: order.buyer_last_name,
        seller_emails: [...new Set(sellerEmails)], // Remove duplicates
        inspector_phone: order.inspector_phone,
        report_file_path: order.report_file_path,
        products:
          productTitles.map((title, index) => ({
            title: title,
            part_name: partNames[index],
            quantity: parseInt(quantities[index]),
            seller_email: sellerEmails[index],
          })) || [],
      };
    });

    res.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Failed to fetch orders for inspection",
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
      },
    });
  }
};

// Start inspection process for an order
exports.startInspection = async (req, res) => {
  const orderId = parseInt(req.params.orderId, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    // First verify the order exists and is in pending status
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND status = 'pending'",
      [orderId]
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Order not found or not in pending status" });
    }

    // No need to update status since we're keeping it as pending
    res.json({ message: "Inspection process started" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Failed to start inspection",
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
      },
    });
  }
};

// Submit inspection report
exports.submitInspectionReport = async (req, res) => {
  let connection;
  try {
    const { orderId } = req.params;
    const { inspectionStatus, inspectorPhone, inspectorNotes } = req.body;

    // Validate required fields
    if (!inspectionStatus || !inspectorPhone) {
      return res.status(400).json({
        message:
          "Missing required fields: status and inspector phone number are required",
      });
    }

    // Validate phone number format
    const phoneRegex = /^(05)[0-9]{8}$/;
    if (!phoneRegex.test(inspectorPhone)) {
      return res.status(400).json({
        message: "Invalid phone number format",
      });
    }

    // Upload file to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "raw",
      folder: "inspection_reports",
      public_id: `report_${orderId}_${Date.now()}`,
    });

    // Get database connection
    connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // First check if order exists and can be updated
      const [orderCheck] = await connection.query(
        "SELECT status FROM orders WHERE id = ?",
        [orderId]
      );

      if (!orderCheck.length) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update order status
      const [updateResult] = await connection.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [inspectionStatus, orderId]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Failed to update order ${orderId}`);
      }

      // Create inspection report record
      const [insertResult] = await connection.query(
        `INSERT INTO inspection_reports 
        (order_id, inspector_phone, status, report_file_path, inspector_notes)
        VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          inspectorPhone,
          inspectionStatus,
          cloudinaryResponse.secure_url,
          inspectorNotes || null,
        ]
      );

      await connection.commit();

      res.json({
        message: "Inspection report submitted successfully",
        reportUrl: cloudinaryResponse.secure_url,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error in submitInspectionReport:", error);
    res.status(500).json({
      message: "Failed to submit inspection report",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get inspection report for an order
exports.getInspectionReport = async (req, res) => {
  const { orderId } = req.params;

  try {
    const [reports] = await pool.query(
      `SELECT * FROM inspection_reports WHERE order_id = ?`,
      [orderId]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: "No inspection report found" });
    }

    res.json({ report: reports[0] });
  } catch (error) {
    console.error("Error fetching inspection report:", error);
    res.status(500).json({ message: "Failed to fetch inspection report" });
  }
};

// Verify report exists
exports.verifyReport = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Verifying report existence for order:", orderId);

    // Get the report details from the database
    const [reports] = await pool.query(
      `SELECT report_file_path FROM inspection_reports WHERE order_id = ?`,
      [orderId]
    );

    if (reports.length === 0) {
      return res.status(404).end();
    }

    const reportPath = path.join(
      __dirname,
      "..",
      "uploads",
      "reports",
      reports[0].report_file_path
    );

    // Check if file exists
    try {
      await fs.access(reportPath);
      res.status(200).end();
    } catch (error) {
      res.status(404).end();
    }
  } catch (error) {
    console.error("Error verifying report:", error);
    res.status(500).end();
  }
};

// Download inspection report PDF
exports.downloadReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get the report details from the database
    const [reports] = await pool.query(
      `SELECT report_file_path FROM inspection_reports WHERE order_id = ?`,
      [orderId]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: "تقرير الفحص غير موجود" });
    }

    const reportPath = path.join(
      __dirname,
      "..",
      "uploads",
      "reports",
      reports[0].report_file_path
    );

    // Check if file exists
    try {
      await fs.access(reportPath);
    } catch (error) {
      return res.status(404).json({ message: "ملف التقرير غير موجود" });
    }

    res.sendFile(reportPath);
  } catch (error) {
    console.error("Error in download process:", error);
    res.status(500).json({
      message: "فشل في تحميل التقرير",
      error: error.message,
    });
  }
};

// Get inspection fee
exports.getInspectionFee = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT fee FROM inspection_settings ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      // If no fee is set, return the default fee
      return res.json({ fee: 49.0 });
    }

    res.json({ fee: rows[0].fee });
  } catch (error) {
    console.error("Error fetching inspection fee:", error);
    res.status(500).json({
      message: "Failed to fetch inspection fee",
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
      },
    });
  }
};

// Update inspection fee
exports.updateInspectionFee = async (req, res) => {
  try {
    const { fee } = req.body;

    if (typeof fee !== "number" || fee < 0) {
      return res.status(400).json({ message: "Invalid fee value" });
    }

    await pool.query("INSERT INTO inspection_settings (fee) VALUES (?)", [fee]);

    res.json({
      success: true,
      message: "Inspection fee updated successfully",
      fee: fee,
    });
  } catch (error) {
    console.error("Error updating inspection fee:", error);
    res.status(500).json({
      message: "Failed to update inspection fee",
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
      },
    });
  }
};
