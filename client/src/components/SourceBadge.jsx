import React from 'react';
import { FileText, Image as ImageIcon, Volume2, Video, FileCode } from 'lucide-react';

export function getModalityConfig(modality) {
  const mod = (modality || '').toLowerCase();
  switch (mod) {
    case 'pdf':
      return {
        label: 'PDF',
        icon: FileText,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      };
    case 'image':
      return {
        label: 'IMAGE',
        icon: ImageIcon,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      };
    case 'audio':
      return {
        label: 'AUDIO',
        icon: Volume2,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      };
    case 'video':
      return {
        label: 'VIDEO',
        icon: Video,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      };
    case 'text':
    case 'document':
    default:
      return {
        label: 'TEXT',
        icon: FileCode,
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
      };
  }
}

export function SourceBadge({ modality, size = 'sm', className = '' }) {
  const { label, icon: Icon, color } = getModalityConfig(modality);

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5 gap-1' 
    : size === 'md' 
    ? 'text-xs px-2.5 py-1 gap-1.5' 
    : 'text-[11px] px-2 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium tracking-wider rounded-md border ${color} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
}

export default SourceBadge;

