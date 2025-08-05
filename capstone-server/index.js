import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import userRouter from "./routes/user.js";
import projectRouter from "./routes/project.js";

dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow frontend origin
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow common headers
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// JWT Passport Middleware
app.use((req, res, next) => {
  if (!req.cookies["token"]) {
    return next();
  }
  passport.authenticate("jwt", { session: false })(req, res, next);
});

// Connect to MongoDB
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
app.use("/auth", userRouter); // <-- your login/signup
app.use("/project", projectRouter); // <-- your project management

// Root endpoint
app.get("/", (req, res) => {
  res.send({ message: "Capstone server started" });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));