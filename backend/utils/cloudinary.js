const cloudinary = require("cloudinary");
require("dotenv").config();

// Validate cloudinary configuration
const requiredEnvVars = ['CLOUD_NAME', 'API_KEY', 'API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImage = async(fileToUpload) => {
    try {
        if (!fileToUpload) {
            throw new Error('No file provided for upload');
        }

        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
            timeout: 60000, // 60 seconds timeout
        });

        if (!data || !data.secure_url) {
            throw new Error('Failed to get upload URL from Cloudinary');
        }

        return data;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}

const cloudinaryUploadMultipleImages = async (filesToUpload) => {
    try {
        if (!Array.isArray(filesToUpload) || filesToUpload.length === 0) {
            throw new Error('No files provided for upload');
        }

        const uploadPromises = filesToUpload.map(file =>
            cloudinary.uploader.upload(file, {
                resource_type: 'auto',
                timeout: 60000, // 60 seconds timeout
            })
        );

        const results = await Promise.all(uploadPromises);

        // Validate results
        if (!results.every(result => result && result.secure_url)) {
            throw new Error('Some images failed to upload to Cloudinary');
        }

        return results;
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error);
        throw error;
    }
};

const cloudinaryRemoveImage = async(imagePublicId) => {
    try {
        if (!imagePublicId) {
            throw new Error('No image ID provided for deletion');
        }

        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
    } catch (error) {
        console.error('Cloudinary remove error:', error);
        throw error;
    }
}

const cloudinaryRemoveMultiImage = async(publicIds) => {
    try {
        if (!Array.isArray(publicIds) || publicIds.length === 0) {
            throw new Error('No image IDs provided for deletion');
        }

        const result = await cloudinary.v2.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error('Cloudinary multiple remove error:', error);
        throw error;
    }
}

module.exports = {
    cloudinaryRemoveImage,
    cloudinaryUploadImage,   
    cloudinaryRemoveMultiImage,
    cloudinaryUploadMultipleImages
}