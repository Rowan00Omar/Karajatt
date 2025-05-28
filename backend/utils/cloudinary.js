const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImage = async(fileToUpload)=> {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload , {
            resource_type : 'auto' ,
        });
        return data;
    } catch (error) {
        return error;
    }
}
const cloudinaryUploadMultipleImages = async (filesToUpload) => {
  try {
    const uploadPromises = filesToUpload.map(file =>
      cloudinary.uploader.upload(file, { resource_type: 'auto' })
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    return error;
  }
};

const cloudinaryRemoveImage = async(imagePublicId)=> {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId)
        return result ;
    } catch (error) {
        return error;
    }
}
const cloudinaryRemoveMultiImage = async(publicids)=> {
    try {
        const result = await cloudinary.v2.api.delete_resources(publicids);
        return result ;
    } catch (error) {
        return error;
    }
}


module.exports ={
cloudinaryRemoveImage,
cloudinaryUploadImage,   
cloudinaryRemoveMultiImage,
cloudinaryUploadMultipleImages
}