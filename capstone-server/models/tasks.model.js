// models/tasks.model.js
import mongoose from "mongoose";

// Define a schema for the tags
const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true }
}, { _id: false }); // No separate ID for tags

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // No longer required for bounties
  tags: [tagSchema], // CHANGE: Added tags field to match the frontend
  status: {
    type: String,
    enum: ['ToDo', 'Ongoing', 'Done', 'Stuck'],
    default: 'ToDo'
  },
  deadline: Date, // CHANGE: Use 'deadline' to be consistent
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.model("Task", taskSchema);