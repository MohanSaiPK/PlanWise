import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PlanWise backend is working. Whew!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MOngoDB");
    app.listen(5000, () => console.log("port https://localhost:5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
