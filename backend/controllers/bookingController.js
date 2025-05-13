import Booking from "../models/booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    console.log("Received booking request:", req.body);

    if (!req.body) {
      return res.status(400).json({ message: "No booking data provided" });
    }

    const booking = new Booking(req.body);
    console.log("Created booking object:", booking);

    const savedBooking = await booking.save();
    console.log("Saved booking:", savedBooking);

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({
      message: error.message || "Failed to create booking",
      details: error.toString(),
    });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    console.log("Fetching all bookings");
    const bookings = await Booking.find().sort({ date: 1 });
    console.log("Found bookings:", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch bookings",
      details: error.toString(),
    });
  }
};

// Get a single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch booking",
      details: error.toString(),
    });
  }
};

// Book an existing trip
export const bookTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide email and phone number" });
    }

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid tour ID format" });
    }

    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Create a new booking for the user
    const newBooking = new Booking({
      destination: existingBooking.destination,
      date: existingBooking.date,
      time: existingBooking.time,
      email,
      phone,
      directions: existingBooking.directions,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error booking trip:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid tour ID" });
    }
    res.status(500).json({
      message: error.message || "Failed to book trip",
      details: error.toString(),
    });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete booking",
      details: error.toString(),
    });
  }
};
