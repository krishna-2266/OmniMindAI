import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading evidence...' }) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-[#94A3B8]">
      <Loader2 className={`${sizeClasses} animate-spin text-[#38BDF8]`} />
      {text && <p className="text-xs font-medium text-[#94A3B8] tracking-wide">{text}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl border border-[#18224b] bg-[#0a0f26]/60 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-[#18224b] rounded w-1/3"></div>
        <div className="h-5 bg-[#18224b] rounded w-16"></div>
      </div>
      <div className="h-3 bg-[#18224b]/60 rounded w-3/4"></div>
      <div className="h-3 bg-[#18224b]/40 rounded w-1/2"></div>
    </div>
  );
}

export default LoadingSpinner;
