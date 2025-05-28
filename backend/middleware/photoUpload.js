const path = require("path");
const multer = require("multer");

// Define storage engine
const photostorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images")); // Save to ../images directory
    },
    filename: function (req, file, cb) {
        if (file) {
            // Format timestamp safely for all OS
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

            // Sanitize original file name
            const originalName = path.basename(file.originalname).replace(/\s+/g, "_");

            cb(null, `${timestamp}-${originalName}`);
        } else {
            cb(null, false);
        }
    }
});

// Initialize multer with filter and size limit
const photoupload = multer({
    storage: photostorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file format"), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 1MB max size
    }
});

module.exports = photoupload;
