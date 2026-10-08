import { createClient } from '@supabase/supabase-js';
import config from './env.js';
import logger from '../utils/logger.js';

let supabaseClient = null;

if (config.supabase.url && config.supabase.serviceRoleKey) {
  try {
    supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    logger.info('Supabase client initialized with Service Role Key');
  } catch (err) {
    logger.error('Failed to initialize Supabase client:', err.message);
  }
} else {
  logger.warn('Supabase credentials not configured in environment. Operating in Local Memory / Demo Mode.');
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = () => Boolean(supabaseClient);

export default supabase;
