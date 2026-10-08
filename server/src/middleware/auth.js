import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware verifying Supabase Auth JWT token
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In demo mode without token, allow demo user if query or header requests demo
      if (req.headers['x-demo-mode'] === 'true' || process.env.DEMO_MODE === 'true' || !isSupabaseConfigured()) {
        req.user = {
          id: memoryStore.demoUserId,
          email: 'demo@omnimind.ai',
          user_metadata: { full_name: 'Lead Multimodal Investigator' }
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing Bearer token.',
        errorCode: 'AUTH_REQUIRED'
      });
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-token' || token === 'anonymous-demo') {
      req.user = {
        id: memoryStore.demoUserId,
        email: 'demo@omnimind.ai',
        user_metadata: { full_name: 'Lead Multimodal Investigator' }
      };
      return next();
    }

    if (isSupabaseConfigured()) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        logger.warn('Supabase token verification failed:', error?.message);
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication session.',
          errorCode: 'INVALID_TOKEN'
        });
      }

      req.user = user;
      return next();
    } else {
      // Offline fallback
      req.user = {
        id: memoryStore.demoUserId,
        email: 'demo@omnimind.ai',
        user_metadata: { full_name: 'Lead Multimodal Investigator' }
      };
      return next();
    }
  } catch (err) {
    logger.error('Unexpected auth middleware error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication service error.',
      errorCode: 'AUTH_ERROR'
    });
  }
}

export default requireAuth;
