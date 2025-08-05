import express from "express";
import Project from "../models/projects.model.js";
const router = express.Router();

// Get all projects for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new project
router.post("/", async (req, res) => {
  const { name, description, owner, members } = req.body;
  try {
    const project = await Project.create({ name, description, owner, members });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Optionally: Get a single project
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;