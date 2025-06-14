const fs = require("fs").promises;
const fsSync = require("fs");

// Helper function to check if file exists
const fileExists = (filePath) => {
  try {
    return fsSync.existsSync(filePath);
  } catch {
    return false;
  }
};

// Helper function to safely delete a file with retries
const safeDeleteFile = async (filePath, retries = 5, delay = 1000) => {
  if (!fileExists(filePath)) {
    return true;
  }

  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      // Try to close any open handles first
      try {
        const fd = await fs.open(filePath, "r");
        await fd.close();
      } catch (e) {
        // Ignore errors here
      }

      await fs.unlink(filePath);
      return true;
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Only log failure if all retries failed
  if (lastError) {
    console.error(
      `Failed to delete file after ${retries} attempts: ${filePath}`,
      lastError
    );
  }
  return false;
};

module.exports = {
  fileExists,
  safeDeleteFile,
};
