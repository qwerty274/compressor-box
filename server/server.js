import express from 'express';
import cors from 'cors';
import path from 'path';
import compressionRoutes from './routes/compressionRoutes.js';
import { startPeriodicCleanup } from './utils/cleanup.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', compressionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CompressBox API Engine' });
});

// Centralized error handler - never expose server stack traces to client
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'One or more files exceed the 25 MB limit.'
    });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: 'Maximum 20 files allowed per upload batch.'
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something went wrong. Please try again.'
  });
});

// Start background file cleanup worker (runs every 15 min, cleans files older than 30 min)
startPeriodicCleanup();

app.listen(PORT, () => {
  console.log(`🚀 CompressBox Server running on http://localhost:${PORT}`);
});
