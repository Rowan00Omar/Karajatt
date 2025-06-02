const PaymobService = require("../services/paymobService");
const Cart = require("../models/cartModel");
const db = require("../db");

const initiateSTCPayment = async (req, res) => {
  try {
    const { cartId, phone } = req.body;
    const { cart } = req;

    const token = await PaymobService.getAuthToken();
    const orderId = await PaymobService.createOrder(token, cart.total, cart.items);
    const paymentKey = await PaymobService.generatePaymentKey(token, orderId, phone);

    res.json({
      paymentUrl: `https://accept.paymobsolutions.com/api/acceptance/iframes/${config.iframeId}?payment_token=${paymentKey}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleWebHook = async (req, res) => {
  const { obj } = req.body;

  if (obj.success && obj.source_data.subtype === "WALLET") {
    await Cart.markCartAsPaid(obj.order.merchant_order_id);
  }

  res.sendStatus(200);
};

const checkout = async (req, res) => {
  try {
    const { cartItems, userId } = req.body;

    const totalPrice = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + price * item.quantity;
    }, 0);

    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, order_date, total_price) VALUES (?, NOW(), ?)",
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, price]
      );
    }

    res.status(200).json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all at once
module.exports = {
  initiateSTCPayment,
  handleWebHook,
  checkout,
};
