const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../../../models/User');

const router = express.Router();

// ===================================================
// POST /api/v1/auth/login
// Authenticate user and return a JWT token
// ===================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Basic input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Step 2: Find user in database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Step 3: Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Step 4: Build the JWT payload (contains user_id and role)
    const payload = {
      user_id: user._id,
      role: user.role
    };

    // Step 5: Sign and create the JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    console.log('✅ JWT issued for:', user.email, '| Role:', user.role);

    // Step 6: Send the token back to the client
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log('❌ API Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;