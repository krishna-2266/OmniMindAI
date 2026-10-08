import React from 'react';
import SourceBadge from './SourceBadge';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  GitCompare, 
  Link2, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

export function KeyFindingItem({ finding }) {
  const severityColors = {
    CRITICAL: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    HIGH: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    MEDIUM: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25',
    LOW: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/25',
    INFO: 'text-[#94A3B8] bg-[#0a0f26] border-[#18224b]'
  };

  const badgeColor = severityColors[finding.severity] || severityColors.MEDIUM;

  return (
    <div className="p-4 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 hover:bg-[#0a0f26]/90 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
              {finding.severity || 'MEDIUM'}
            </span>
          </div>
          <p className="text-sm font-medium text-[#F8FAFC] leading-relaxed">
            {finding.finding}
          </p>
        </div>
      </div>

      {finding.sources && finding.sources.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#18224b] flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#94A3B8] font-medium">Corroborated by:</span>
          {finding.sources.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25"
            >
              <Link2 className="w-2.5 h-2.5" />
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CrossModalConnectionItem({ connection }) {
  return (
    <div className="p-4 rounded-xl border border-[#8B5CF6]/30 bg-gradient-to-r from-[#0e1638]/70 to-[#0a0f26]/70 hover:border-[#8B5CF6]/60 transition relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-[#38BDF8] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span>{connection.insight}</span>
        </h4>
        {connection.modalities && (
          <div className="flex items-center gap-1">
            {connection.modalities.map((m, i) => (
              <SourceBadge key={i} modality={m} size="xs" />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[#F8FAFC]/90 leading-relaxed">
        {connection.explanation}
      </p>
    </div>
  );
}

export function ContradictionItem({ contradiction }) {
  return (
    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/15 hover:bg-rose-950/25 transition">
      <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
        <GitCompare className="w-4 h-4" />
        <span>CONTRADICTION DETECTED: {contradiction.issue}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-2">
        <div className="p-2.5 rounded-lg bg-[#0a0f26] border border-[#18224b]">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1">Source Claim A</span>
          <p className="text-[#F8FAFC]/90">{contradiction.sourceA}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-900/20 border border-rose-500/20">
          <span className="text-[10px] uppercase font-bold text-rose-300 block mb-1">Conflicting Empirical Evidence B</span>
          <p className="text-rose-200">{contradiction.sourceB}</p>
        </div>
      </div>

      {contradiction.reconciliation && (
        <div className="mt-2 text-xs text-[#38BDF8] bg-[#0a0f26] p-2.5 rounded-lg border border-[#38BDF8]/25">
          <span className="font-semibold text-[#8B5CF6]">Forensic Reconciliation: </span>
          {contradiction.reconciliation}
        </div>
      )}
    </div>
  );
}

export default { KeyFindingItem, CrossModalConnectionItem, ContradictionItem };
