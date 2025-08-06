import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport'; // Import Passport
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

// GET /auth/me - Get authenticated user data
router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // By the time we get here, passport has already authenticated the user
    // and attached them to req.user. We just need to send the data back.
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    });
  } catch (err) {
    console.error('Error in /auth/me:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /auth/login
router.post('/login', async (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Missing credentials:', { email: !!email, password: !!password });
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
    
    if (!user.password) {
        return res.status(401).json({ message: 'Please log in with Google.' });
    }

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

// POST /auth/logout - Logout user
router.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Error during logout' });
  }
});


// === GOOGLE OAUTH ROUTES ===

// The route to initiate the Google authentication process
// When a user hits this endpoint, they are redirected to Google
router.get('/google', passport.authenticate('google', {
    scope: 'profile email'  // We ask for the user's profile and email
}));


// The callback route that Google redirects to after successful authentication
router.get('/google/callback',
    // First, Passport authenticates the user via Google
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login', // Redirect on failure
        session: false // We are using JWTs, not sessions
    }),
    // If authentication is successful, this function is executed
    (req, res) => {
        // req.user is now available, thanks to the passport-google-oauth20 strategy
        // We will now create a JWT for this user
        const token = jwt.sign({
                userId: req.user._id,
                email: req.user.email
            },
            process.env.JWT_SECRET_KEY, {
                expiresIn: '24h'
            }
        );

        // Set the JWT in an HTTP-Only cookie for security
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
            path: '/'
        });

        // Redirect the user to your frontend application's dashboard
        res.redirect('http://localhost:5173/dashboard');
    }
);


export default router;
