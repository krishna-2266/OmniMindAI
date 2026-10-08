import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SourceBadge from '../../components/SourceBadge';
import { 
  Sparkles, 
  Layers, 
  MessageSquareCode, 
  ArrowRight, 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function OverviewTab({ project, files = [], insights = [], onRunAnalysis, isAnalyzing }) {
  const { id: projectId } = useParams();

  const latestInsight = insights[0];

  // Modality count map
  const modalities = {
    pdf: files.filter(f => f.modality === 'pdf').length,
    image: files.filter(f => f.modality === 'image').length,
    audio: files.filter(f => f.modality === 'audio').length,
    video: files.filter(f => f.modality === 'video').length,
    text: files.filter(f => f.modality === 'text' || f.modality === 'document').length
  };

  const totalModalityDiversity = Object.values(modalities).filter(count => count > 0).length;

  return (
    <div className="space-y-6">
      {/* Overview Top Hero Banner */}
      <div className="rounded-2xl border border-[#18224b] bg-gradient-to-r from-[#0a0f26]/90 via-[#0e1638]/90 to-[#0a0f26]/90 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Multimodal Evidence Synthesis Workspace</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            {project?.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
            {project?.description || 'Unified workspace for cross-modal forensic intelligence and evidence reasoning.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing || files.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Reasoning Across Evidence...' : 'Execute Cross-Modal Reasoning'}</span>
            </button>

            <Link
              to={`/projects/${projectId}/chat`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0a0f26] hover:bg-[#121c42] text-[#F8FAFC] border border-[#18224b] transition cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4 text-[#38BDF8]" />
              <span>Ask Multimodal AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modality Spectrum Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#94A3B8]">PDF Documents</div>
            <div className="text-lg font-bold text-[#F8FAFC]">{modalities.pdf}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#94A3B8]">Photographs</div>
            <div className="text-lg font-bold text-[#F8FAFC]">{modalities.image}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#94A3B8]">Audio Records</div>
            <div className="text-lg font-bold text-[#F8FAFC]">{modalities.audio}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#94A3B8]">Video Logs</div>
            <div className="text-lg font-bold text-[#F8FAFC]">{modalities.video}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#94A3B8]">Text &amp; Notes</div>
            <div className="text-lg font-bold text-[#F8FAFC]">{modalities.text}</div>
          </div>
        </div>
      </div>

      {/* Latest Cross-Modal Intelligence Summary if present */}
      {latestInsight ? (
        <div className="p-6 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#18224b]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>Latest Cross-Modal Synthesis</span>
            </div>
            <Link
              to={`/projects/${projectId}/insights`}
              className="text-xs text-[#38BDF8] hover:text-[#7dd3fc] font-medium inline-flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#F8FAFC]/90 leading-relaxed font-sans">
            {latestInsight.summary}
          </p>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {latestInsight.contradictions && latestInsight.contradictions.length > 0 && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/15">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  Primary Contradiction Detected
                </span>
                <p className="text-xs text-rose-200">
                  {latestInsight.contradictions[0].issue}
                </p>
              </div>
            )}

            {latestInsight.cross_modal_connections && latestInsight.cross_modal_connections.length > 0 && (
              <div className="p-4 rounded-xl border border-[#8B5CF6]/30 bg-[#0e1638]/70">
                <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block mb-1">
                  Key Cross-Modal Connection
                </span>
                <p className="text-xs text-[#F8FAFC]/90">
                  {latestInsight.cross_modal_connections[0].insight}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-[#18224b] bg-[#0a0f26]/30 text-center">
          <Layers className="w-10 h-10 text-[#94A3B8]/40 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-[#F8FAFC]">No Cross-Modal Synthesis Generated Yet</h4>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-4">
            Upload files or click "Execute Cross-Modal Reasoning" to triangulate evidence across formats.
          </p>
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing || files.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] transition disabled:opacity-50 cursor-pointer shadow-md shadow-[#2563EB]/25"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Reasoning Now'}
          </button>
        </div>
      )}
    </div>
  );
}

export default OverviewTab;
