const express = require('express');
const User = require('../../../models/User');
const { verifyToken } = require('../../../middleware/verifyToken');

const router = express.Router();

// ===================================================
// GET /api/v1/user/profile
// PROTECTED: Requires valid JWT in Authorization header
// Returns the authenticated user's profile information
// ===================================================
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // req.user was attached by verifyToken middleware
    // It contains: { user_id, role, iat, exp }
    const userId = req.user.user_id;

    // Fetch full user details from database (excluding password)
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.log('❌ Profile API Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;