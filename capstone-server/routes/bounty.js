// routes/bounty.js
import express from "express";
import Task from "../models/tasks.model.js";
import User from "../models/users.model.js";
const router = express.Router();

// GET /bounty - Get all unassigned tasks that are STUCK
router.get("/", async (req, res) => {
    try {
        const bounties = await Task.find({ 
            assignedTo: null,       // Condition 1: Task must be unassigned
            status: 'Stuck'         // CORRECTED: Status must BE 'Stuck'
        })
            .populate('project', 'name')
            .sort({ deadline: 1 });
            
        res.json(bounties);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bounties.", error: err.message });
    }
});

// POST /bounty/accept/:taskId - This endpoint may need reconsideration.
// For now, it will only allow "claiming" a bounty that is stuck.
router.post("/accept/:taskId", async (req, res) => {
    const userId = req.user._id;
    const { taskId } = req.params;

    try {
        const task = await Task.findOne({ _id: taskId, assignedTo: null, status: 'Stuck' });
        if (!task) {
            return res.status(404).json({ message: "Bounty not found, already taken, or is not stuck." });
        }
        
        // When claiming a stuck task, we should probably move it back to 'ToDo'
        task.assignedTo = userId;
        task.status = 'ToDo'; // Set status back to ToDo for the user
        await task.save();

        await User.findByIdAndUpdate(userId, { $addToSet: { tasks: task._id } });

        res.json({ message: "Bounty claimed successfully and moved to 'ToDo'.", task });
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