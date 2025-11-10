import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/UserRoute.js";
import transactionRoutes from "./routes/TransRoute.js";
import goalRoutes from "./routes/goalRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import uploadRoutes from "./routes/uploadRoute.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://planwise.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/uploads", uploadRoutes); // <-- NEW ROUTE MOUNT
// app.options("*", cors());

// Example GET route with error handling
app.get("/", async (req, res) => {
  try {
    const data = { message: "PlanWise backend is working. Whew!" };

    res.status(200).json(data);
  } catch (error) {
    console.error("GET / error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/income-expense", incomeRoutes);

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    error: "Server error",
    message: error.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(0); // Exit if database connection fails
  });
