import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  Brain, 
  Layers, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  FileCode, 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  AlertTriangle,
  Play
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-indigo-300 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Next-Gen Intelligence:</span>
            <span className="text-slate-300">Cross-Modal Evidence Reasoning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Understand Everything. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Across Every Format.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload documents, images, audio, and video. OmniMind AI connects fragmented information across diverse formats and produces one unified, traceable understanding.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>{user ? "Open Dashboard" : "Start Analyzing Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition"
            >
              <span>Sign In to Workspace</span>
            </Link>
          </div>

          {/* Cross-Modal Evidence Pipeline Preview Card */}
          <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">Unified Evidence Architecture</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                Active Reasoning Layer
              </span>
            </div>

            {/* Pipeline Visual Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-center">
                <FileText className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">PDF Report</span>
                <span className="text-[10px] text-slate-400">Claims "Normal"</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-center">
                <ImageIcon className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Photograph</span>
                <span className="text-[10px] text-slate-400">Fatigue Cracks</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                <Volume2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Audio Recording</span>
                <span className="text-[10px] text-slate-400">Grinding @ 1800 RPM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-center">
                <Video className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Video Log</span>
                <span className="text-[10px] text-slate-400">4.2mm Wobble & Sparks</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/30 text-center col-span-2 sm:col-span-1">
                <FileCode className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-white block">Field Notes</span>
                <span className="text-[10px] text-slate-400">Bronze Flakes in Mesh</span>
              </div>
            </div>

            {/* AI Synthesized Output Preview */}
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                <GitCompare className="w-4 h-4 text-rose-400" />
                <span>Detected Cross-Modal Contradiction &amp; Triangulation:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The written <strong>equipment_report.pdf</strong> certifies normal status with 1.2 mm/s vibration. However, <strong>damaged_machine.jpg</strong> reveals hairline fractures, <strong>inspection_video.mp4</strong> captures lateral deflection exceeding 4.2mm with sparks, and <strong>technician_interview.mp3</strong> documents 88°C overheating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 border-t border-slate-850 bg-slate-900/30" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              The Fundamental Difference
            </h2>
            <h3 className="text-3xl font-bold text-white">
              Why Generic Chatbots Fail at Real-World Evidence
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Standard AI tools analyze files in isolation. OmniMind creates a unified evidence layer where every modality corroborates or contradicts each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Approach */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Conventional Chatbots</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Isolated File Ingestion without Cross-Modal Reasoning
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Treats each uploaded file as a disconnected conversational context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Cannot compare visual photo defects against signed PDF inspection records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Fails to detect contradictions between audio statements and maintenance reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No verifiable source attribution or structured forensic risk rating</span>
                </li>
              </ul>
            </div>

            {/* OmniMind Approach */}
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                OmniMind Enterprise
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">OmniMind Cross-Modal AI</h4>
              <p className="text-xs text-indigo-300 mt-1 mb-4">
                Unified Evidence Layer + Traceable Multi-Modal Reasoning
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Normalizes text, images, PDF documents, audio, video, and notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automatically detects and highlights cross-modal contradictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Triangulates physical evidence across perceptual &amp; written sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Outputs structured findings, risks, actionable steps, and exact source chips</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Modalities */}
      <section className="py-20 border-t border-slate-800" id="modalities">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              Complete Modality Support
            </h2>
            <h3 className="text-3xl font-bold text-white">
              Ingest Any Format. Reason as One.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 text-center hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">PDF Documents</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Full text extraction with Gemini Document OCR for scanned files.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 text-center hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Photographs</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Forensic visual inspection, anomaly detection, fracture identification.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 text-center hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Audio Recordings</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Gemini native audio transcription, speaker statements, urgent notes.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 text-center hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Video Footage</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Temporal frame timelines, wobble detection, physical vibration logs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 text-center hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
                <FileCode className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Technician Notes</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Field log entries and observations integrated directly into evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Architecture */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-base font-semibold text-white">Row Level Security</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Supabase PostgreSQL RLS policies guarantee users can only query their own files, notes, and AI insights.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
              <Layers className="w-8 h-8 text-indigo-400 mb-3" />
              <h4 className="text-base font-semibold text-white">Private Storage</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Files are stored securely in Supabase Storage with signed ephemeral download URLs. Zero public exposure.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
              <Sparkles className="w-8 h-8 text-cyan-400 mb-3" />
              <h4 className="text-base font-semibold text-white">Zero Client AI Keys</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Gemini API credentials reside strictly in the Express backend. The client never handles AI secrets directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-800 text-center text-xs text-slate-500">
        <p className="text-slate-400 font-medium">OmniMind AI — Understand Everything. Across Every Format.</p>
        <p className="mt-1">Official Production Platform.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
