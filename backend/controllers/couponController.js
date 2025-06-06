const Coupon = require("../models/couponModel");

// Create a new coupon (Admin only)
const createCoupon = async (req, res) => {
  try {
    const { code, discount_percentage, expiry_date } = req.body;

    if (!code || !discount_percentage || !expiry_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCoupon = await Coupon.getByCode(code);
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const couponId = await Coupon.create(code, discount_percentage, expiry_date);
    res.status(201).json({ message: "Coupon created successfully", couponId });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Error creating coupon", error: error.message });
  }
};

// Get all coupons (Admin only)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.getAll();
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Error fetching coupons", error: error.message });
  }
};

// Update a coupon (Admin only)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, expiry_date, is_active } = req.body;

    if (!code || !discount_percentage || !expiry_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCoupon = await Coupon.getByCode(code);
    if (existingCoupon && existingCoupon.id !== parseInt(id)) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    await Coupon.update(id, { code, discount_percentage, expiry_date, is_active });
    res.json({ message: "Coupon updated successfully" });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Error updating coupon", error: error.message });
  }
};

// Delete a coupon (Admin only)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.delete(id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Error deleting coupon", error: error.message });
  }
};

// Validate a coupon (Public)
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.validateCoupon(code);

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }

    res.json({
      valid: true,
      discount_percentage: coupon.discount_percentage
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Error validating coupon", error: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon
}; 