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
    MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    LOW: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    INFO: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
  };

  const badgeColor = severityColors[finding.severity] || severityColors.MEDIUM;

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
              {finding.severity || 'MEDIUM'}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            {finding.finding}
          </p>
        </div>
      </div>

      {finding.sources && finding.sources.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Corroborated by:</span>
          {finding.sources.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
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
    <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 hover:bg-indigo-950/20 transition relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
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

      <p className="text-xs text-slate-300 leading-relaxed">
        {connection.explanation}
      </p>
    </div>
  );
}

export function ContradictionItem({ contradiction }) {
  return (
    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 hover:bg-rose-950/20 transition">
      <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
        <GitCompare className="w-4 h-4" />
        <span>CONTRADICTION DETECTED: {contradiction.issue}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-2">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Source Claim A</span>
          <p className="text-slate-300">{contradiction.sourceA}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-900/20 border border-rose-500/20">
          <span className="text-[10px] uppercase font-bold text-rose-300 block mb-1">Conflicting Empirical Evidence B</span>
          <p className="text-rose-200">{contradiction.sourceB}</p>
        </div>
      </div>

      {contradiction.reconciliation && (
        <div className="mt-2 text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
          <span className="font-semibold text-amber-200">Forensic Reconciliation: </span>
          {contradiction.reconciliation}
        </div>
      )}
    </div>
  );
}

export default { KeyFindingItem, CrossModalConnectionItem, ContradictionItem };

