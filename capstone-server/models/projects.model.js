// models/projects.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['Planning', 'Ongoing', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Link to tasks
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", projectSchema);