import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.MONGO_URI;

const app = express();
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

export default app;
