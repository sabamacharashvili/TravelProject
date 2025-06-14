import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation check
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Fill all fields!" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      name: username,
      email,
      password: hashedPassword,
      tour: [],  
      toursCreated: [] 
    });

    
    await user.save();

    res.status(201).json({ success: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation check
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Fill all fields" });
    }

    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Email is incorrect" });
    }

    // Check if the password is correct
    const isPasswordValid =  bcrypt.compare(password, existingUser.password); // Await bcrypt comparison
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Password is incorrect" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.status(200).json({ success: true, message: "Successfully authorized", token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add a tour to a user
export const addTourToUser = async (req, res) => {
  try {
    const { userId, tourId, isCreated } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    if (isCreated) {
      user.toursCreated.push(tourId); // Add to 'toursCreated'
    } else {
      user.tour.push(tourId); // Add to 'tour' (for tours user is involved in)
    }

    
    await user.save();

    res.status(200).json({ success: true, message: "Tour added to user", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
