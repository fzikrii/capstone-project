// routes/project.js
import express from 'express';
import Project from '../models/projects.model.js';
import Task from '../models/tasks.model.js';
import mongoose from 'mongoose';
import ScheduleEvent from '../models/scheduleEvent.model.js';

const router = express.Router();

// --- Project Endpoints ---

// GET /project - Get all projects for the logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({
            $or: [{ owner: userId }, { members: userId }]
        })
        .populate('owner', 'username') // Populate owner with their username
        .populate('members', 'username') // Populate members with their usernames
        .populate('tasks') // Populate the full task objects
        .sort({ createdAt: -1 });

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
    }
});

// POST /project - Create a new project
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id] // The creator is automatically a member
        });
        await newProject.save();

        // Populate details before sending back to frontend
        await newProject.populate('owner members', 'username');
        await newProject.populate('tasks');

        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
});


// --- Task Endpoints ---

// POST /project/:projectId/tasks - Create a new task in a project
router.post('/:projectId/tasks', async (req, res) => {
    try {
        const { title, deadline } = req.body;
        const { projectId } = req.params;

        const newTask = new Task({
            title,
            deadline,
            project: projectId,
            createdBy: req.user._id
        });
        await newTask.save();

        // Add the new task's ID to the parent project's tasks array
        await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task', error: err.message });
    }
});

// PUT /project/tasks/:taskId - Update a task (e.g., for drag-and-drop)
router.put('/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, status } = req.body; // Allow updating title and status

        const taskToUpdate = await Task.findById(taskId);
        if (!taskToUpdate) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        const originalStatus = taskToUpdate.status;
        const updateData = {};
        if (title) updateData.title = title;
        if (status) updateData.status = status;

        // --- SCHEDULE CONNECTION LOGIC ---

        // Scenario 1: Task is marked as "Done"
        if (status === 'Done' && originalStatus !== 'Done') {
            const completionDate = new Date();
            updateData.completedAt = completionDate;

            // Use findOneAndUpdate with 'upsert' to create or update the event in one step
            await ScheduleEvent.findOneAndUpdate(
                { task: taskId }, // Find event by task ID
                {
                    title: title || taskToUpdate.title,
                    user: taskToUpdate.assignedTo || req.user._id,
                    date: completionDate,
                    color: '#22c55e'
                },
                { upsert: true, new: true } // upsert: if it doesn't exist, create it.
            );
        
        // Scenario 2: Task status is changed FROM "Done" to something else
        } else if (originalStatus === 'Done' && status && status !== 'Done') {
            updateData.completedAt = null; // Clear the completion date
            // The task is no longer 'Done', so remove it from the schedule
            await ScheduleEvent.findOneAndDelete({ task: taskId });

        // Scenario 3: Task is already "Done" and its title is being updated
        } else if (status === 'Done' && title && title !== taskToUpdate.title) {
            await ScheduleEvent.findOneAndUpdate(
                { task: taskId },
                { title: title }
            );
        }
        
        // --- END SCHEDULE LOGIC ---

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
        res.json(updatedTask);

    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: 'Failed to update task', error: err.message });
    }
});

router.delete('/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;

        // Verify the task exists before proceeding
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // --- SCHEDULE CONNECTION LOGIC ---
        // Step 1: Delete the corresponding schedule event, if it exists
        await ScheduleEvent.findOneAndDelete({ task: taskId });
        // --- END SCHEDULE LOGIC ---
        
        // Step 2: Remove the task's ID from the parent project's tasks array
        await Project.updateOne({ _id: task.project }, { $pull: { tasks: taskId } });
        
        // Step 3: Delete the task itself
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: 'Task and associated schedule event deleted successfully.' });

    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Get the userId from the URL parameters
        
        // Find all projects where the 'user' or 'members' field matches the userId
        const projects = await Project.find({
            // Adjust this query based on your Project schema.
            // This example assumes projects are linked to a single user.
            user: userId 
        }).sort({ createdAt: -1 }); // Sort by newest first

        if (!projects) {
            return res.status(404).json({ message: 'No projects found for this user.' });
        }

        res.json(projects);
    } catch (err) {
        console.error("Error fetching projects for user:", err);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
});

export default router;