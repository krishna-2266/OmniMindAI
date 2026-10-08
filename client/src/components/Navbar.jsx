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
    <header className="sticky top-0 z-40 w-full border-b border-[#18224b] bg-[#050816]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#8B5CF6] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#2563EB]/25 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-[#F8FAFC]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#F8FAFC] tracking-tight">OmniMind</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#94A3B8] hidden sm:inline -mt-0.5">
              Cross-Modal Evidence Reasoning
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/dashboard"
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center gap-1.5"
          >
            <FolderKanban className="w-4 h-4 text-[#38BDF8]" />
            <span>Workspaces</span>
          </Link>
          <a
            href="#modalities"
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
            <span>Unified Evidence</span>
          </a>
          <a
            href="#how-it-works"
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Reasoning Engine</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-[#F8FAFC] shadow-sm transition"
              >
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#0e1638] transition"
                title="Profile & Settings"
              >
                <div className="w-7 h-7 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-xs font-bold text-[#38BDF8]">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#0e1638] transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] rounded-lg transition shadow-md shadow-[#2563EB]/25"
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
