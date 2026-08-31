import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { seedDatabase } from './seeds/seed.js';
import app from './app.js';

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await connectDB();
    console.log('Database connection verified.');

    // Seed database safely (idempotent - skips if data already exists)
    await seedDatabase();

    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Vishwakarma Temple API Server running on http://${HOST}:${PORT} in ${process.env.NODE_ENV || 'production'} mode`);
      console.log(`📡 Health check available at: http://${HOST}:${PORT}/api/health`);
    });

    // Graceful Shutdown
    const handleShutdown = (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

    return server;
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
