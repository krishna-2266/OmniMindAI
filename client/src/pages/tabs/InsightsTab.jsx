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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#18224b]">
        <div>
          <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#38BDF8]" />
            <span>Cross-Modal Evidence Intelligence</span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
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
            className="px-3 py-2 rounded-xl bg-[#0a0f26] border border-[#1e2c62] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] w-full sm:w-64"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !hasEvidence}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-md shadow-[#2563EB]/25 transition disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : 'Re-Analyze'}</span>
          </button>
        </form>
      </div>

      {!currentInsight ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#18224b] bg-[#0a0f26]/40">
          <FileSearch className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F8FAFC]">No Evidence Synthesis Available</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-6">
            Execute cross-modal reasoning to synthesize all uploaded documents, images, audio, and video files.
          </p>
          <button
            onClick={() => onRunAnalysis(focusQuery)}
            disabled={isAnalyzing || !hasEvidence}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? 'Synthesizing Evidence...' : 'Generate Cross-Modal Synthesis'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Executive Summary */}
          <div className="rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-b from-[#0e1638]/90 to-[#0a0f26]/90 p-6 shadow-xl shadow-[#8B5CF6]/10">
            <h3 className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Executive Cross-Modal Synthesis</span>
            </h3>
            <p className="text-sm sm:text-base text-[#F8FAFC] font-sans leading-relaxed">
              {currentInsight.summary}
            </p>
          </div>

          {/* 2. Contradictions Section (Key Differentiator) */}
          {currentInsight.contradictions && currentInsight.contradictions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitCompare className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
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
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
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
                <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
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
              <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Identified Operational Risks</span>
                </h4>
                <ul className="space-y-2.5">
                  {currentInsight.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                      <span className="text-[#F8FAFC]/90">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {currentInsight.recommendations && currentInsight.recommendations.length > 0 && (
              <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Actionable Recommendations</span>
                </h4>
                <ul className="space-y-2.5">
                  {currentInsight.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                      <span className="text-[#F8FAFC]/90">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 6. Corroborated Evidence Sources */}
          {currentInsight.sources && currentInsight.sources.length > 0 && (
            <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/50">
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                Evidence Ledger &amp; Modal Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentInsight.sources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#050816] border border-[#18224b] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <SourceBadge modality={src.type} size="xs" />
                      <span className="text-xs font-mono text-[#F8FAFC] truncate">{src.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      src.status === 'contradicted'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : src.status === 'corroborated'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-[#0a0f26] text-[#94A3B8] border border-[#18224b]'
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
