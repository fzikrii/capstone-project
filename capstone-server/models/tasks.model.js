import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = on board
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who posted
});

export default mongoose.model("Task", taskSchema);