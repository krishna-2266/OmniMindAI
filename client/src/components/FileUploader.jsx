import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Volume2, Video, FileCode, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function FileUploader({ onUpload, isUploading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = (file) => {
    // 50 MB check
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File exceeds the 50 MB limit.');
      return;
    }
    onUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
        isDragOver
          ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
          : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
      } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.mp4,.mov,.webm,.txt,.md,.csv"
      />

      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            {isUploading ? 'Ingesting into Evidence Layer...' : 'Upload Multimodal Evidence'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Drag and drop your file here, or click to browse. Files are processed with forensic multimodal extraction.
          </p>
        </div>

        {/* Modality Chips Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <FileText className="w-3 h-3" /> PDF
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <ImageIcon className="w-3 h-3" /> IMAGE
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <Volume2 className="w-3 h-3" /> AUDIO
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Video className="w-3 h-3" /> VIDEO
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <FileCode className="w-3 h-3" /> TEXT
          </span>
        </div>

        <span className="text-[10px] text-slate-500">Max file size: 50 MB per source</span>
      </div>
    </div>
  );
}

export default FileUploader;
