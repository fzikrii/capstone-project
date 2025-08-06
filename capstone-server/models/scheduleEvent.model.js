import mongoose from "mongoose";

const scheduleEventSchema = new mongoose.Schema({
    // Store the title directly for quick display
    title: { type: String, required: true },
    
    // Link to the original task for reference
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, unique: true },
    
    // The user this calendar event belongs to
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // The date the event appears on the calendar (this is what will be updated on drag-and-drop)
    date: { type: Date, required: true },
    
    // A color for display purposes on the calendar
    color: { type: String, default: '#22c55e' } // Default to green for "Done" tasks

}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const ScheduleEvent = mongoose.model("ScheduleEvent", scheduleEventSchema);

export default ScheduleEvent;