import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "process.env.CLOUDINARY_CLOUD_NAME",
  api_key: "process.env.CLOUDINARY_API_KEY",
  api_secret: "process.env.CLOUDINARY_API_SECRET",
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    // Upload an image
    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: "shoes",
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary!", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }

  console.log(response);
};

export { uploadOnCloudinary };
