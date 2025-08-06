// --- Import Dependencies ---
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Used to generate unique IDs

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies


// Data for the Bounty Board
let bounties = [
    { id: '1', title: 'Real-time Chat Application', description: 'Build a real-time chat app using WebSockets and React.', tags: [{ name: 'Socket.io', color: 'bg-sky-100 text-sky-700' }, { name: 'WebSocket', color: 'bg-blue-100 text-blue-700' }], reward: 350, dueDate: '2025-08-25' },
    { id: '2', title: 'Build Responsive Landing Page', description: 'Create a mobile-friendly landing page using React and Tailwind CSS.', tags: [{ name: 'React', color: 'bg-cyan-100 text-cyan-700' }, { name: 'Tailwind', color: 'bg-teal-100 text-teal-700' }], reward: 300, dueDate: '2025-08-10' },
    { id: '3', title: 'E-commerce Product Page', description: 'Develop a product page with dynamic content and user reviews.', tags: [{ name: 'React', color: 'bg-cyan-100 text-cyan-700' }, { name: 'API', color: 'bg-purple-100 text-purple-700' }], reward: 280, dueDate: '2025-08-20' },
];

// Data for the My Projects board
let tasks = {
    ToDo: [
        { id: 'task-1', title: 'Design landing page mockups', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'High', dueDate: '2025-08-05', assignees: ['https://placehold.co/40x40/a7f3d0/14532d?text=AS'] },
        { id: 'task-2', title: 'Setup user authentication flow', project: 'Mobile App', projectColor: 'bg-purple-100 text-purple-700', priority: 'High', dueDate: '2025-08-08', assignees: ['https://placehold.co/40x40/c7d2fe/3730a3?text=DM'] },
    ],
    Ongoing: [
        { id: 'task-3', title: 'Develop homepage component', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Medium', dueDate: '2025-08-03', assignees: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=CJ'] },
    ],
    Done: [
        { id: 'task-4', title: 'Finalize color palette', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Low', dueDate: '2025-07-28', assignees: ['https://placehold.co/40x40/fecaca/991b1b?text=BD'] },
    ],
    Stuck: []
};


// --- API Routes for Bounties ---

// GET /api/bounties - Retrieve all bounties
app.get('/api/bounties', (req, res) => {
    console.log('GET /api/bounties - Sending all bounties');
    res.status(200).json(bounties);
});

// POST /api/bounties - Create a new bounty
app.post('/api/bounties', (req, res) => {
    const { title, description, tags, reward, dueDate } = req.body;
    if (!title || !description || !reward || !dueDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const newBounty = {
        id: crypto.randomUUID(),
        title, description, tags: tags || [], reward, dueDate,
        createdAt: new Date().toISOString()
    };
    bounties.push(newBounty);
    console.log('POST /api/bounties - Created new bounty:', newBounty.id);
    res.status(201).json(newBounty);
});


// --- API Routes for Tasks ---

// GET /api/tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
    console.log('GET /api/tasks - Sending all tasks');
    res.status(200).json(tasks);
});

// PATCH /api/tasks/:taskId/status - Update a task's status (for drag-and-drop)
app.patch('/api/tasks/:taskId/status', (req, res) => {
    const { taskId } = req.params;
    const { newStatus } = req.body;

    if (!newStatus || !tasks[newStatus]) {
        return res.status(400).json({ message: 'Invalid new status provided.' });
    }

    let foundTask;
    let sourceStatus;

    // Find the task and its original status column
    for (const status in tasks) {
        const task = tasks[status].find(t => t.id === taskId);
        if (task) {
            foundTask = task;
            sourceStatus = status;
            break;
        }
    }

    if (!foundTask) {
        return res.status(404).json({ message: 'Task not found.' });
    }
    
    // Move the task if the status is different
    if (sourceStatus !== newStatus) {
        // Remove from the old status array
        tasks[sourceStatus] = tasks[sourceStatus].filter(t => t.id !== taskId);
        // Add to the new status array
        tasks[newStatus].push(foundTask);
    }
    
    console.log(`PATCH /api/tasks - Moved task ${taskId} from ${sourceStatus} to ${newStatus}`);
    res.status(200).json(foundTask);
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});