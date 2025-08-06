import express from 'express';
import ScheduleEvent from '../models/scheduleEvent.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /schedule - Fetches all calendar events for the logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const events = await ScheduleEvent.find({ user: userId })
            .populate('task'); // <-- ADD THIS LINE to include full task details
        res.json(events);
    } catch (err) {
        console.error("Error fetching schedule events:", err);
        res.status(500).json({ message: 'Failed to fetch schedule events', error: err.message });
    }
});

// PUT /schedule/:eventId - Updates a calendar event's date (for drag-and-drop)
router.put('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { date } = req.body; // This will be in format "2025-08-10"

        if (!date) {
            return res.status(400).json({ message: 'A new date is required.' });
        }

        // Parse the date and preserve the original time if it exists
        const currentEvent = await ScheduleEvent.findById(eventId);
        if (!currentEvent) {
            return res.status(404).json({ message: 'Schedule event not found.' });
        }

        // Create new date while preserving the original time
        const originalDate = new Date(currentEvent.date);
        const newDate = new Date(date);
        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds());

        const updatedEvent = await ScheduleEvent.findByIdAndUpdate(
            eventId,
            { date: newDate },
            { new: true }
        ).populate('task'); // Add populate if you need task details

        res.json(updatedEvent);
    } catch (err) {
        console.error("Error updating schedule event:", err);
        res.status(500).json({ message: 'Failed to update schedule event', error: err.message });
    }
});

export default router;