import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config.js";
import userRouter from "./routes/userRoute.js";
import tourRouter from "./routes/tourRoutes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Test Server endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Routes
app.use("/user", userRouter);
app.use("/tour", tourRouter); // Tour related routes (Add this if you're using tours)


app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

// MongoDB connection setup
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test the server at: http://localhost:${PORT}/test`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });
