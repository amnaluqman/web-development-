const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// ===== ROUTES =====

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Products page (public catalog)
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 999999;

    let filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    filter.price = { $gte: minPrice, $lte: maxPrice };

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter).skip(skip).limit(limit);

    res.render('products', {
      products, currentPage: page, totalPages, totalProducts,
      search, category,
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || ''
    });
  } catch (err) {
    console.log('❌ Error:', err);
    res.status(500).send('Server Error');
  }
});

// ===== ADMIN ROUTES =====

// ADMIN DASHBOARD
app.get('/admin', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('admin/dashboard', { products });
  } catch (err) {
    console.log('❌ Admin Error:', err);
    res.status(500).send('Server Error');
  }
});

// SHOW ADD FORM
app.get('/admin/add', (req, res) => {
  res.render('admin/add');
});

// HANDLE ADD PRODUCT
app.post('/admin/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : '/product1.webp';
    
    const newProduct = new Product({
      name,
      price,
      category,
      rating: rating || 0,
      stock,
      image: imagePath
    });
    
    await newProduct.save();
    console.log('✅ Product added:', name);
    res.redirect('/admin');
  } catch (err) {
    console.log('❌ Add Error:', err);
    res.status(500).send('Error adding product: ' + err.message);
  }
});

// SHOW EDIT FORM
app.get('/admin/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('admin/edit', { product });
  } catch (err) {
    console.log('❌ Edit Load Error:', err);
    res.status(500).send('Server Error');
  }
});

// HANDLE EDIT PRODUCT
app.post('/admin/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    const updateData = { name, price, category, rating, stock };
    
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    
    await Product.findByIdAndUpdate(req.params.id, updateData);
    console.log('✅ Product updated:', name);
    res.redirect('/admin');
  } catch (err) {
    console.log('❌ Update Error:', err);
    res.status(500).send('Error updating product');
  }
});

// HANDLE DELETE
app.post('/admin/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    console.log('✅ Product deleted');
    res.redirect('/admin');
  } catch (err) {
    console.log('❌ Delete Error:', err);
    res.status(500).send('Error deleting product');
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});