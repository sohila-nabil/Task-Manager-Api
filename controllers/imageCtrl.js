import { uploadImage, deleteImage } from "../utils/cloudinary.js";

export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { path } = req.file;
    const result = await uploadImage(path, "uploads");

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: result, // { url, public_id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteImageController = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, message: "publicId is required" });
    }

    const result = await deleteImage(publicId);

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
