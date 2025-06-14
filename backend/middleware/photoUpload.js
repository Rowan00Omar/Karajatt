const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs").promises;
const fsSync = require("fs");

// Image dimensions
const IMAGE_WIDTH = 800; // width in pixels
const IMAGE_HEIGHT = 600; // height in pixels
const IMAGE_QUALITY = 80; // quality 1-100

// Ensure images directory exists
const imagesDir = path.join(__dirname, "../images");

// Create images directory if it doesn't exist
const ensureImagesDir = async () => {
  try {
    await fs.mkdir(imagesDir, { recursive: true });
  } catch (error) {
    throw new Error("Failed to create images directory");
  }
};

// Initialize directory
ensureImagesDir().catch(console.error);

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
      if (i === retries - 1) {
        console.error(
          `Failed to delete file after ${retries} attempts:`,
          filePath
        );
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Helper function to safely rename a file with retries
const safeRenameFile = async (oldPath, newPath, retries = 5, delay = 1000) => {
  if (!fileExists(oldPath)) {
    return false;
  }

  for (let i = 0; i < retries; i++) {
    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch (error) {
      if (i === retries - 1) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Define storage engine
const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    if (file) {
      // Format timestamp safely for all OS
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      // Sanitize original file name
      const originalName = path
        .basename(file.originalname)
        .replace(/\s+/g, "_");
      cb(null, `${timestamp}-${originalName}`);
    } else {
      cb(new Error("No file provided"), false);
    }
  },
});

// Initialize multer with filter and size limit
const photoupload = multer({
  storage: photostorage,
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
    files: 4, // Maximum 4 files
  },
}).array("images", 4);

// Process images after upload
const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const processedFiles = [];
  const filesToCleanup = new Set();

  try {
    for (const file of req.files) {
      try {
        const outputPath = file.path;
        const processedPath = outputPath + "_processed";
        filesToCleanup.add(outputPath);
        filesToCleanup.add(processedPath);

        // Process image with sharp
        await sharp(file.path)
          .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .jpeg({ quality: IMAGE_QUALITY })
          .toFile(processedPath);

        // Replace original file with processed one
        const deleteSuccess = await safeDeleteFile(outputPath);
        if (!deleteSuccess) {
          console.error(`Failed to delete original file: ${outputPath}`);
        }

        const renameSuccess = await safeRenameFile(processedPath, outputPath);
        if (!renameSuccess) {
          console.error(`Failed to rename processed file: ${processedPath}`);
          // If rename failed, try to delete the processed file
          await safeDeleteFile(processedPath);
          continue;
        }

        processedFiles.push(file);
      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        // Don't throw here, continue with other files
      }
    }

    if (processedFiles.length === 0) {
      throw new Error("فشل في معالجة جميع الصور");
    }

    req.files = processedFiles;
    next();
  } catch (error) {
    // Clean up any remaining files
    for (const filePath of filesToCleanup) {
      await safeDeleteFile(filePath);
    }
    next(error);
  }
};

// Wrapper function to handle multer errors
const uploadMiddleware = (req, res, next) => {
  photoupload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت",
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "عدد الملفات كبير جداً. الحد الأقصى هو 4 ملفات",
        });
      }
      return res.status(400).json({
        error: err.message,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        error: err.message,
      });
    }

    // Process images after successful upload
    processImages(req, res, (err) => {
      if (err) {
        return res.status(500).json({
          error: err.message || "خطأ في معالجة الصور",
        });
      }
      next();
    });
  });
};

module.exports = uploadMiddleware;
