import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    console.log('Signup attempt:', {
      email,
      username,
      passwordLength: password.length
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', {
      originalLength: password.length,
      hashedLength: hashedPassword.length
    });

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log('User created:', {
      email: newUser.email,
      username: newUser.username,
      hasPassword: !!newUser.password,
      passwordLength: newUser.password.length
    });

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get("/signup", (req, res) => {
  res.send("Signup route is working!");
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    console.log('=== Login Attempt Details ===');
    console.log('Email:', email);
    console.log('Password received:', password);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    console.log('Found user:', {
      email: user.email,
      username: user.username,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    console.log('Comparing passwords:');
    console.log('Raw password:', password);
    console.log('Stored hash:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return success with user data and token
    res.status(200).json({
      message: 'Login successful.',
      user: { _id: user._id, displayName: user.username },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;