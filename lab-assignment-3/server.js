const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

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

// ===== SESSION SETUP =====
app.use(session({
  secret: 'khaadi-super-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/khaadi-store',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ===== FLASH MESSAGES SETUP =====
app.use(flash());

// ===== MAKE USER & FLASH MESSAGES AVAILABLE IN ALL VIEWS =====
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// ===== AUTHORIZATION MIDDLEWARE =====

// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/login');
}

// Check if user is an admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Access Denied — Admins only');
  res.redirect('/');
}

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

// ===== PUBLIC ROUTES =====

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

// ===== AUTHENTICATION ROUTES =====

// SHOW REGISTER FORM
app.get('/register', (req, res) => {
  res.render('register');
});

// HANDLE REGISTER
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation: password must be 6+ characters
    if (password.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters long');
      return res.redirect('/register');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error_msg', 'An account with this email already exists');
      return res.redirect('/register');
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();
    console.log('✅ New user registered:', email);

    req.flash('success_msg', 'Account created successfully! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.log('❌ Register Error:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
});

// SHOW LOGIN FORM
app.get('/login', (req, res) => {
  res.render('login');
});

// HANDLE LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Compare entered password with hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Save user info in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('✅ User logged in:', user.email, '| Role:', user.role);
    req.flash('success_msg', `Welcome back, ${user.name}!`);

    // Redirect admins to admin panel, customers to home
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');
  } catch (err) {
    console.log('❌ Login Error:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
});

// HANDLE LOGOUT
app.get('/logout', (req, res) => {
  const userName = req.session.user ? req.session.user.name : 'User';
  
  req.session.destroy((err) => {
    if (err) {
      console.log('❌ Logout Error:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    console.log('✅ User logged out:', userName);
    res.redirect('/login');
  });
});

// ===== ADMIN ROUTES (PROTECTED BY isAdmin MIDDLEWARE) =====

// ADMIN DASHBOARD
app.get('/admin', isAdmin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('admin/dashboard', { products });
  } catch (err) {
    console.log('❌ Admin Error:', err);
    res.status(500).send('Server Error');
  }
});

// SHOW ADD FORM
app.get('/admin/add', isAdmin, (req, res) => {
  res.render('admin/add');
});

// HANDLE ADD PRODUCT
app.post('/admin/add', isAdmin, upload.single('image'), async (req, res) => {
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
app.get('/admin/edit/:id', isAdmin, async (req, res) => {
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
app.post('/admin/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
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
app.post('/admin/delete/:id', isAdmin, async (req, res) => {
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