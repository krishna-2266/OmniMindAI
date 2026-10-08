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
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession?.user) {
            setUser(currentSession.user);
            setSession(currentSession);
            setIsDemoMode(false);
            setLoading(false);
            return;
          }

          // Listen for auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
            if (newSession?.user) {
              setIsDemoMode(false);
              localStorage.removeItem('omnimind_demo_token');
            }
          });

          // Check if user previously logged in as demo
          const demoSaved = localStorage.getItem('omnimind_demo_user');
          if (demoSaved) {
            setUser(JSON.parse(demoSaved));
            setIsDemoMode(true);
          }

          setLoading(false);
          return () => subscription.unsubscribe();
        } else {
          // Supabase not configured in client .env; default or restore demo user
          const demoSaved = localStorage.getItem('omnimind_demo_user');
          if (demoSaved) {
            setUser(JSON.parse(demoSaved));
            setIsDemoMode(true);
          } else {
            // Auto-load demo user for instantaneous zero-config experience
            setUser(DEMO_USER);
            setIsDemoMode(true);
            localStorage.setItem('omnimind_demo_user', JSON.stringify(DEMO_USER));
            localStorage.setItem('omnimind_demo_token', 'demo-token');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // Supabase Signup
  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth is not configured. Please use Demo Mode or configure Supabase keys in .env.');
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
    return data;
  };

  // Supabase Login
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Auth is not configured. Please use Demo Mode or configure Supabase keys in .env.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
    setIsDemoMode(false);
    localStorage.removeItem('omnimind_demo_token');
    localStorage.removeItem('omnimind_demo_user');
    return data;
  };

  // Demo Login
  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    setIsDemoMode(true);
    localStorage.setItem('omnimind_demo_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('omnimind_demo_token', 'demo-token');
  };

  // Logout
  const signOut = async () => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    localStorage.removeItem('omnimind_demo_user');
    localStorage.removeItem('omnimind_demo_token');
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

