import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import api from '../lib/api';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: 'demo@omnimind.ai',
  full_name: 'Lead Multimodal Investigator',
  user_metadata: {
    full_name: 'Lead Multimodal Investigator',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
};

export function AuthProvider({ children }) {
  // Initialize user synchronously from localStorage cache to prevent flash of unauthenticated state
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('omnimind_active_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('omnimind_demo_mode') === 'true';
  });

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          // 1. Check existing session from Supabase client
          const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.warn('Session verification warning:', sessionError.message);
          }

          if (isMounted) {
            if (initialSession?.user) {
              setUser(initialSession.user);
              setSession(initialSession);
              setIsDemoMode(false);
              localStorage.setItem('omnimind_active_user', JSON.stringify(initialSession.user));
              localStorage.removeItem('omnimind_demo_mode');
            } else {
              // Check if in demo mode
              const demoModeActive = localStorage.getItem('omnimind_demo_mode') === 'true';
              if (demoModeActive) {
                setUser(DEMO_USER);
                setIsDemoMode(true);
              } else {
                setUser(null);
                setSession(null);
                localStorage.removeItem('omnimind_active_user');
              }
            }
            setLoading(false);
          }

          // 2. Subscribe to auth state updates
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!isMounted) return;

            if (currentSession?.user) {
              setUser(currentSession.user);
              setSession(currentSession);
              setIsDemoMode(false);
              localStorage.setItem('omnimind_active_user', JSON.stringify(currentSession.user));
              localStorage.removeItem('omnimind_demo_mode');
              localStorage.removeItem('omnimind_demo_token');
            } else {
              const demoModeActive = localStorage.getItem('omnimind_demo_mode') === 'true';
              if (demoModeActive) {
                setUser(DEMO_USER);
                setIsDemoMode(true);
              } else {
                setUser(null);
                setSession(null);
                localStorage.removeItem('omnimind_active_user');
              }
            }
            setLoading(false);
          });

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Fallback when Supabase is not configured in client
          setUser(DEMO_USER);
          setIsDemoMode(true);
          localStorage.setItem('omnimind_demo_mode', 'true');
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Supabase Signup
  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth is not configured in client environment.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });
    if (error) throw error;
    if (data.session) {
      setUser(data.user);
      setSession(data.session);
      setIsDemoMode(false);
      localStorage.setItem('omnimind_active_user', JSON.stringify(data.user));
    }
    return data;
  };

  // Supabase Login
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth is not configured in client environment.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    setIsDemoMode(false);
    localStorage.setItem('omnimind_active_user', JSON.stringify(data.user));
    localStorage.removeItem('omnimind_demo_mode');
    localStorage.removeItem('omnimind_demo_token');
    return data;
  };

  // Demo Login
  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    setIsDemoMode(true);
    localStorage.setItem('omnimind_demo_mode', 'true');
    localStorage.setItem('omnimind_active_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('omnimind_demo_token', 'demo-token');
  };

  // Logout
  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase && !isDemoMode) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      setUser(null);
      setSession(null);
      setIsDemoMode(false);
      localStorage.removeItem('omnimind_active_user');
      localStorage.removeItem('omnimind_demo_mode');
      localStorage.removeItem('omnimind_demo_token');
    }
  };

  const value = {
    user,
    session,
    loading,
    isDemoMode,
    isSupabaseConfigured,
    signUp,
    signIn,
    loginAsDemoUser,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
