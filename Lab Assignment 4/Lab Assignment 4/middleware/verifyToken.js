const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Authentication Middleware
// Extracts and verifies the Bearer token from the Authorization header
function verifyToken(req, res, next) {
  // Step 1: Extract the Authorization header
  const authHeader = req.headers['authorization'];

  // Step 2: Check if header exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided or invalid format. Use: Bearer <token>'
    });
  }

  // Step 3: Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Token is missing.'
    });
  }

  try {
    // Step 4: Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Append decoded user info to req object
    // Now any route after this middleware can access req.user
    req.user = decoded;

    // Step 6: Move on to the actual route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Invalid or expired token.',
      error: err.message
    });
  }
}

// Optional: Check if the authenticated user is an admin
function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden. Admin access required.'
  });
}

module.exports = { verifyToken, verifyAdmin };