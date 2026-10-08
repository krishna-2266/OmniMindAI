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
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="pb-6 border-b border-[#18224b]">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Investigator Profile &amp; Settings</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage your account credentials, security layer, and AI system connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* User Details Card */}
          <div className="p-6 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70 md:col-span-1 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2563EB] via-[#8B5CF6] to-[#38BDF8] p-1 mb-4 shadow-xl shadow-[#2563EB]/25">
              <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center text-2xl font-bold text-[#38BDF8]">
                {profile?.fullName ? profile.fullName[0].toUpperCase() : 'U'}
              </div>
            </div>

            <h3 className="text-base font-bold text-[#F8FAFC]">
              {profile?.fullName || user?.user_metadata?.full_name || 'Multimodal Lead'}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {profile?.email || user?.email || 'demo@omnimind.ai'}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25">
              <span>Principal Investigator</span>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/20 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* System & Architecture Status Card */}
          <div className="p-6 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70 md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
                Multimodal System Architecture
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#18224b] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-medium text-[#F8FAFC]">Database &amp; Row Level Security</div>
                      <div className="text-[10px] text-[#94A3B8]">Supabase PostgreSQL</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {systemHealth?.services?.supabase === 'connected' ? 'Connected' : 'Memory Active'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#18224b] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                    <div>
                      <div className="text-xs font-medium text-[#F8FAFC]">Multimodal Reasoning Engine</div>
                      <div className="text-[10px] text-[#94A3B8]">Google Gemini Multimodal API</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/25">
                    {systemHealth?.services?.gemini === 'active' ? 'Active' : 'Deterministic Fallback'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050816] border border-[#18224b] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-[#8B5CF6]" />
                    <div>
                      <div className="text-xs font-medium text-[#F8FAFC]">Evidence Storage Isolation</div>
                      <div className="text-[10px] text-[#94A3B8]">Signed Ephemeral URLs Only</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/25">
                    Private
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#050816] border border-[#18224b] text-xs text-[#94A3B8] space-y-1">
              <div className="font-semibold text-[#F8FAFC]">Hackathon Deployment Architecture:</div>
              <div>Frontend: <code className="text-[#38BDF8]">Vercel (React + Vite)</code></div>
              <div>Backend: <code className="text-[#38BDF8]">Render (Node.js + Express)</code></div>
              <div>Database: <code className="text-[#38BDF8]">Supabase (PostgreSQL + RLS + Storage)</code></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
