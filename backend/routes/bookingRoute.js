import express from 'express';
import { createBooking, getBookings, getBooking, deleteBooking, bookTrip } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);


router.get('/', getBookings);


router.get('/:id', getBooking);


router.post('/:id', bookTrip);


router.delete('/:id', deleteBooking);

export default router; 