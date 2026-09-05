import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true // Admin user who created this product
    },
    name: {
      type: String,
      required: [true, 'Please enter a product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Please specify the brand'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a category']
    },
    description: {
      type: String,
      required: [true, 'Please enter product details']
    },
    price: {
      type: Number,
      required: [true, 'Please specify product price'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    countInStock: {
      type: Number,
      required: [true, 'Please enter product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes for Database Queries
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;