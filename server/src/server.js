import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { autoSeedIfEmpty } from './seed/seeder.js';
import candidateRoutes from './routes/candidateRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check and root route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'TalentFlow ATS API',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 TalentFlow ATS Backend REST API is running',
    endpoints: {
      health: '/api/health',
      candidates: '/api/candidates',
      jobs: '/api/jobs',
      analytics: '/api/analytics',
      resetSeed: 'POST /api/seed/reset',
    },
  });
});

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 TalentFlow Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
