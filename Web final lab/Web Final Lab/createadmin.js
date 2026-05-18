const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/khaadi-store')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ Error:', err));

async function setupUsers() {
  try {
    // 1. Update test user role to "customer"
    await User.updateOne(
      { email: 'test@test.com' },   // ← Change this to your test user's email
      { $set: { role: 'customer' } }
    );
    console.log('✅ Test user role changed to customer');

    // 2. Hash admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // 3. Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@khaadi.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    console.log('📧 Email: admin@khaadi.com');
    console.log('🔑 Password: admin123');

    mongoose.connection.close();
  } catch (err) {
    console.log('❌ Error:', err.message);
    mongoose.connection.close();
  }
}

setupUsers();