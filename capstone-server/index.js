import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRouter from "./routes/auth.js";
import projectRouter from "./routes/project.js";
import dashboardRouter from "./routes/dashboard.js";
import bountyRouter from "./routes/bounty.js";
import User from "./models/users.model.js";
import scheduleRouter from "./routes/schedule.js";
import chatRouter from "./routes/gemini.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// New: Tell Express to serve files from the 'public' directory
app.use(express.static("public"));

// JWT Passport Middleware (unchanged)
app.use((req, res, next) => {
  console.log("Auth Middleware - Path:", req.path);

  // Skip authentication for public routes and the new image upload route
  if (
    req.path.startsWith("/auth/login") ||
    req.path.startsWith("/auth/signup") ||
    req.path.startsWith("/auth/google")
    // req.path.startsWith("/api/profile/upload-image") // CORRECTED PATH
  ) {
    return next();
  }

  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "No authentication token found" });
  }

  req.headers.authorization = `Bearer ${token}`;

  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      console.error("Passport auth error:", err);
      return res
        .status(401)
        .json({ message: "Authentication error", details: err.message });
    }
    if (!user) {
      console.log("Authentication failed:", info);
      return res
        .status(401)
        .json({ message: info?.message || "Invalid or expired token" });
    }

    try {
      const freshUser = await User.findById(user._id).select("-password");
      if (!freshUser) {
        console.log("User not found in database:", user._id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("User authenticated:", freshUser.email);
      req.user = freshUser;
      next();
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ message: "Server error" });
    }
  })(req, res, next);
});

// Connect to MongoDB (unchanged)
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/auth", authRouter);
app.use("/project", projectRouter);
app.use("/dashboard", dashboardRouter);
app.use("/bounty", bountyRouter);
app.use("/schedule", scheduleRouter);
app.use("/api/gemini", chatRouter);
app.use("/api/profile", profileRoutes);

// Root endpoint (unchanged)
app.get("/", (req, res) => {
  res.send({ message: "Capstone server started" });
});

// Error handler (unchanged)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start server (unchanged)
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));