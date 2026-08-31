import { connectDB } from '../backend/src/config/db.js';
import { seedDatabase } from '../backend/src/seeds/seed.js';
import app from '../backend/src/app.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  try {
    await connectDB();
    if (!isDbInitialized) {
      await seedDatabase();
      isDbInitialized = true;
    }
  } catch (err) {
    console.error('Serverless DB Connection Error:', err);
  }

  return app(req, res);
}
