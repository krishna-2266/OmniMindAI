import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Brain, ArrowRight, Loader2, Shield } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Signed in successfully.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-[#8B5CF6]/12 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#8B5CF6] to-[#38BDF8] flex items-center justify-center text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-[#F8FAFC] tracking-tight">OmniMind AI</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
          Sign In to Your Workspace
        </h2>
        <p className="mt-2 text-xs text-[#94A3B8]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#38BDF8] hover:text-[#7dd3fc]">
            Create an official account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-[#18224b]">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigator@omnimind.ai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0f26] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0f26] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#18224b] text-center">
            <p className="text-[11px] text-[#94A3B8]">
              Secured with Supabase PostgreSQL Row Level Security (RLS).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
