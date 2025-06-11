const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs").promises;

// Image dimensions
const IMAGE_WIDTH = 800;  // width in pixels
const IMAGE_HEIGHT = 600; // height in pixels
const IMAGE_QUALITY = 80; // quality 1-100

// Ensure images directory exists
const imagesDir = path.join(__dirname, "../images");
fs.mkdir(imagesDir, { recursive: true }).catch(console.error);

// Define storage engine
const photostorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDir); // Use the defined images directory
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
        // Check if file is an image
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max size
        files: 4 // Maximum 4 files
    }
}).array("images", 4); // Handle multiple files, max 4

// Process images after upload
const processImages = async (req, res, next) => {
    if (!req.files) return next();

    try {
        const processedFiles = [];

        for (const file of req.files) {
            const outputPath = file.path;
            
            // Process image with sharp
            await sharp(file.path)
                .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 } // white background
                })
                .jpeg({ quality: IMAGE_QUALITY })
                .toFile(outputPath + '_processed');

            // Replace original file with processed one
            await fs.unlink(file.path);
            await fs.rename(outputPath + '_processed', outputPath);

            processedFiles.push(file);
        }

        req.files = processedFiles;
        next();
    } catch (error) {
        next(error);
    }
};

// Wrapper function to handle multer errors
const uploadMiddleware = (req, res, next) => {
    photoupload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: "File size is too large. Maximum size is 10MB"
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    error: "Too many files. Maximum is 4 files"
                });
            }
            return res.status(400).json({
                error: err.message
            });
        } else if (err) {
            // An unknown error occurred
            return res.status(400).json({
                error: err.message
            });
        }
        
        // Process images after successful upload
        processImages(req, res, (err) => {
            if (err) {
                return res.status(500).json({
                    error: "Error processing images"
                });
            }
            next();
        });
    });
};

module.exports = uploadMiddleware;
