const crypto = require("crypto");
const PaymobService = require("../services/paymobService");

function fillBillingDefaults(billingData = {}) {
  // Default values for Saudi Arabia
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

    // TODO: Update database, mark order as paid, etc.

    res.status(200).json({ status: "Webhook processed" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to process webhook",
      details: err.message,
    });
  }
};

exports.checkout = exports.initiatePayment;
