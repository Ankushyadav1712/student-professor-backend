import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
     required: true,
      unique: true },
  password: {
     type: String,
      required: true },
  role: {
     type: String, 
     enum: ["student", "professor"],
      required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
