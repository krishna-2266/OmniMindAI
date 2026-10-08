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
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multimodal Evidence Synthesis Workspace</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {project?.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {project?.description || 'Unified workspace for cross-modal forensic intelligence and evidence reasoning.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing || files.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Reasoning Across Evidence...' : 'Execute Cross-Modal Reasoning'}</span>
            </button>

            <Link
              to={`/projects/${projectId}/chat`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-400" />
              <span>Ask Multimodal AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modality Spectrum Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">PDF Documents</div>
            <div className="text-lg font-bold text-white">{modalities.pdf}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Photographs</div>
            <div className="text-lg font-bold text-white">{modalities.image}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Audio Records</div>
            <div className="text-lg font-bold text-white">{modalities.audio}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Video Logs</div>
            <div className="text-lg font-bold text-white">{modalities.video}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Text &amp; Notes</div>
            <div className="text-lg font-bold text-white">{modalities.text}</div>
          </div>
        </div>
      </div>

      {/* Latest Cross-Modal Intelligence Summary if present */}
      {latestInsight ? (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Latest Cross-Modal Synthesis</span>
            </div>
            <Link
              to={`/projects/${projectId}/insights`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {latestInsight.summary}
          </p>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {latestInsight.contradictions && latestInsight.contradictions.length > 0 && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  Primary Contradiction Detected
                </span>
                <p className="text-xs text-rose-200">
                  {latestInsight.contradictions[0].issue}
                </p>
              </div>
            )}

            {latestInsight.cross_modal_connections && latestInsight.cross_modal_connections.length > 0 && (
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Key Cross-Modal Connection
                </span>
                <p className="text-xs text-indigo-200">
                  {latestInsight.cross_modal_connections[0].insight}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 text-center">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No Cross-Modal Synthesis Generated Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Upload files or click "Execute Cross-Modal Reasoning" to triangulate evidence across formats.
          </p>
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing || files.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Reasoning Now'}
          </button>
        </div>
      )}
    </div>
  );
}

export default OverviewTab;
