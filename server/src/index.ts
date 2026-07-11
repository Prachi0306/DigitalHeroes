import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start Express server
    const server = app.listen(config.port, () => {
      logger.info(
        `Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`
      );
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      logger.error('Unhandled Promise Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: any) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
