import { v2 as cloudinnary } from "cloudinary";
import fs from "fs/promises"; // Using promises version of fs for async/await
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

cloudinnary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Function to upload file to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // check if localfilepath is provided
    // if (!localFilePath) return null; //or
    if (!localFilePath) {
      throw new Error("Local file path is requirad");
    }

    //upload the file on cloudinary
    const response = await cloudinnary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove the local save temporary file
    await fs.unlink(localFilePath);

    // Return the cloudinary response
    return response;
  } catch (error) {
    // Handle errors
    console.error("Error uploading file to Cloudinary:", error.massage);

    //Remove the locally saved file if exist
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath);
      } catch (unlinkError) {
        console.error("Error deleting local file:", error.massage);
      }
    }
    // Return null to indicate failure
    return null;
  }
};

export { uploadOnCloudinary };
