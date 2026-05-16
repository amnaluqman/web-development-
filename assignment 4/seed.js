const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/khaadi-store')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ Connection error:', err));

// 25 Khaadi-style products
const products = [
  // KURTAS (10 products)
  { name: 'Embroidered Cotton Kurta', price: 3500, category: 'Kurtas', rating: 4.5, stock: 25, image: '/product1.webp' },
  { name: 'Printed Lawn Kurta', price: 2800, category: 'Kurtas', rating: 4.2, stock: 40, image: '/product2.webp' },
  { name: 'Silk Embroidered Kurta', price: 6500, category: 'Kurtas', rating: 4.8, stock: 15, image: '/product3.webp' },
  { name: 'Cotton Casual Kurta', price: 2200, category: 'Kurtas', rating: 4.0, stock: 50, image: '/product4.webp' },
  { name: 'Festive Embellished Kurta', price: 8500, category: 'Kurtas', rating: 4.9, stock: 10, image: '/product5.webp' },
  { name: 'Block Printed Kurta', price: 3200, category: 'Kurtas', rating: 4.3, stock: 30, image: '/product6.webp' },
  { name: 'Chikan Embroidered Kurta', price: 4500, category: 'Kurtas', rating: 4.6, stock: 20, image: '/product1.webp' },
  { name: 'Linen Summer Kurta', price: 3800, category: 'Kurtas', rating: 4.4, stock: 35, image: '/product2.webp' },
  { name: 'Velvet Winter Kurta', price: 7200, category: 'Kurtas', rating: 4.7, stock: 12, image: '/product3.webp' },
  { name: 'Digital Print Kurta', price: 3100, category: 'Kurtas', rating: 4.1, stock: 45, image: '/product4.webp' },

  // SAREES (8 products)
  { name: 'Banarsi Silk Saree', price: 12000, category: 'Sarees', rating: 4.9, stock: 8, image: '/product5.webp' },
  { name: 'Chiffon Embroidered Saree', price: 8500, category: 'Sarees', rating: 4.6, stock: 14, image: '/product6.webp' },
  { name: 'Cotton Casual Saree', price: 4500, category: 'Sarees', rating: 4.2, stock: 25, image: '/product1.webp' },
  { name: 'Georgette Party Saree', price: 7800, category: 'Sarees', rating: 4.5, stock: 18, image: '/product2.webp' },
  { name: 'Net Bridal Saree', price: 15000, category: 'Sarees', rating: 5.0, stock: 5, image: '/product3.webp' },
  { name: 'Printed Crepe Saree', price: 5200, category: 'Sarees', rating: 4.3, stock: 22, image: '/product4.webp' },
  { name: 'Organza Designer Saree', price: 11500, category: 'Sarees', rating: 4.8, stock: 9, image: '/product5.webp' },
  { name: 'Linen Block Print Saree', price: 6200, category: 'Sarees', rating: 4.4, stock: 16, image: '/product6.webp' },

  // ACCESSORIES (7 products)
  { name: 'Embroidered Clutch Bag', price: 2500, category: 'Accessories', rating: 4.4, stock: 30, image: '/product1.webp' },
  { name: 'Silk Dupatta', price: 1800, category: 'Accessories', rating: 4.6, stock: 50, image: '/product2.webp' },
  { name: 'Beaded Necklace Set', price: 3200, category: 'Accessories', rating: 4.5, stock: 20, image: '/product3.webp' },
  { name: 'Handcrafted Khussa', price: 2200, category: 'Accessories', rating: 4.3, stock: 35, image: '/product4.webp' },
  { name: 'Pearl Earrings', price: 1500, category: 'Accessories', rating: 4.7, stock: 40, image: '/product5.webp' },
  { name: 'Leather Handbag', price: 4500, category: 'Accessories', rating: 4.4, stock: 25, image: '/product6.webp' },
  { name: 'Silk Scarf', price: 1200, category: 'Accessories', rating: 4.2, stock: 60, image: '/product1.webp' }
];

// Function that clears old data and inserts new products
async function seedDatabase() {
  try {
    await Product.deleteMany({});           // Delete all existing products
    console.log('🗑️  Old products deleted');
    
    await Product.insertMany(products);     // Insert all 25 products
    console.log(`✅ ${products.length} products added successfully!`);
    
    mongoose.connection.close();            // Close the database connection
    console.log('👋 Connection closed');
  } catch (err) {
    console.log('❌ Error seeding database:', err);
  }
}

seedDatabase();