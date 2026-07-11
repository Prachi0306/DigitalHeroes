import { Router } from 'express';
import { ApiResponse } from '../utils/api-response.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { uptime: process.uptime() }, 'API is healthy'));
});

// Authentication Routes
router.use('/auth', authRoutes);

// Placeholders for future endpoints
// router.use('/users', usersRoutes);

export default router;
