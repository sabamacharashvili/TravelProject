import express from "express";
import {
  login,
  register,
  getProfile, 
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js"; 

const router = express.Router();

// user registration
router.post("/register", register);

// user login
router.post("/login", login);

// user profile route
router.get("/profile", authenticateToken, getProfile);


export default router;
