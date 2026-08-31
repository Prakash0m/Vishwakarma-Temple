import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Static Uploads Folder
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'ॐ श्री विश्वकर्मणे नमः - Vishwakarma Temple Backend is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

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
