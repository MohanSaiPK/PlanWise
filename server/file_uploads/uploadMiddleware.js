import multer from "multer"; // Handles multipart/form-data

const memoryStorage = multer.memoryStorage();

// --- Configuration ---
// Configure multer to store files in memory for direct upload to Cloudinary.
// This prevents writing large files to your local server's disk.
export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
