import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import User from "../models/users.model.js";

const router = express.Router();

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.resolve(__dirname, "..", "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    console.log("Created uploads directory:", uploadDirectory);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        // Create unique filename: fieldname-timestamp-randomnumber.ext
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        cb(null, filename);
    },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

// GET /api/profile - Get user profile
router.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("Fetching profile for user:", req.user._id);

        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            _id: user._id,
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

// PUT /api/profile - Update user profile with file uploads
router.put("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("Updating profile for user:", req.user._id);
        console.log("Request body:", req.body);

        // Destructure all fields from the body, including the new URLs
        const { name, title, workStartDate, avatarUrl, bannerUrl } = req.body;

        const updateFields = {};

        // Directly use the fields from the request body
        if (name && name.trim()) updateFields.username = name.trim();
        if (title !== undefined) updateFields.title = title;
        if (workStartDate) updateFields.workStartDate = new Date(workStartDate);
        if (avatarUrl) updateFields.avatarUrl = avatarUrl; // Save the new avatar URL
        if (bannerUrl) updateFields.bannerUrl = bannerUrl; // Save the new banner URL

        // ... (keep your existing username uniqueness check)

        console.log("Update fields:", updateFields);

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // ... (keep the rest of your success response)
        res.json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.username,
                username: updatedUser.username,
                email: updatedUser.email,
                title: updatedUser.title,
                avatarUrl: updatedUser.avatarUrl,
                bannerUrl: updatedUser.bannerUrl,
                workStartDate: updatedUser.workStartDate,
            },
        });

    } catch (err) {
        // ... (keep your existing error handling)
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// NEW ROUTE: Handles immediate upload of one image
// It should be protected to ensure only logged-in users can upload.
router.post(
    "/upload-image",
    upload.single("image"), // Expect a single file in a field named 'image'
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No image file provided." });
            }

            // Construct the public URL of the uploaded file
            const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            console.log("Image uploaded, URL:", imageUrl);

            // Respond with the URL
            res.status(200).json({
                message: "Image uploaded successfully",
                url: imageUrl,
            });
        } catch (err) {
            console.error("Error uploading image:", err);
            res.status(500).json({ message: "Server error during image upload" });
        }
    }
);


// Helper function to delete old image files (optional cleanup)
const deleteOldImage = (imageUrl) => {
    try {
        if (imageUrl && imageUrl.includes('/uploads/')) {
            const filename = path.basename(imageUrl);
            const filepath = path.join(uploadDirectory, filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log("Deleted old image:", filename);
            }
        }
    } catch (err) {
        console.error("Error deleting old image:", err);
    }
};

export default router;