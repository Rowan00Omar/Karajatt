const validateBillingData = (req, res, next) => {
  const { billingData } = req.body;

  if (!billingData) {
    return res.status(400).json({ error: "Billing data is required" });
  }

  const requiredFields = ["firstName", "lastName", "email", "phone", "country"];

  const missingFields = requiredFields.filter((field) => !billingData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required billing fields",
      missingFields,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (billingData.email !== "NA" && !emailRegex.test(billingData.email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (billingData.phone !== "NA" && !phoneRegex.test(billingData.phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  next();
};

module.exports = {
  validateBillingData,
};
