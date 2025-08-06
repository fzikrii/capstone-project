// routes/dashboard.js

import { Router } from "express";
import Project from "../models/projects.model.js";
import Task from "../models/tasks.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Authentication required." });
    }
    const userId = new mongoose.Types.ObjectId(req.user._id);

    try {
        // --- Recap Cards ---
        // These queries now work correctly with the updated schemas.
        const tasksCompleted = await Task.countDocuments({ assignedTo: userId, status: "Done" });

        const activeProjects = await Project.countDocuments({
            $or: [{ owner: userId }, { members: userId }], // FIX: Changed 'team' to 'members'
            status: { $in: ["Planning", "Ongoing"] }        // FIX: Using the new project status field
        });

        const missedDeadlines = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Done" },                         // FIX: Uses the new task status field
            deadline: { $lt: new Date() }                    // FIX: Changed 'dueDate' to 'deadline'
        });

        // Banners/achievements can be made dynamic later based on user actions
        const bannersEarned = 5; 
        const achievements = [ /* ...achievements data... */ ];

        // --- Chart Data: Task Status ---
        // This query now works correctly.
        const taskStatusData = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // --- Chart Data: Productivity ---
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // This query now works correctly with the 'completedAt' and 'status' fields.
        const completedTasksByDay = await Task.aggregate([
            {
                $match: {
                    assignedTo: userId,
                    status: "Done",
                    completedAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // This processing logic remains the same and is still excellent.
        const productivityDataMap = new Map(
            completedTasksByDay.map(item => [item._id, item.count])
        );

        const productivityData = [];
        for (let i = 6; i >= 0; i--) { // Loop backwards to build in chronological order
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            productivityData.push({
                date: dateString,
                count: productivityDataMap.get(dateString) || 0
            });
        }

        // --- Final JSON Response ---
        res.json({
            recapCards: [
                { title: 'Tasks Completed', value: tasksCompleted, icon: 'check-circle', color: 'sky' },
                { title: 'Active Projects', value: activeProjects, icon: 'loader', color: 'amber' },
                { title: 'Missed Deadlines', value: missedDeadlines, icon: 'alert-triangle', color: 'rose' },
                { title: 'Banners Earned', value: bannersEarned, icon: 'award', color: 'emerald' },
            ],
            achievements,
            productivityData,
            taskStatusData
        });
    } catch (err) {
        console.error("Dashboard data fetch error:", err);
        res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
    }
});

export default router;