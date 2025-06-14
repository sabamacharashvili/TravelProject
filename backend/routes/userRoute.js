import express from "express";
import {
  login,
  register,
  addTourToUser,
} from "../controllers/userController.js";

const router = express.Router();

// user registration
router.post("/register", register);

// user login
router.post("/login", login);

// add a tour to a user (either created or joined)
router.post("/add-tour", addTourToUser);

export default router;
