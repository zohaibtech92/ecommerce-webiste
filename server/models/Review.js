import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Please enter a review header'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comments'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound Index: Ensures one user can review a specific product only once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;