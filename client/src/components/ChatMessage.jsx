import React from 'react';
import SourceBadge from './SourceBadge';
import { Brain, User, Link2 } from 'lucide-react';

export function ChatMessage({ message, onSourceClick }) {
  const isUser = message.role === 'user';

  // Format simple markdown into clean HTML elements safely
  const formatContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-white mt-3 mb-1">{line.slice(4)}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-4 mb-1.5">{line.slice(3)}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2)}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-200 my-0.5 leading-relaxed">
            {renderBoldText(line.slice(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-200 my-0.5 leading-relaxed">
            {renderBoldText(itemText)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-0.5">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-md">
          <Brain className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-2xl rounded-2xl p-4 ${
        isUser
          ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
          : 'glass-panel rounded-tl-none border border-slate-800'
      }`}>
        <div className="space-y-1">
          {formatContent(message.content)}
        </div>

        {/* Source Evidence Citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium">Evidence Sources:</span>
            {message.sources.map((s, idx) => (
              <button
                key={idx}
                onClick={() => onSourceClick && onSourceClick(s)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/90 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 transition cursor-pointer"
                title={`Click to inspect evidence in ${s.name || s}`}
              >
                <Link2 className="w-2.5 h-2.5" />
                <span>{s.name || s}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-300 shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;

