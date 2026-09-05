import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payment/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_')) {
      return res.status(503).json({
        success: false,
        message: 'Stripe is not configured. Add a valid STRIPE_SECRET_KEY to server/.env.'
      });
    }

    const { items, shippingPrice = 0, taxPrice = 0 } = req.body;

    // Calculate subtotal from items (prices in cents for Stripe)
    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalAmount = Math.round((itemsPrice + shippingPrice + taxPrice) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};