import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seeds/seed.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Vishwakarma Temple API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
