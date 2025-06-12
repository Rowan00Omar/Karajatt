const fs = require('fs').promises;
const path = require('path');

async function setupUploadsDirectory() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const reportsDir = path.join(uploadsDir, 'reports');

    // Create directories if they don't exist
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(reportsDir, { recursive: true });

    console.log('Upload directories created successfully');
  } catch (error) {
    console.error('Error setting up upload directories:', error);
    process.exit(1);
  }
}

setupUploadsDirectory(); 