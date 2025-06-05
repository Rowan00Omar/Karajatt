const rateLimit = require("express-rate-limit");

const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many reviews created. Please try again after 24 hours.",
  },
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
});

const reviewUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many review updates. Please try again after 15 minutes.",
  },
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  reviewLimiter,
  reviewUpdateLimiter,
};
