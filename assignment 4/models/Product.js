const mongoose = require('mongoose');

// This is the "blueprint" for every product in our database
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,        // Every product MUST have a name
    trim: true             // Removes extra spaces
  },
  price: {
    type: Number,
    required: true,
    min: 0                 // Price cannot be negative
  },
  category: {
    type: String,
    required: true,
    enum: ['Kurtas', 'Sarees', 'Accessories']  // Only these 3 categories allowed
  },
  rating: {
    type: Number,
    default: 0,            // If not given, default rating is 0
    min: 0,
    max: 5                 // Rating between 0 and 5
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: '/product1.webp'  // Default image if none provided
  }
}, { 
  timestamps: true  // Auto-adds "createdAt" and "updatedAt" fields
});

// Export the model so other files can use it
module.exports = mongoose.model('Product', productSchema);