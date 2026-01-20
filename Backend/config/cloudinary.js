import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
  finally {
     fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
