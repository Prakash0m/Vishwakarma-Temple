import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is always loaded regardless of execution context
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

let mongodInstance = null;
let isConnected = false;

export const connectDB = async () => {
  // If already connected in serverless cache, return immediately
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vishwakarma_temple';
  
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 25,
      minPoolSize: 2,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return conn;
  } catch (err) {
    // If in production or with Atlas URI, log error and throw
    if (process.env.NODE_ENV === 'production' || process.env.MONGODB_URI) {
      console.error(`❌ MongoDB Atlas Connection Error:`, err.message);
      throw err;
    }

    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Starting local in-memory fallback...`);
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!mongodInstance) {
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbName: 'vishwakarma_temple',
            storageEngine: 'wiredTiger'
          }
        });
      }
      
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded MongoDB started: ${memoryUri}`);
      isConnected = true;
      return conn;
    } catch (memErr) {
      console.error(`❌ Could not start in-memory MongoDB:`, memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
  isConnected = false;
};
