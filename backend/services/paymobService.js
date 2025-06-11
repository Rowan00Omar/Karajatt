const axios = require("axios");
const config = require("../config/paymob");

class PaymobService {
  async getAuthToken() {
    try {
      const response = await axios.post(`${config.baseUrl}/auth/tokens`, {
        api_key: config.apiKey,
      });
      return response.data.token;
    } catch (error) {
      console.error(
        "Error getting auth token:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async createOrder(authToken, orderData) {
    try {
      const response = await axios.post(
        `${config.baseUrl}/ecommerce/orders`,
        {
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: orderData.amount_cents,
          currency: "SAR",
          items: orderData.items,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getPaymentKey(authToken, paymentData) {
    try {
      const response = await axios.post(
        `${config.baseUrl}/acceptance/payment_keys`,
        {
          auth_token: authToken,
          amount_cents: paymentData.amount_cents,
          expiration: 3600,
          order_id: paymentData.order_id,
          billing_data: paymentData.billing_data,
          currency: "SAR",
          integration_id: config.integrationId,
          lock_order_when_paid: true,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data.token;
    } catch (error) {
      console.error(
        "Error getting payment key:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  generatePaymentUrl(paymentToken) {
    return `${config.checkoutUrl}?payment_token=${paymentToken}`;
  }
}

module.exports = new PaymobService();
