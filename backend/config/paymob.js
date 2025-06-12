require("dotenv").config();

const config = {
  baseUrl: "https://ksa.paymob.com/api",
  checkoutUrl: "https://ksa.paymob.com/unifiedcheckout",
  apiKey: process.env.PAYMOB_API_KEY?.trim(),
  secretKey: process.env.PAYMOB_SECRET_KEY?.trim(),
  publicKey: process.env.PAYMOB_PUBLIC_KEY?.trim(),
  integrationId: process.env.PAYMOB_INTEGRATION_ID,
  iframeId: process.env.PAYMOB_IFRAME_ID,
};

// Validate required configuration
if (!config.apiKey) throw new Error("PayMob API key is required");
if (!config.secretKey) throw new Error("PayMob Secret key is required");
if (!config.publicKey) throw new Error("PayMob Public key is required");
if (!config.integrationId) throw new Error("PayMob Integration ID is required");
if (!config.iframeId) throw new Error("PayMob Iframe ID is required");

// Validate integration ID format
if (isNaN(parseInt(config.integrationId))) {
  throw new Error("PayMob Integration ID must be a number");
}

module.exports = config;
