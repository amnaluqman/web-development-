const express = require('express');
const Product = require('../../../models/Product');

const router = express.Router();

// ===================================================
// GET /api/v1/products
// Returns a paginated, filtered list of products
// Query params: page, limit, search, category, minPrice, maxPrice
// ===================================================
router.get('/', async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // Filters
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 999999;

    // Build the filter object
    let filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    filter.price = { $gte: minPrice, $lte: maxPrice };

    // Query the database
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter).skip(skip).limit(limit);

    // Send JSON response
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        limit: limit
      },
      filters: {
        search: search,
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice
      },
      data: products
    });
  } catch (err) {
    console.log('❌ API Products Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

// ===================================================
// GET /api/v1/products/:id
// Returns details for a single product by ID
// ===================================================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product
    });
  } catch (err) {
    console.log('❌ API Single Product Error:', err);
    // Handle invalid ObjectId format
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