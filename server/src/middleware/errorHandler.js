import logger from '../utils/logger.js';
import config from '../config/env.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error processing ${req.method} ${req.url}:`, err.stack || err.message);

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File size exceeds maximum allowed limit (50 MB).',
        errorCode: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      errorCode: 'UPLOAD_ERROR'
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid input data.',
      errors: err.errors,
      errorCode: 'VALIDATION_ERROR'
    });
  }

  // Default status code
  const statusCode = err.status || err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500 ? 'An unexpected internal server error occurred.' : err.message,
    errorCode: err.errorCode || 'INTERNAL_ERROR',
    ...(isProd ? {} : { stack: err.stack })
  });
}

export default errorHandler;
