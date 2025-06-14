import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


creator :{ type: mongoose.Schema.Types.ObjectId, ref: "User", }

});

export default mongoose.model("Tours", tourSchema);
