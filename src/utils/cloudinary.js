import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist: " + filePath);
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Remove local file after successful upload
    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
