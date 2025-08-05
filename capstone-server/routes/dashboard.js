import { Router } from "express";
import Project from "../models/projects.model.js";
import Task from "../models/tasks.model.js";
import User from "../models/users.model.js";

const router = Router();

// GET /dashboard/:userId
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        // Example: count completed tasks
        const tasksCompleted = await Task.countDocuments({ assignedTo: userId, status: "Done" });

        // Example: count active projects
        const activeProjects = await Project.countDocuments({ team: userId, status: { $in: ["Ongoing", "ToDo"] } });

        // Example: count missed deadlines
        const missedDeadlines = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Done" },
            endDate: { $lt: new Date() }
        });

        // Example: banners earned (dummy, replace with your logic)
        const bannersEarned = 5;

        // Achievements (dummy data, replace with your logic)
        const achievements = [
            {
                icon: "star",
                gradient: "from-violet-500 to-fuchsia-500",
                title: 'New Banner Earned: "Collaborator King"!',
                description: "You became the most active contributor on the 'Website Redesign' project."
            },
            {
                icon: "file-text",
                gradient: "from-sky-400 to-blue-500",
                title: 'Certificate Available: "Top Contributor"',
                description: "Congratulations! You were the top contributor on the 'Q3 Marketing Campaign' project."
            }
        ];

        // Chart data (dummy, replace with your logic)
        const productivityData = {}; // fill with your chart data
        const taskStatusData = {}; // fill with your chart data

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
        res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
    }
});

export default router;