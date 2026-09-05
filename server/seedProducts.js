import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Category from './models/Category.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Immersive sound quality with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    brand: 'AudioTech',
    countInStock: 15,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    slug: 'ergonomic-mechanical-keyboard',
    description: 'Customizable RGB backlighting with tactile mechanical switches for comfortable typing.',
    price: 89.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    countInStock: 20,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimalist Leather Watch',
    slug: 'minimalist-leather-watch',
    description: 'Sleek analog watch featuring genuine leather strap and water-resistant casing.',
    price: 120.00,
    category: 'Accessories',
    brand: 'Chrono',
    countInStock: 10,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor',
    slug: 'ultra-wide-curved-gaming-monitor',
    description: '34-inch 144Hz curved display delivering vibrant colors and smooth performance.',
    price: 499.99,
    category: 'Electronics',
    brand: 'VisionPro',
    countInStock: 5,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
  },
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    } else {
      admin.name = 'Admin User';
      admin.role = 'admin';
      admin.password = 'admin123';
    }
    await admin.save();

    const categoryNames = [...new Set(sampleProducts.map((product) => product.category))];
    const categories = new Map();
    for (const name of categoryNames) {
      const category = await Category.findOneAndUpdate(
        { slug: name.toLowerCase() },
        { name, slug: name.toLowerCase() },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      categories.set(name, category._id);
    }

    // Clear existing products and insert new ones
    await Product.deleteMany();
    await Product.insertMany(sampleProducts.map(({ category, image, ...product }) => ({
      ...product,
      user: admin._id,
      category: categories.get(category),
      images: [{ public_id: product.slug, url: image }]
    })));

    console.log('Sample products seeded successfully!');
    process.exitCode = 0;
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDB();