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
    const userId = req.user?.id; 

    // Debug logging to see what data is being received
    console.log("🔍 Received cart data:", JSON.stringify(req.body, null, 2));
    console.log("🔍 Cart items:", JSON.stringify(cartItems, null, 2));

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

    // Create order in local database
    try {
      const [orderResult] = await db.query(
        `
        INSERT INTO orders (
          id, 
          user_id, 
          total_price, 
          payment_status, 
          payment_verified,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, 'pending', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        [orderResp.id, userId || null, parseFloat(amount)]
      );

      
    } catch (error) {
      console.error("❌ Error creating order in database:", error);
      throw new Error(`Failed to create order in database: ${error.message}`);
    }

    // Create order_items in local database
    try {
      for (const item of cartItems) {
        const productId = item.product_id || item.id;
        if (!productId) {
          console.error('❌ Cart item missing product_id or id:', item);
          throw new Error(`Cart item is missing product_id or id: ${JSON.stringify(item)}`);
        }
        await db.query(
          `
          INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
          [
            orderResp.id,
            productId,
            parseInt(item.quantity) || 1,
            parseFloat(item.price || item.amount_cents || 0)
          ]
        );
      }


    } catch (error) {
      console.error("❌ Error creating order_items in database:", error);
      throw new Error(`Failed to create order items in database: ${error.message}`);
    }

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

    // Insert payment_token into payment_transactions, truncated to 1024 chars
    try {
      await db.query(
        `
        INSERT INTO payment_transactions (
          order_id,
          amount,
          status,
          payment_token,
          created_at,
          updated_at
        ) VALUES (?, ?, 'pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        [orderResp.id, parseFloat(amount), paymentToken.slice(0, 1024)]
      );

    } catch (error) {
      console.error("❌ Error creating payment_transactions in database:", error);
      throw new Error(`Failed to create payment transaction in database: ${error.message}`);
    }

    // Generate payment URL
    const paymentUrl = PaymobService.generatePaymentUrl(paymentToken);

    res.json({ success: true, paymentUrl, orderId: orderResp.id });
  } catch (err) {
    console.error("❌ Error in initiatePayment:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: err.response?.data || err.message,
    });
  }
};

exports.handleWebHook = async (req, res) => {


  try {
    let paymentData = req.body;

    // If using the new format with `success` in the top-level object
    if (paymentData.success !== undefined) {

      
      const {
        success,
        orderId,
        transactionId,
        isRefunded,
        amount
      } = paymentData;



      if (!orderId) {
        console.error("❌ Order ID is missing in webhook payload");
        return res.status(400).json({ error: "Order ID is missing" });
      }

      const paymentStatus = (success && !isRefunded ? "paid" : "failed").toLowerCase();
      const paymentVerified = success && !isRefunded;



      // Update orders table
      await db.query(
        `
        UPDATE orders
        SET payment_status = ?,
            updated_at = CURRENT_TIMESTAMP,
            transaction_id = ?,
            payment_amount = ?,
            payment_verified = ?
        WHERE id = ?
        `,
        [paymentStatus, transactionId, amount, paymentVerified, orderId]
      );



      // Update payment_transactions table
      const [rows] = await db.query(
        `SELECT id FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`,
        [orderId]
      );

      if (rows.length > 0) {
        await db.query(
          `
          UPDATE payment_transactions
          SET transaction_id = ?,
              amount = ?,
              status = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [transactionId, amount, paymentStatus, rows[0].id]
        );

      } else {
        console.warn(`⚠️ No payment_transactions record found for order ${orderId}`);
      }

      if (paymentVerified) {

        try {

          const [orderItems] = await db.query(
            `SELECT product_id FROM order_items WHERE order_id = ?`,
            [orderId]
          );

          if (orderItems.length === 0) {
            console.warn(`⚠️ No order_items found for order_id=${orderId}`);
            console.warn(`This means the order was created in Paymob but not in your local database`);
            console.warn(`Check your checkout flow to ensure order_items are created before payment`);
          } else {
            for (const item of orderItems) {

              await db.query(
                `UPDATE products SET status = 'sold', updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
                [item.product_id]
              );


            }

          }
        } catch (error) {
          console.error("Error updating products status:", error);
          console.error("Order ID:", orderId);
          console.error("Error details:", error.message);
          // Don't fail the webhook if product update fails
        }

        // TODO: Add any additional post-payment processing here
        // For example: sending confirmation emails, updating inventory, etc.
      }

      return res.status(200).json({
        status: "Webhook processed successfully",
        orderId,
        paymentStatus,
        success: paymentVerified
      });
    }

    // If using the old format with `obj` payload

    
    const { obj } = paymentData;

    if (!obj) {
      console.error("❌ Invalid payload: no 'obj' found");
      return res.status(400).json({ error: "Invalid payload: no 'obj' found" });
    }

    const {
      order: { id: orderId },
      success,
      is_refunded,
      amount_cents,
      id: transactionId
    } = obj;



    if (!orderId) {
      console.error("❌ Order ID is missing in Paymob payload");
      return res.status(400).json({ error: "Order ID is missing" });
    }

    const paymentStatus = (success && !is_refunded ? "paid" : "failed").toLowerCase();
    const paymentVerified = success && !is_refunded;
    const amount = amount_cents ? amount_cents / 100 : 0;



    // Update orders table
    await db.query(
      `
      UPDATE orders
      SET payment_status = ?,
          updated_at = CURRENT_TIMESTAMP,
          transaction_id = ?,
          payment_amount = ?,
          payment_verified = ?
      WHERE id = ?
      `,
      [paymentStatus, transactionId, amount, paymentVerified, orderId]
    );



    // Update payment_transactions table
    const [rows] = await db.query(
      `SELECT id FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`,
      [orderId]
    );

    if (rows.length > 0) {
      await db.query(
        `
        UPDATE payment_transactions
        SET transaction_id = ?,
            amount = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [transactionId, amount, paymentStatus, rows[0].id]
      );

    } else {
      console.warn(`⚠️ No payment_transactions record found for order ${orderId}`);
    }

    // If payment is successful, you might want to trigger additional actions
    if (paymentVerified) {

      
      // Remove products from the products table when payment is successful
      try {
        // Get all products in this order
        const [orderItems] = await db.query(
          `SELECT product_id FROM order_items WHERE order_id = ?`,
          [orderId]
        );

        if (orderItems.length === 0) {
          console.warn(`⚠️ No order_items found for order_id=${orderId}`);
          console.warn(`This means the order was created in Paymob but not in your local database`);
          console.warn(`Check your checkout flow to ensure order_items are created before payment`);
        } else {
          // Update each product status to 'sold' or remove them
          for (const item of orderItems) {
            // Option 1: Update status to 'sold' (recommended for keeping history)
            await db.query(
              `UPDATE products SET status = 'sold', updated_at = CURRENT_TIMESTAMP WHERE product_id = ?`,
              [item.product_id]
            );

            // Option 2: Delete the product (uncomment if you want to completely remove)
            // await db.query(
            //   `DELETE FROM products WHERE product_id = ?`,
            //   [item.product_id]
            // );
          }

    
        }
      } catch (error) {
        console.error("Error updating products status:", error);
        console.error("Order ID:", orderId);
        console.error("Error details:", error.message);
        // Don't fail the webhook if product update fails
      }

      // TODO: Add any additional post-payment processing here
      // For example: sending confirmation emails, updating inventory, etc.
    }

    return res.status(200).json({
      status: "Webhook processed successfully",
      orderId,
      paymentStatus
    });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    console.error("Error details:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      error: "Failed to process webhook",
      details: err.message
    });
  }
};


