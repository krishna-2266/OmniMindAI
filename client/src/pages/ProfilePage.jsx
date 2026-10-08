import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import { User, Shield, Sparkles, Database, LogOut, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const { user, signOut, isDemoMode, isSupabaseConfigured } = useAuth();
  const [profile, setProfile] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, healthRes] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/health')
        ]);
        setProfile(meRes.data);
        setSystemHealth(healthRes);
      } catch (err) {
        console.warn('Could not fetch user profile details:', err);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">Investigator Profile &amp; Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account credentials, security layer, and AI system connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* User Details Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 md:col-span-1 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 p-1 mb-4 shadow-xl shadow-indigo-600/20">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-bold text-indigo-300">
                {profile?.fullName ? profile.fullName[0].toUpperCase() : 'U'}
              </div>
            </div>

            <h3 className="text-base font-bold text-white">
              {profile?.fullName || user?.user_metadata?.full_name || 'Multimodal Lead'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile?.email || user?.email || 'demo@omnimind.ai'}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <span>Principal Investigator</span>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* System & Architecture Status Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Multimodal System Architecture
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Database &amp; Row Level Security</div>
                      <div className="text-[10px] text-slate-400">Supabase PostgreSQL</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {systemHealth?.services?.supabase === 'connected' ? 'Connected' : 'Memory Active'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Multimodal Reasoning Engine</div>
                      <div className="text-[10px] text-slate-400">Google Gemini Multimodal API</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {systemHealth?.services?.gemini === 'active' ? 'Active' : 'Deterministic Fallback'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Evidence Storage Isolation</div>
                      <div className="text-[10px] text-slate-400">Signed Ephemeral URLs Only</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Private
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Hackathon Deployment Target:</div>
              <div>Frontend: <code>Vercel (React + Vite)</code></div>
              <div>Backend: <code>Render (Node.js + Express)</code></div>
              <div>Database: <code>Supabase (PostgreSQL + RLS + Storage)</code></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;

