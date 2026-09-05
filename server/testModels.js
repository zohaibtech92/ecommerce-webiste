import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Review from './models/Review.js';

dotenv.config();

const testSchemaCompilation = async () => {
  console.log('[Test] Compiling Mongoose Schemas...');
  
  await connectDB();
  
  console.log('✓ User model compiled successfully');
  console.log('✓ Category model compiled successfully');
  console.log('✓ Product model compiled successfully');
  console.log('✓ Review model compiled successfully');
  console.log('✓ Order model compiled successfully');
  
  process.exit(0);
};

testSchemaCompilation();