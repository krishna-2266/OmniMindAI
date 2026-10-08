import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again in a few minutes.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Max 50 AI operations per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI analysis rate limit reached. Please wait a moment before sending more cross-modal analysis requests.',
    errorCode: 'AI_RATE_LIMIT_EXCEEDED'
  }
});

export default { apiLimiter, aiLimiter };
