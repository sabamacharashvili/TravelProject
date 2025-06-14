import Tours from "../models/tours.js";
import User from "../models/user.js";  

// Create a new tour
export const createTour = async (req, res) => {
  try {
    console.log("Received tour creation request:", req.body);

    if (!req.body || !req.body.creator) {
      return res.status(400).json({ message: "No tour data provided or creator missing" });
    }

    
    const creator = req.body.creator; 


    const user = await User.findById(creator);
    if (!user) {
      return res.status(404).json({ message: "User (creator) not found" });
    }

    const tour = new Tours({
      ...req.body,  
      creator: creator,  
    });

    console.log("Created tour object:", tour);

    const savedTour = await tour.save();
    console.log("Saved tour:", savedTour);

   
    user.toursCreated.push(savedTour._id);
    await user.save();

    res.status(201).json(savedTour);
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(400).json({
      message: error.message || "Failed to create tour",
      details: error.toString(),
    });
  }
};

// Get all tours
export const getTours = async (req, res) => {
  try {
    console.log("Fetching all tours");
    const tours = await Tours.find().sort({ date: 1 });
    console.log("Found tours:", tours);
    res.status(200).json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch tours",
      details: error.toString(),
    });
  }
};

// Get a single tour
export const getTour = async (req, res) => {
  try {
    const tour = await Tours.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch tour",
      details: error.toString(),
    });
  }
};

// Book an existing tour (adds a user to the tour's users array)
export const bookTour = async (req, res) => {
  try {
    const { id } = req.params; 
    const { userId, fullName, email, phone } = req.body;  // User booking details

    if (!userId || !fullName || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide userId, fullName, email, and phone number" });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid tour ID format" });
    }

    const existingTour = await Tours.findById(id);
    if (!existingTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the tour's users array
    existingTour.user.push(userId);
    await existingTour.save();

    
    user.tour.push(existingTour._id);
    await user.save();

    res.status(200).json(existingTour);
  } catch (error) {
    console.error("Error booking tour:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid tour ID" });
    }
    res.status(500).json({
      message: error.message || "Failed to book tour",
      details: error.toString(),
    });
  }
};

// Delete a tour
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tours.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete tour",
      details: error.toString(),
    });
  }
};
