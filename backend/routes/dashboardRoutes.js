import express from 'express';
import { getDashboardStats, getUserDashboardStats } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, admin, getDashboardStats);
router.get('/user', protect, getUserDashboardStats);

export default router;
