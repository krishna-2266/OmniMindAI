import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import logger from '../utils/logger.js';

export const authController = {
  /**
   * GET /api/auth/me
   */
  async getMe(req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
          errorCode: 'UNAUTHENTICATED'
        });
      }

      if (isSupabaseConfigured()) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return res.json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
            avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
            createdAt: profile?.created_at || user.created_at
          }
        });
      } else {
        const profile = memoryStore.profiles.find(p => p.id === user.id) || memoryStore.profiles[0];
        return res.json({
          success: true,
          data: {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            createdAt: profile.created_at
          }
        });
      }
    } catch (err) {
      logger.error('Error fetching user profile:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
        errorCode: 'PROFILE_FETCH_ERROR'
      });
    }
  }
};

export default authController;
