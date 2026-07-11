import { CorsOptions } from 'cors';
import { config } from './index.js';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [config.frontendUrl];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || config.nodeEnv === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
