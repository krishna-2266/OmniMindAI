import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({ message = 'An error occurred while loading data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/20 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-200">Unable to Complete Action</h4>
      <p className="text-xs text-rose-300/80 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/30 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorState;

