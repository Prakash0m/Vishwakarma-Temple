import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import poojaRoutes from './routes/poojaRoutes.js';
import poojaBookingRoutes from './routes/poojaBookingRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import toleRoutes from './routes/toleRoutes.js';
import templeIncomeRoutes from './routes/templeIncomeRoutes.js';
import { getHomepageFeed } from './controllers/settingController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// High-Performance HTTP Compression (Gzip / Brotli for JSON & assets)
app.use(compression({
  threshold: 1024, // only compress responses above 1KB
  level: 6
}));

// Body Parser Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static Uploads Folder with Long-term Cache Headers
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '30d',
  etag: true,
  lastModified: true,
  immutable: true
}));

// Root Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vishwakarma Temple API is running',
    temple: 'श्री विश्वकर्मा मन्दिर, छपकी (सप्तरी)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    message: 'Vishwakarma Temple API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// High-Speed Unified Homepage Feed (1 single network roundtrip for all public data)
app.get('/api/homepage-feed', getHomepageFeed);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/pooja-bookings', poojaBookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tole', toleRoutes);
app.use('/api/temple-income', templeIncomeRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
