import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields!" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This mail is already registered",
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res
      .status(201)
      .json({ success: true, message: "Succesfully registered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Mail is incorect" });
    }

    
    const isPasswordValid =  bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorect" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ success: true, message: "Succesfully authorised", token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
