const validateBillingData = (req, res, next) => {
  const { billingData } = req.body;

  if (!billingData) {
    return res.status(400).json({ error: "Billing data is required" });
  }

  const requiredFields = [
    "apartment",
    "email",
    "floor",
    "first_name",
    "street",
    "building",
    "phone_number",
    "shipping_method",
    "postal_code",
    "city",
    "country",
    "last_name",
    "state",
  ];

  const missingFields = requiredFields.filter(
    (field) => !billingData[field] || billingData[field] === "NA"
  );

  console.log('validat', missingFields)
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing or invalid billing fields",
      missingFields,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingData.email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(billingData.phone_number)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  // Validate country code
  if (billingData.country !== "SA") {
    return res
      .status(400)
      .json({ error: "Country must be SA for Saudi Arabia" });
  }

  next();
};

module.exports = {
  validateBillingData,
};
