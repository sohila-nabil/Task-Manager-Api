import { v2 as cloudinary } from "cloudinary";


// Upload Image
export const uploadImage = async (filePath, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder, // organize files in a folder
      resource_type: "auto", // handles images, videos, pdf, etc
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

// Delete Image
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};
