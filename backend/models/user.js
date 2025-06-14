import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: String,
  password: String,
  tour: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tours" }],

  toursCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tours" }],
});

const User = mongoose.model("User", userSchema);
export default User;
