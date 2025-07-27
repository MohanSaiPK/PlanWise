import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Example GET route with error handling
app.get("/", async (req, res) => {
  try {
    // Simulate some operation that might fail
    // Replace this with your actual GET logic
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

// Example GET route with database operation
app.get("/api/data", async (req, res) => {
  try {
    // Example database operation
    // const data = await YourModel.find();

    // For now, simulate a successful response
    const data = { items: [], count: 0 };

    res.status(200).json(data);
  } catch (error) {
    console.error("GET /api/data error:", error);

    // Handle different types of errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        details: error.errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "The provided ID is not valid",
      });
    }

    // Default error response
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler for undefined routes - temporarily disabled due to path-to-regexp issue
// app.use("/*", (req, res) => {
//   res.status(404).json({
//     error: "Route not found",
//     message: `Cannot ${req.method} ${req.originalUrl}`,
//     timestamp: new Date().toISOString(),
//   });
// });

// Global error handling middleware (must be last)
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    error: "Server error",
    message: error.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if database connection fails
  });
