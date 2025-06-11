const PaymobService = require("../services/paymobService");

exports.initiatePayment = async (req, res) => {
  try {
    const { cartItems, billingData, amount } = req.body;

    // Convert amount to cents
    const amountCents = Math.round(amount * 100);

    // Get authentication token
    const authToken = await PaymobService.getAuthToken();

    // Create order
    const orderData = {
      amount_cents: amountCents,
      items: cartItems.map((item) => ({
        name: item.name,
        amount_cents: item.amount_cents,
        description: item.description,
        quantity: item.quantity,
      })),
    };

    const orderResponse = await PaymobService.createOrder(authToken, orderData);

    // Get payment key
    const paymentKeyRequest = {
      amount_cents: amountCents,
      order_id: orderResponse.id,
      billing_data: {
        first_name: billingData.firstName,
        last_name: billingData.lastName,
        email: billingData.email,
        phone_number: billingData.phone,
        country: billingData.country,
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        state: "NA",
      },
    };

    const paymentToken = await PaymobService.getPaymentKey(
      authToken,
      paymentKeyRequest
    );
    const paymentUrl = PaymobService.generatePaymentUrl(paymentToken);

    res.status(200).json({
      success: true,
      paymentUrl,
      orderId: orderResponse.id,
    });
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: error.response?.data || error.message,
    });
  }
};

exports.handleWebHook = async (req, res) => {
  try {
    const { obj } = req.body;

    // Verify the transaction
    if (obj.success === true) {
      // Payment successful
      // Here you would typically update your database
      // and handle order fulfillment
      console.log("Payment successful for order:", obj.order.id);
    } else {
      // Payment failed
      console.log("Payment failed for order:", obj.order.id);
    }

    res.status(200).json({ status: "Webhook processed" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};

exports.checkout = exports.initiatePayment; // Use the same handler for both endpoints
