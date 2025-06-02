/**
 * Handles database errors and sends appropriate responses
 * @param {Error} error - The error object from the database operation
 * @param {Response} res - The Express response object
 */
const handleDatabaseError = (error, res) => {
  console.error("Database Error:", error);

  // Handle specific MySQL errors
  switch (error.code) {
    case "ER_DUP_ENTRY":
      return res.status(409).json({
        message: "A record with this information already exists.",
        error: error.message,
      });

    case "ER_NO_REFERENCED_ROW":
    case "ER_NO_REFERENCED_ROW_2":
      return res.status(400).json({
        message: "Referenced record does not exist.",
        error: error.message,
      });

    case "ER_ROW_IS_REFERENCED":
    case "ER_ROW_IS_REFERENCED_2":
      return res.status(400).json({
        message:
          "Cannot delete or update a record that is referenced by other records.",
        error: error.message,
      });

    case "ER_BAD_FIELD_ERROR":
      return res.status(400).json({
        message: "Invalid field in database operation.",
        error: error.message,
      });

    case "ER_ACCESS_DENIED_ERROR":
      return res.status(403).json({
        message: "Database access denied.",
        error: "Database authentication failed",
      });

    case "ECONNREFUSED":
      return res.status(503).json({
        message: "Database connection failed.",
        error: "Unable to connect to the database",
      });

    default:
      // For any other database errors
      return res.status(500).json({
        message: "An error occurred while processing your request.",
        error: error.message,
      });
  }
};

module.exports = {
  handleDatabaseError,
};
