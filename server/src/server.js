import app from './app.js';
import config from './config/env.js';
import logger from './utils/logger.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 OmniMind AI Backend Engine online on port ${PORT}`);
  logger.info(`🌐 Environment: ${config.nodeEnv}`);
  logger.info(`🔒 Supabase Status: ${config.supabase.url ? 'Configured' : 'Local Memory Mode'}`);
  logger.info(`🧠 Gemini Model: ${config.gemini.model} (${config.gemini.apiKey ? 'Key Loaded' : 'Fallback Engine'})`);
  logger.info(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  logger.info(`=======================================================`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down OmniMind server gracefully...`);
  server.close(() => {
    logger.info('OmniMind HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
