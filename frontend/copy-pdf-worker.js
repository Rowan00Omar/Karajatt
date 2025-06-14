import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Updated path for the latest version
const sourceFile = path.join(
  __dirname,
  "node_modules",
  "pdfjs-dist",
  "legacy",
  "build",
  "pdf.worker.min.js"
);
const targetFile = path.join(__dirname, "public", "pdf.worker.min.js");

// Ensure the public directory exists
if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"));
}

// Copy the file
fs.copyFileSync(sourceFile, targetFile);
console.log("PDF worker file copied successfully!");
