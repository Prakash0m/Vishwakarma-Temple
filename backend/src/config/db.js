import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

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
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
    isConnected = true;
    return conn;
  } catch (err) {
    // If in production or serverless environment without local mongo, log error
    if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
      console.error(`❌ MongoDB Connection Error in Production:`, err);
      throw err;
    }

    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Starting embedded high-performance MongoDB instance...`);
    
    try {
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
      console.log(`✅ Embedded MongoDB successfully started and connected: ${memoryUri}`);
      isConnected = true;
      return conn;
    } catch (memErr) {
      console.error(`❌ Critical: Could not start embedded MongoDB:`, memErr);
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
