import express from "express";
import Task from "../models/task.model.js";
import User from "../models/users.model.js";
const router = express.Router();

// Get all unassigned tasks (bounties)
router.get("/", async (req, res) => {
  const bounties = await Task.find({ assignedTo: null });
  res.json(bounties);
});

// Accept a bounty (assign to user)
router.post("/accept/:taskId", async (req, res) => {
  const { userId } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, assignedTo: null });
    if (!task) {
      return res.status(404).json({ message: "Task not found or already taken." });
    }
    task.assignedTo = userId;
    await task.save();

    // Add the task to the user's tasks array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tasks: task._id } }, // $addToSet prevents duplicates
      { new: true }
    );

    res.json({ message: "Task assigned to user.", task });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// Get tasks assigned to a user
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("tasks");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

export default router;