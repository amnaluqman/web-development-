const mongoose = require('mongoose');

// Blueprint for every user account in our database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,           // No two users can share an email
    lowercase: true,        // Auto-convert to lowercase (so AMNA@x.com == amna@x.com)
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],   // Only these 2 roles allowed
    default: 'customer'             // New signups are always customers by default
  }
}, {
  timestamps: true   // Auto-adds "createdAt" and "updatedAt"
});

// Export the model
module.exports = mongoose.model('User', userSchema);