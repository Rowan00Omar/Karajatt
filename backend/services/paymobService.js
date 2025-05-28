const axios = require("axios");
const config = require("../config/paymob");

class PaymobService {
  static async getAuthToken() {
    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/auth/tokens",
      { api_key: config.apiKey }
    );
    return response.data.token;
  }

  static async createOrder() {
    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: "SAR",
        items: items.map((item) => ({
          name: item.name,
          amount_cents: item.price * 100,
          quantity: item.quantity,
        })),
      }
    );
    return response.data.id;
  }
  static async generatePaymentKey(token, orderId, phone) {
    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: amount * 100,
        currency: "SAR",
        order_id: orderId,
        integration_id: config.stcPayIntegrationId,
        billing_data: {
          first_name: "Customer",
          last_name: "Name",
          email: "customer@example.com",
          phone_number: phone,
          country: "SA",
        },
      }
    );
    return response.data.token;
  }
}
module.exports = PaymobService;
