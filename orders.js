const express = require('express');
const Order = require('../../../models/Order');
const Product = require('../../../models/Product');
const { verifyToken } = require('../../../middleware/verifyToken');

const router = express.Router();

// ===================================================
// POST /api/v1/orders
// PROTECTED: Requires valid JWT
// Creates a new order for the logged-in user
// ===================================================
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { products } = req.body;

    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required and cannot be empty'
      });
    }

    // Calculate total and validate products
    let total = 0;
    for (const item of products) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product ID and quantity'
        });
      }
      const productDoc = await Product.findById(item.product);
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      total += productDoc.price * item.quantity;
    }

    // Create order
    const newOrder = new Order({
      user: userId,
      products: products,
      total: total,
      status: 'pending'
    });

    await newOrder.save();

    console.log('✅ Order created for user:', userId);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (err) {
    console.log('❌ Order API Error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;