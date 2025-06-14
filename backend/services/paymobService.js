const axios = require("axios");
const config = require("../config/paymob");

class PaymobService {
  async getAuthToken() {
    try {
      const resp = await axios.post(`${config.baseUrl}/auth/tokens`, {
        api_key: config.apiKey,
      });
      return resp.data.token;
    } catch (err) {
      throw err;
    }
  }

  async createOrder(authToken, orderData) {
    try {
      const resp = await axios.post(
        `${config.baseUrl}/ecommerce/orders`,
        {
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: orderData.amount_cents,
          currency: "SAR",
          items: orderData.items || [],
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  async getPaymentKey(authToken, paymentData) {
    try {
      const resp = await axios.post(
        `${config.baseUrl}/acceptance/payment_keys`,
        {
          auth_token: authToken,
          amount_cents: paymentData.amount_cents,
          expiration: 3600,
          order_id: paymentData.order_id,
          billing_data: paymentData.billing_data,
          currency: "SAR",
          integration_id: parseInt(config.integrationId),
          lock_order_when_paid: true,
          return_url: `${process.env.FRONTEND_URL}/user/payment/result`,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      return resp.data.token;
    } catch (err) {
      throw err;
    }
  }

  generatePaymentUrl(paymentToken) {
    return `${config.baseUrl}/acceptance/iframes/${config.iframeId}?payment_token=${paymentToken}`;
  }

  async verifyTransaction(transactionId) {
    try {
      const authToken = await this.getAuthToken();
      const response = await axios.get(
        `${config.baseUrl}/acceptance/transactions/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new PaymobService();
