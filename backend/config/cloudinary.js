import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const uploadOnCloudinary = async (filepath) => {
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
try{
  const uploadResult = await cloudinary.uploader.upload(filepath, {
    folder: 'your_folder_name', // Optional: specify a folder in Cloudinary
  });
  fs.unlinkSync(filepath); // Delete the local file after uploading
  return uploadResult.secure_url; // Return the URL of the uploaded image
}catch(error){
  fs.unlinkSync(filepath); // Ensure the local file is deleted even if there's an error
   return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
}
}
export default uploadOnCloudinary;