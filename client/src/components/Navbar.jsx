import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Layers, Shield, Sparkles, LogOut, User, FolderKanban } from 'lucide-react';

export function Navbar() {
  const { user, signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">OmniMind</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline -mt-0.5">
              Cross-Modal Evidence Reasoning
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <FolderKanban className="w-4 h-4 text-slate-400" />
            <span>Projects</span>
          </Link>
          <a
            href="#modalities"
            className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Unified Evidence</span>
          </a>
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-400" />
            <span>Reasoning Engine</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Demo Mode Active</span>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
              >
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                title="Profile & Settings"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
