import express from 'express';
import cors from 'cors';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <-- ADD THIS
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // <-- ADD THIS
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'E-Commerce API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'E-Commerce API Service is healthy and operational' });
});

export default app;