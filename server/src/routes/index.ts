import { Router } from 'express';
import { ApiResponse } from '../utils/api-response.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { uptime: process.uptime() }, 'API is healthy'));
});

// Placeholders for Milestone 2+ endpoints
// router.use('/auth', authRoutes);
// router.use('/users', usersRoutes);

export default router;
