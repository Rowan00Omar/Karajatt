const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "inspection_reports",
    resource_type: "raw",
    allowed_formats: ["pdf"],
    format: "pdf",
    transformation: [{ quality: "auto" }],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.includes("pdf")) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
}).single("report");

module.exports = {
  cloudinary,
  upload,
};
