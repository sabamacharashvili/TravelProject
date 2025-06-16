import express from "express";
import {
  login,
  register,
  getProfile, // ✅ ADD THIS
  // addTourToUser, (optional if unused)
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js"; // ✅ Required to protect route

const router = express.Router();

// user registration
router.post("/register", register);

// user login
router.post("/login", login);

// user profile route
router.get("/profile", authenticateToken, getProfile);

// add a tour to a user (if you still want this)
// router.post("/add-tour", addTourToUser);

export default router;
