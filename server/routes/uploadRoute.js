// routes/uploadRoute.js
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { uploadMiddleware } from "../file_uploads/uploadMiddleware.js"; // Import the middleware

const router = express.Router();

// The uploadMiddleware.single('image') handles the file processing
router.post(
  "/upload-image",
  uploadMiddleware.single("image"),
  async (req, res) => {
    // Input Validation
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }

    try {
      // Prepare Data URI for Cloudinary
      const dataUri = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "user_uploads",
        quality: "auto:best",
        fetch_format: "auto",
      });

      // Send Success Response
      res.status(201).json({
        message: "Image uploaded successfully!",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      // Error Handling
      console.error("Cloudinary Upload Error:", error);
      res.status(500).json({
        message: "Error uploading image to cloud storage.",
        error: error.message,
      });
    }
  }
);

export default router;
