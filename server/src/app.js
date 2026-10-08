import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './config/supabase.js';
import geminiService from './services/ai/geminiService.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  config.clientUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matched origin
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-mode']
}));

// Request Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiting
app.use('/api', apiLimiter);

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'OmniMind AI — Multimodal Cross-Modal Evidence Reasoning Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      supabase: isSupabaseConfigured() ? 'connected' : 'memory_fallback',
      gemini: geminiService.isConfigured() ? 'active' : 'deterministic_fallback'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);

// Direct aliases matching hackathon endpoint specifications
// POST /api/projects/:id/files -> handled via fileRoutes mounted on /api
app.use('/api', fileRoutes);
app.use('/api', noteRoutes);
app.use('/api', analysisRoutes);
app.use('/api', chatRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    errorCode: 'ROUTE_NOT_FOUND'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;

