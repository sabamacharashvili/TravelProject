import express from 'express';
import { 
  createTour, 
  getTours, 
  getTour, 
  bookTour, 
  deleteTour 
} from '../controllers/tourController.js'; // Adjusted the import for the correct controller

const router = express.Router();

// create a new tour
router.post('/', createTour);

// get all tours
router.get('/', getTours);

// get a single tour by ID
router.get('/:id', getTour);

// book a tour (adding a user to a tour)
router.post('/:id/book', bookTour); // Changed route to handle booking action

// delete a tour by ID
router.delete('/:id', deleteTour);

export default router;
