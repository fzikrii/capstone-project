import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = Router();

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword, // Correctly assign the hashed password to the 'password' field
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Failed to create user.", error: error.message });
  }
});

// POST /login 
router.post(
  "/login",
  passport.authenticate("local", { failureMessage: true, session: false }),
  (req, res) => {
    if (req.user) {
      const { _id, username } = req.user;
      const payload = { _id };
      // Sign the token with an expiration for better security
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
      res.cookie("token", token, { httpOnly: true });
      res.json({ message: "Login successful!", username: username });
    } else {
      res.status(401).json({ message: "Authentication failed." });
    }
  }
);

// POST /logout - User logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout." });
    }
    // Session destruction is often not needed with token-based auth, but good for cleanup
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid"); // Clear session cookie if used
        res.clearCookie("token"); // Clear JWT token cookie
        res.json({ message: "Logout successful!" });
      });
    } else {
      res.clearCookie("token");
      res.json({ message: "Logout successful!" });
    }
  });
});

// GET /me - Get details of current user
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  }
);

//email auth

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dongwon1103@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: "dongwon1103@gmail.com",
      to,
      subject,
      text,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (req.user) {
      const payload = { _id: req.user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
      res.cookie("token", token, { httpOnly: true });
      res.json({ message: "Google login successful!" });
    } else {
      res.status(401).json({ message: "Google authentication failed." });
    }
  }
);

export default router;