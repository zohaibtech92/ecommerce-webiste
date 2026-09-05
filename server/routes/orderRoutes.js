import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder);
router.route('/admin').get(protect, adminOnly, getAllOrders);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);
router.route('/:id').get(protect, getOrderById);

export default router;