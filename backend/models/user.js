import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
export default User;
