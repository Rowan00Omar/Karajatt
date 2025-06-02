const rateLimit = require("express-rate-limit");

// Rate limiter for review creation
const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit each user to 5 reviews per day
  message: {
    message: "Too many reviews created. Please try again after 24 hours.",
  },
  keyGenerator: (req) => req.user.id, // Rate limit by user ID
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for review updates
const reviewUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each user to 10 review updates per 15 minutes
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
