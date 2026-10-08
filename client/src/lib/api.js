import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach bearer token
api.interceptors.request.use(async (config) => {
  try {
    let token = null;

    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }

    if (!token) {
      // Check localStorage for demo token or offline fallback
      token = localStorage.getItem('omnimind_demo_token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Could not attach auth token:', err);
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor for clean error payloads
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend returns 401 Unauthorized, clear cached session
    if (error.response?.status === 401) {
      localStorage.removeItem('omnimind_active_user');
      localStorage.removeItem('omnimind_demo_mode');
    }
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    const errorCode = error.response?.data?.errorCode || 'API_ERROR';
    return Promise.reject(new Error(errorMsg, { cause: { errorCode, response: error.response } }));
  }
);

export default api;
