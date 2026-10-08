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
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[280px] bg-[#8B5CF6]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[220px] bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0f26] border border-[#1e2c62] text-xs text-[#38BDF8] mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="font-semibold text-[#F8FAFC]">Next-Gen Intelligence:</span>
            <span className="text-[#94A3B8]">Cross-Modal Evidence Reasoning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.1] max-w-4xl mx-auto">
            Understand Everything. <br />
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Across Every Format.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Upload documents, images, audio, and video. OmniMind AI connects fragmented information across diverse formats and produces one unified, traceable understanding.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{user ? "Open Dashboard" : "Start Analyzing Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#0a0f26] hover:bg-[#121c42] text-[#F8FAFC] border border-[#1e2c62] transition cursor-pointer"
            >
              <span>Sign In to Workspace</span>
            </Link>
          </div>

          {/* Cross-Modal Evidence Pipeline Preview Card */}
          <div className="mt-16 rounded-2xl border border-[#18224b] bg-[#0a0f26]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#18224b] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs font-mono text-[#94A3B8] ml-2">Unified Evidence Architecture</span>
              </div>
              <span className="text-[11px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/25">
                Active Reasoning Layer
              </span>
            </div>

            {/* Pipeline Visual Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#050816] border border-rose-500/30 text-center">
                <FileText className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#F8FAFC] block">PDF Report</span>
                <span className="text-[10px] text-[#94A3B8]">Claims "Normal"</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050816] border border-amber-500/30 text-center">
                <ImageIcon className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#F8FAFC] block">Photograph</span>
                <span className="text-[10px] text-[#94A3B8]">Fatigue Cracks</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050816] border border-emerald-500/30 text-center">
                <Volume2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#F8FAFC] block">Audio Recording</span>
                <span className="text-[10px] text-[#94A3B8]">Grinding @ 1800 RPM</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050816] border border-[#8B5CF6]/40 text-center">
                <Video className="w-5 h-5 text-[#8B5CF6] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#F8FAFC] block">Video Log</span>
                <span className="text-[10px] text-[#94A3B8]">4.2mm Wobble &amp; Sparks</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050816] border border-[#38BDF8]/40 text-center col-span-2 sm:col-span-1">
                <FileCode className="w-5 h-5 text-[#38BDF8] mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#F8FAFC] block">Field Notes</span>
                <span className="text-[10px] text-[#94A3B8]">Bronze Flakes in Mesh</span>
              </div>
            </div>

            {/* AI Synthesized Output Preview */}
            <div className="p-4 rounded-xl bg-[#0e1638] border border-[#8B5CF6]/30">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-2">
                <GitCompare className="w-4 h-4 text-[#A855F7]" />
                <span>Detected Cross-Modal Contradiction &amp; Triangulation:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F8FAFC]/90 leading-relaxed">
                The written <strong className="text-[#38BDF8]">equipment_report.pdf</strong> certifies normal status with 1.2 mm/s vibration. However, <strong className="text-amber-300">damaged_machine.jpg</strong> reveals hairline fractures, <strong className="text-[#8B5CF6]">inspection_video.mp4</strong> captures lateral deflection exceeding 4.2mm with sparks, and <strong className="text-emerald-300">technician_interview.mp3</strong> documents 88°C overheating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 border-t border-[#18224b] bg-[#0a0f26]/40" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest mb-2">
              The Fundamental Difference
            </h2>
            <h3 className="text-3xl font-bold text-[#F8FAFC]">
              Why Generic Chatbots Fail at Real-World Evidence
            </h3>
            <p className="text-[#94A3B8] text-sm mt-3">
              Standard AI tools analyze files in isolation. OmniMind creates a unified evidence layer where every modality corroborates or contradicts each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Approach */}
            <div className="p-6 rounded-2xl border border-[#18224b] bg-[#0a0f26]/60">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#F8FAFC]">Conventional Chatbots</h4>
              <p className="text-xs text-[#94A3B8] mt-1 mb-4">
                Isolated File Ingestion without Cross-Modal Reasoning
              </p>
              <ul className="space-y-2.5 text-xs text-[#94A3B8]">
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
            <div className="p-6 rounded-2xl border border-[#8B5CF6]/40 bg-gradient-to-b from-[#0e1638]/90 to-[#0a0f26]/90 relative shadow-xl shadow-[#8B5CF6]/10">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6]/20 text-[#38BDF8] border border-[#8B5CF6]/30">
                OmniMind Enterprise
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#F8FAFC]">OmniMind Cross-Modal AI</h4>
              <p className="text-xs text-[#38BDF8] mt-1 mb-4">
                Unified Evidence Layer + Traceable Multi-Modal Reasoning
              </p>
              <ul className="space-y-2.5 text-xs text-[#F8FAFC]">
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
      <section className="py-20 border-t border-[#18224b]" id="modalities">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest mb-2">
              Complete Modality Support
            </h2>
            <h3 className="text-3xl font-bold text-[#F8FAFC]">
              Ingest Any Format. Reason as One.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 text-center hover:border-[#38BDF8]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">PDF Documents</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Full text extraction with Gemini Document OCR for scanned files.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 text-center hover:border-[#38BDF8]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">Photographs</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Forensic visual inspection, anomaly detection, fracture identification.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 text-center hover:border-[#38BDF8]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">Audio Recordings</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Gemini native audio transcription, speaker statements, urgent notes.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 text-center hover:border-[#8B5CF6]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center mx-auto mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">Video Footage</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Temporal frame timelines, wobble detection, physical vibration logs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 text-center hover:border-[#38BDF8]/40 transition">
              <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
                <FileCode className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">Technician Notes</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Field log entries and observations integrated directly into evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Architecture */}
      <section className="py-20 border-t border-[#18224b] bg-[#0a0f26]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#18224b] bg-[#0a0f26]/70">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-base font-semibold text-[#F8FAFC]">Row Level Security</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Supabase PostgreSQL RLS policies guarantee users can only query their own files, notes, and AI insights.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#18224b] bg-[#0a0f26]/70">
              <Layers className="w-8 h-8 text-[#8B5CF6] mb-3" />
              <h4 className="text-base font-semibold text-[#F8FAFC]">Private Storage</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Files are stored securely in Supabase Storage with signed ephemeral download URLs. Zero public exposure.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#18224b] bg-[#0a0f26]/70">
              <Sparkles className="w-8 h-8 text-[#38BDF8] mb-3" />
              <h4 className="text-base font-semibold text-[#F8FAFC]">Zero Client AI Keys</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Gemini API credentials reside strictly in the Express backend. The client never handles AI secrets directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-[#18224b] text-center text-xs text-[#94A3B8]">
        <p className="text-[#F8FAFC] font-medium">OmniMind AI — Understand Everything. Across Every Format.</p>
        <p className="mt-1 text-[#94A3B8]">Official Production Platform.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
