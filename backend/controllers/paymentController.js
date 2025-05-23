const PaymobService = require("../services/paymobService");
const Cart = require("../models/cartModel");

exports.initiateSTCPayment = async (req, res) => {
  try {
    const { cartId, phone } = req.body;
    const { cart } = req;

    const token = await PaymobService.getAuthToken();
    const orderId = await PaymobService.createOrder(
      token,
      cart.total,
      cart.items
    );
    const paymentKey = await PaymobService.generatePaymentKey(
      token,
      orderId,
      phone
    );

    res.json({
      paymentUrl: `https://accept.paymobsolutions.com/api/acceptance/iframes/${config.iframeId}?payment_token=${paymentKey}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleWebHook = async (req, res) => {
  const { obj } = req.body;

  if (obj.success && obj.source_data.subtype === "WALLET") {
    await Cart.markCartAsPaid(obj.order.merchant_order_id);
  }

  res.sendStatus(200);
};
