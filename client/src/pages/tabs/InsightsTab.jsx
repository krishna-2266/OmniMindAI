import React, { useState } from 'react';
import { 
  KeyFindingItem, 
  CrossModalConnectionItem, 
  ContradictionItem 
} from '../../components/InsightCard';
import SourceBadge from '../../components/SourceBadge';
import { 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Lightbulb, 
  Link2,
  GitCompare,
  FileSearch
} from 'lucide-react';

export function InsightsTab({ 
  insights = [], 
  onRunAnalysis, 
  isAnalyzing, 
  hasEvidence 
}) {
  const [focusQuery, setFocusQuery] = useState('');

  const currentInsight = insights[0];

  const handleExecute = (e) => {
    e.preventDefault();
    onRunAnalysis(focusQuery);
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Cross-Modal Evidence Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            AI reasons across documents, photos, audio transcripts, video frames, and notes.
          </p>
        </div>

        {/* Custom inquiry form */}
        <form onSubmit={handleExecute} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={focusQuery}
            onChange={(e) => setFocusQuery(e.target.value)}
            placeholder="Optional focus (e.g. bearing failure)..."
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !hasEvidence}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : 'Re-Analyze'}</span>
          </button>
        </form>
      </div>

      {!currentInsight ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <FileSearch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Evidence Synthesis Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Execute cross-modal reasoning to synthesize all uploaded documents, images, audio, and video files.
          </p>
          <button
            onClick={() => onRunAnalysis(focusQuery)}
            disabled={isAnalyzing || !hasEvidence}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition disabled:opacity-50"
          >
            {isAnalyzing ? 'Synthesizing Evidence...' : 'Generate Cross-Modal Synthesis'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Executive Summary */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Cross-Modal Synthesis</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
              {currentInsight.summary}
            </p>
          </div>

          {/* 2. Contradictions Section (Key Differentiator) */}
          {currentInsight.contradictions && currentInsight.contradictions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitCompare className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Cross-Modal Contradictions Detected ({currentInsight.contradictions.length})
                </h3>
              </div>
              <div className="space-y-3">
                {currentInsight.contradictions.map((c, i) => (
                  <ContradictionItem key={i} contradiction={c} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Cross-Modal Connections */}
          {currentInsight.cross_modal_connections && currentInsight.cross_modal_connections.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Cross-Modal Corroboration &amp; Connections ({currentInsight.cross_modal_connections.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentInsight.cross_modal_connections.map((conn, i) => (
                  <CrossModalConnectionItem key={i} connection={conn} />
                ))}
              </div>
            </div>
          )}

          {/* 4. Key Findings */}
          {currentInsight.key_findings && currentInsight.key_findings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Key Findings &amp; Evidence ({currentInsight.key_findings.length})
                </h3>
              </div>
              <div className="space-y-3">
                {currentInsight.key_findings.map((f, i) => (
                  <KeyFindingItem key={i} finding={f} />
                ))}
              </div>
            </div>
          )}

          {/* 5. Risks & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risks */}
            {currentInsight.risks && currentInsight.risks.length > 0 && (
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Identified Operational Risks</span>
                </h4>
                <ul className="space-y-2.5">
                  {currentInsight.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {currentInsight.recommendations && currentInsight.recommendations.length > 0 && (
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Actionable Recommendations</span>
                </h4>
                <ul className="space-y-2.5">
                  {currentInsight.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 6. Corroborated Evidence Sources */}
          {currentInsight.sources && currentInsight.sources.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Evidence Ledger &amp; Modal Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentInsight.sources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <SourceBadge modality={src.type} size="xs" />
                      <span className="text-xs font-mono text-slate-200 truncate">{src.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      src.status === 'contradicted'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : src.status === 'corroborated'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {src.status || 'supporting'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InsightsTab;

