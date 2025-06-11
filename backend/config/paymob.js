require("dotenv").config();

// Log environment variables for debugging (without showing actual values)
console.log("PayMob Environment Variables Status:", {
  PAYMOB_API_KEY: process.env.PAYMOB_API_KEY ? "Set" : "Not Set",
  PAYMOB_SECRET_KEY: process.env.PAYMOB_SECRET_KEY ? "Set" : "Not Set",
  PAYMOB_PUBLIC_KEY: process.env.PAYMOB_PUBLIC_KEY ? "Set" : "Not Set",
  PAYMOB_INTEGRATION_ID: process.env.PAYMOB_INTEGRATION_ID ? "Set" : "Not Set",
  PAYMOB_IFRAME_ID: process.env.PAYMOB_IFRAME_ID ? "Set" : "Not Set",
});

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
console.log("API Key:", config.apiKey);
console.log("Secret Key:", config.secretKey);

// Log config (without sensitive data)
console.log("PayMob Configuration:", {
  baseUrl: config.baseUrl,
  checkoutUrl: config.checkoutUrl,
  apiKey: "[HIDDEN]",
  secretKey: "[HIDDEN]",
  publicKey: "[HIDDEN]",
  integrationId: config.integrationId,
  iframeId: config.iframeId,
});

module.exports = config;
