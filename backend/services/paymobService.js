const axios = require("axios");
const config = require("../config/paymob");

class PaymobService {
  /**
   * Create an Intention for wallet payments (STC Pay, Google Pay, etc.)
   */
  async createIntention(orderData) {
    
    try {
      const resp = await axios.post(
        `${config.baseUrl}/v1/intention`,
        {
          amount: 1,// orderData.amount_cents, // in smallest currency unit 
          currency: "SAR",
          payment_methods: [config.integrationId], 
          items: orderData.items || [],
          billing_data: orderData.billing_data,
          notification_url: `${process.env.FRONTEND_URL}/paymob-callback`,
          redirection_url: `${process.env.FRONTEND_URL}/user/payment/result`,
          // special_reference: orderData.reference,
        },
        {
          headers: { Authorization: `Token ${config.secretKey}` },
        }
      );
      console.log('createInention', resp)
      return resp.data; // includes redirect_url
    } catch (err) {
      console.error("Intention creation error:", err.response?.data || err.message);
      throw err;
    }
  }

  /**
   * Verify transaction status by ID
   */
  async verifyTransaction(transactionId) {
    try {
      const resp = await axios.get(
        `${config.baseUrl}/v1/transactions/${transactionId}`,
        {
          headers: { Authorization: `Token ${config.secretKey}` },
        }
      );
      return resp.data;
    } catch (err) {
      console.error("Verify transaction error:", err.response?.data || err.message);
      throw err;
    }
  }
}

module.exports = new PaymobService();
