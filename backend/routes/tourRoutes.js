import express from "express";
import {
  createTour,
  getTours,
  getTour,
  bookTour,
  deleteTour,
} from "../controllers/tourController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// create a new tour
router.post("/", authenticateToken, createTour);

// get all tours
router.get("/", getTours);

// get a single tour by ID
router.get("/:id", getTour);

// book a tour (adding a user to a tour)
router.post("/:id/book", authenticateToken, bookTour); 

// delete a tour by ID
router.delete("/:id", authenticateToken, deleteTour);

export default router;
