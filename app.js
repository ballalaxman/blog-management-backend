import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userroute.js";
import authRoutes from "./routes/authroute.js";

dotenv.config();

const DB_URL = process.env.MONGO_URI;

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error Connected to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to The Root Url");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is successfully running on port ${PORT}`);
  } else {
    console.log("Error occured, server can't start", error);
  }
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
