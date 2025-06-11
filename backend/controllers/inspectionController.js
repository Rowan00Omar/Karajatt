const pool = require("../db");
const path = require("path");
const fs = require("fs").promises;

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
  try {
    const { orderId } = req.params;
    console.log("Starting report submission for order:", orderId);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content type:", req.headers['content-type']);

    // Check if form data exists
    if (!req.body) {
      console.log("No form data received");
      return res.status(400).json({
        message: "No form data received"
      });
    }

    // Check if files exist
    if (!req.files || !req.files.report) {
      console.log("No files received");
      return res.status(400).json({
        message: "No report file uploaded"
      });
    }

    // Get form fields from request
    const inspectionStatus = req.body.inspectionStatus;
    const inspectorPhone = req.body.inspectorPhone;
    const inspectorNotes = req.body.inspectorNotes || "";

    console.log("Form fields:", {
      inspectionStatus,
      inspectorPhone,
      inspectorNotes
    });

    // Validate required fields
    if (!inspectionStatus || !inspectorPhone) {
      console.log("Missing required fields:", { inspectionStatus, inspectorPhone });
      return res.status(400).json({
        message: "Missing required fields: status and inspector phone number are required"
      });
    }

    // Validate file
    const reportFile = req.files.report;
    console.log("Uploaded file details:", {
      name: reportFile.name,
      size: reportFile.size,
      mimetype: reportFile.mimetype,
      tempFilePath: reportFile.tempFilePath
    });

    if (reportFile.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed"
      });
    }

    const reportFileName = `inspection_report_${orderId}_${Date.now()}.pdf`;
    const reportPath = path.join(
      __dirname,
      "..",
      "uploads",
      "reports",
      reportFileName
    );

    // Ensure uploads directory exists
    await fs.mkdir(path.join(__dirname, "..", "uploads", "reports"), {
      recursive: true
    });

    try {
      // Move the file using the tempFilePath
      if (reportFile.tempFilePath) {
        await fs.rename(reportFile.tempFilePath, reportPath);
      } else {
        // Fallback to mv() if tempFilePath is not available
        await reportFile.mv(reportPath);
      }
      
      console.log("File saved successfully to:", reportPath);

      // Verify file was saved
      const stats = await fs.stat(reportPath);
      console.log("Saved file stats:", {
        size: stats.size,
        path: reportPath
      });
    } catch (error) {
      console.error("Error saving file:", error);
      throw new Error("Failed to save report file");
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update order status to match inspection result
      await connection.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [inspectionStatus, orderId]
      );

      // Create inspection report record
      await connection.query(
        `INSERT INTO inspection_reports 
        (order_id, inspector_phone, status, report_file_path, inspector_notes)
        VALUES (?, ?, ?, ?, ?)`,
        [orderId, inspectorPhone, inspectionStatus, reportFileName, inspectorNotes]
      );

      await connection.commit();
      console.log("Database transaction completed successfully");

      res.json({
        message: "Inspection report submitted successfully",
        reportPath: reportFileName
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error submitting inspection report:", error);
    res.status(500).json({
      message: "Failed to submit inspection report",
      error: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
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
    console.log("Starting report download for order:", orderId);

    // Get the report details from the database
    const [reports] = await pool.query(
      `SELECT report_file_path FROM inspection_reports WHERE order_id = ?`,
      [orderId]
    );

    if (reports.length === 0) {
      console.log("No report found for order:", orderId);
      return res.status(404).json({ message: "تقرير الفحص غير موجود" });
    }

    const reportPath = path.join(
      __dirname,
      "..",
      "uploads",
      "reports",
      reports[0].report_file_path
    );
    console.log("Attempting to download file:", reportPath);

    // Check if file exists
    try {
      await fs.access(reportPath);
    } catch (error) {
      console.error("File not found:", error);
      return res.status(404).json({ message: "ملف التقرير غير موجود" });
    }

    // Get file stats
    const stats = await fs.stat(reportPath);

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stats.size);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="inspection_report_${orderId}.pdf"`
    );

    // Stream the file
    const fileStream = require("fs").createReadStream(reportPath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "حدث خطأ أثناء تحميل الملف" });
      }
    });
  } catch (error) {
    console.error("Error in download process:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "فشل في تحميل التقرير",
        error: {
          message: error.message,
          code: error.code,
          sqlMessage: error.sqlMessage,
        },
      });
    }
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
