import express from "express";
// Remove the passport import since we're using the global middleware
// import passport from "passport";
import User from "../models/users.model.js";

const router = express.Router();

// GET /api/profile - Get user profile with additional fields
// Remove passport.authenticate since the global middleware already handles it
router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // The user object is already attached to req.user by your main middleware
    const user = req.user;
    
    res.json({
      _id: user._id,
      // Frontend uses 'name', so let's send 'username' as 'name' for consistency
      name: user.username,
      username: user.username,
      email: user.email,
      title: user.title,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      workStartDate: user.workStartDate,
    });
  } catch (err) {
    console.error("Error in GET /api/profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile - Update user profile
// Remove passport.authenticate since the global middleware already handles it
router.put("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Destructure all possible fields from the request body
    const { name, title, avatarUrl, bannerUrl, workStartDate } = req.body;

    // Check if the new username ('name') is already taken by another user
    if (name && name !== req.user.username) {
      const existingUser = await User.findOne({ username: name });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username is already taken." });
      }
    }

    // Build the update object with only the provided fields
    const updateFields = {};
    if (name !== undefined) updateFields.username = name; // Map frontend 'name' to backend 'username'
    if (title !== undefined) updateFields.title = title;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (bannerUrl !== undefined) updateFields.bannerUrl = bannerUrl;
    if (workStartDate !== undefined)
      updateFields.workStartDate = workStartDate;

    // Find the user and update their details
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true } // 'new: true' returns the updated document
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a consistent user object
    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.username, // Send back 'name'
        username: updatedUser.username,
        email: updatedUser.email,
        title: updatedUser.title,
        avatarUrl: updatedUser.avatarUrl,
        bannerUrl: updatedUser.bannerUrl,
        workStartDate: updatedUser.workStartDate,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    // Handle potential validation errors from Mongoose
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;