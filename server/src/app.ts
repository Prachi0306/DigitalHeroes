import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';
import { ApiError } from './utils/api-error.js';

const app = express();

// Secure Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors(corsOptions));

// Parsing incoming requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logger middleware
app.use(requestLogger);

// API Routes
app.use('/api/v1', apiRouter);

// Catch-all for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);

export default app;
