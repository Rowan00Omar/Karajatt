const crypto = require("crypto");
const PaymobService = require("../services/paymobService");
const db = require("../db");

function fillBillingDefaults(billingData = {}) {

  const defaults = {
    first_name: "Ali",
    last_name: "Mohamed",
    email: "alimohamed@gmail.com",
    phone_number: "+966512345678",
    apartment: "12",
    floor: "1",
    street: "King Fahad Rd",
    building: "25B",
    shipping_method: "PKG",
    postal_code: "12345",
    city: "Riyadh",
    country: "SA",
    state: "Riyadh",
  };

  // Ensure all fields are strings and not "NA"
  const processedData = {};
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const value = billingData[key];
    processedData[key] = String(
      !value || value === "NA" ? defaultValue : value
    );
  }

  return processedData;
}

exports.initiatePayment = async (req, res) => {
  try {
    const { cartItems, billingData, amount, inspectionFees } = req.body;

    // Validate cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    // Validate amount
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Process billing data
    const processedBillingData = fillBillingDefaults(billingData);

    // Get auth token
    const authToken = await PaymobService.getAuthToken();

    // Create order
    const orderData = {
      amount_cents: amountCents,
      items: cartItems.map((item) => ({
        name: String(item.name || item.title || item.part_name || "Product"),
        amount_cents: Math.round(
          parseFloat(item.amount_cents || item.price) * 100
        ),
        description: String(
          item.description ||
            item.name ||
            item.title ||
            item.part_name ||
            "Product Description"
        ),
        quantity: parseInt(item.quantity) || 1,
      })),
    };

    const orderResp = await PaymobService.createOrder(authToken, orderData);

    // Get payment key
    const paymentKeyData = {
      amount_cents: amountCents,
      order_id: orderResp.id,
      billing_data: processedBillingData,
    };

    const paymentToken = await PaymobService.getPaymentKey(
      authToken,
      paymentKeyData
    );

    // Generate payment URL
    const paymentUrl = PaymobService.generatePaymentUrl(paymentToken);

    res.json({ success: true, paymentUrl, orderId: orderResp.id });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: err.response?.data || err.message,
    });
  }
};

exports.handleWebHook = async (req, res) => {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    const receivedHmac = req.headers.hmac;

    const { obj } = req.body;

    // Step 1: Sort the keys alphabetically
    const sortedKeys = Object.keys(obj).sort();
    const concatenatedValues = sortedKeys.map((key) => obj[key]).join("");

    // Step 2: Calculate HMAC SHA512
    const calculatedHmac = crypto
      .createHmac("sha512", hmacSecret)
      .update(concatenatedValues)
      .digest("hex");

    if (receivedHmac !== calculatedHmac) {
      return res.status(401).json({ error: "Invalid HMAC signature" });
    }

    // Extract transaction details
    const {
      order: { id: orderId },
      success,
      is_refunded,
      amount_cents,
      id: transactionId,
    } = obj;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is missing" });
    }

    // Update order status in database
    const updateQuery = `
      UPDATE orders 
      SET payment_status = ?, 
          updated_at = CURRENT_TIMESTAMP,
          transaction_id = ?,
          payment_amount = ?,
          payment_verified = ?
      WHERE id = ?
    `;

    const status = success && !is_refunded ? "paid" : "failed";
    const amount = amount_cents ? amount_cents / 100 : 0; // Convert cents to SAR
    const paymentVerified = success && !is_refunded;

    await db.query(updateQuery, [
      status,
      transactionId,
      amount,
      paymentVerified,
      orderId,
    ]);

    // If payment is successful, you might want to trigger additional actions
    if (paymentVerified) {
      // TODO: Add any additional post-payment processing here
      // For example: sending confirmation emails, updating inventory, etc.
    }

    res.status(200).json({
      status: "Webhook processed successfully",
      orderId,
      paymentStatus: status,
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({
      error: "Failed to process webhook",
      details: err.message,
    });
  }
};

exports.checkout = exports.initiatePayment;

exports.verifyPayment = async (req, res) => {
  try {
    const {
      id: transactionId,
      order: orderId,
      success,
      is_refunded,
      amount_cents,
    } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Verify transaction with PayMob
    let paymentVerified = false;
    if (transactionId) {
      try {
        const transaction = await PaymobService.verifyTransaction(
          transactionId
        );
        paymentVerified =
          transaction.success && transaction.is_refunded === false;
      } catch (err) {
        console.error("PayMob verification error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to verify payment with PayMob",
        });
      }
    }

    // Update order status in database
    const updateQuery = `
      UPDATE orders 
      SET payment_status = ?, 
          updated_at = CURRENT_TIMESTAMP,
          transaction_id = ?,
          payment_amount = ?
      WHERE id = ?
    `;

    const status = paymentVerified ? "paid" : "failed";
    const amount = amount_cents ? amount_cents / 100 : 0; // Convert cents to SAR
    await db.query(updateQuery, [status, transactionId, amount, orderId]);

    if (paymentVerified) {
      // Get order details
      const [order] = await db.query(
        "SELECT id, total FROM orders WHERE id = ?",
        [orderId]
      );

      return res.json({
        success: true,
        order: {
          id: orderId,
          total: order.total,
          status: status,
        },
      });
    }

    return res.json({
      success: false,
      error: "Payment verification failed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to verify payment",
      details: err.message,
    });
  }
};

exports.paymobCallback = async (req, res) => {
  try {
    const { id: transactionId, order: orderId, amount_cents } = req.query;

    if (!orderId) {
      return res.status(400).json({ success: false, error: "Order ID is required" });
    }

    // Verify with Paymob API
    let paymentVerified = false;
    let transactionStatus = "failed";
    let isRefunded = false;
    let amount = amount_cents ? amount_cents / 100 : 0;
    if (transactionId) {
      try {
        const transaction = await PaymobService.verifyTransaction(transactionId);
        paymentVerified = transaction.success && transaction.is_refunded === false;
        transactionStatus = paymentVerified ? "paid" : "failed";
        isRefunded = transaction.is_refunded;
        amount = transaction.amount_cents ? transaction.amount_cents / 100 : amount;
      } catch (err) {
        paymentVerified = false;
        transactionStatus = "failed";
      }
    }

    // Update orders table
    await db.query(
      `UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP, transaction_id = ?, payment_amount = ?, payment_verified = ? WHERE id = ?`,
      [transactionStatus, transactionId, amount, paymentVerified, orderId]
    );

    // Update payment_transactions table
    // Find the latest payment_transaction for this order
    const [rows] = await db.query(
      `SELECT id FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`,
      [orderId]
    );
    if (rows.length > 0) {
      await db.query(
        `UPDATE payment_transactions SET transaction_id = ?, amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [transactionId, amount, transactionStatus, rows[0].id]
      );
    }

    return res.json({
      success: paymentVerified,
      orderId,
      transactionId,
      status: transactionStatus,
      isRefunded,
      amount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "حدث خطأ أثناء معالجة الدفع.", details: err.message });
  }
};
