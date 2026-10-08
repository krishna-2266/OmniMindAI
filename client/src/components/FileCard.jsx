import React from 'react';
import SourceBadge from './SourceBadge';
import { Trash2, Eye, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FileCard({ file, onPreview, onDelete }) {
  const isReady = file.processing_status === 'ready';
  const isFailed = file.processing_status === 'failed';
  const isProcessing = file.processing_status === 'processing' || file.processing_status === 'uploaded';

  return (
    <div className="glass-card rounded-xl p-4 flex flex-col justify-between group border border-[#18224b] hover:border-[#38BDF8]/40 hover:shadow-lg hover:shadow-[#2563EB]/15">
      <div>
        {/* Top Header: Modality & Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <SourceBadge modality={file.modality} size="sm" />
          <div className="flex items-center gap-1.5">
            {isReady && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Indexed
              </span>
            )}
            {isProcessing && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Clock className="w-3 h-3 animate-spin" /> Ingesting
              </span>
            )}
            {isFailed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <AlertCircle className="w-3 h-3" /> Ingestion Issue
              </span>
            )}
          </div>
        </div>

        {/* File Name */}
        <h4 className="text-sm font-semibold text-[#F8FAFC] truncate" title={file.original_name}>
          {file.original_name}
        </h4>

        {/* AI Summary Snippet if available */}
        {file.ai_summary && (
          <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed bg-[#0a0f26]/80 p-2.5 rounded-lg border border-[#18224b]">
            {file.ai_summary}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-[#18224b] flex items-center justify-between text-[11px] text-[#94A3B8]">
        <div>
          <span>{formatBytes(file.file_size)}</span>
          <span className="mx-1.5">•</span>
          <span>{new Date(file.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreview(file)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#0a0f26] transition cursor-pointer"
            title="Inspect Extracted Evidence"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#0a0f26] transition cursor-pointer"
            title="Remove from Repository"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileCard;
