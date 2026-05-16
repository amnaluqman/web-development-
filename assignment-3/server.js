const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

// ===== CONNECT TO MONGODB =====
mongoose.connect('mongodb://localhost:27017/khaadi-store')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ===== MIDDLEWARE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTES =====

// Home page (Assignment 2 — your existing Khaadi landing page)
app.get('/', (req, res) => {
  res.render('index');
});

// Products page (Assignment 3 — dynamic catalog with pagination, search, filter)
app.get('/products', async (req, res) => {
  try {
    // ===== 1. READ QUERY PARAMETERS =====
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 999999;

    // ===== 2. BUILD THE FILTER QUERY =====
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    filter.price = { $gte: minPrice, $lte: maxPrice };

    // ===== 3. FETCH PRODUCTS FROM DATABASE =====
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter).skip(skip).limit(limit);

    // ===== 4. SEND DATA TO EJS TEMPLATE =====
    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      search,
      category,
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || ''
    });

  } catch (err) {
    console.log('❌ Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});