exports.checkout = exports.initiatePayment;

exports.verifyPayment = async (req, res) => {
  try {
    // Accept both 'transaction_id' and 'id' as transactionId
    const orderId = req.query.order;
    const transactionId = req.query.transaction_id || req.query.id;
    const { success, is_refunded, amount_cents } = req.query;

    // Log incoming query params
    console.log("[verifyPayment] Incoming query params:", JSON.stringify(req.query, null, 2));

    if (!orderId) {
      console.log("[verifyPayment] Missing orderId");
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Verify transaction with PayMob
    let paymentVerified = false;
    let paymobTransaction = null;
    if (transactionId) {
      try {
        paymobTransaction = await PaymobService.verifyTransaction(
          transactionId
        );
        console.log("[verifyPayment] PaymobService.verifyTransaction response:", JSON.stringify(paymobTransaction, null, 2));
        paymentVerified =
          paymobTransaction.success && paymobTransaction.is_refunded === false;
      } catch (err) {
        console.error("[verifyPayment] PayMob verification error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to verify payment with PayMob",
        });
      }
    } else {
      console.log("[verifyPayment] No transactionId provided, skipping Paymob verification");
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
        "SELECT id, total_price FROM orders WHERE id = ?",
        [orderId]
      );

      console.log("[verifyPayment] Payment verified, sending success response for order:", orderId);
      return res.json({
        success: true,
        order: {
          id: orderId,
          total: order[0]?.total_price,
          status: status,
        },
      });
    }

    console.log("[verifyPayment] Payment not verified, sending failure response for order:", orderId);
    return res.json({
      success: false,
      error: "Payment verification failed",
    });
  } catch (err) {
    console.error("[verifyPayment] Exception:", err);
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

    await db.query(
      `UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP, transaction_id = ?, payment_amount = ?, payment_verified = ? WHERE id = ?`,
      [transactionStatus, transactionId, amount, paymentVerified, orderId]
    );


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
