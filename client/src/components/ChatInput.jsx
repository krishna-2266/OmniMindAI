import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

const SUGGESTIONS = [
  'Summarize everything across all formats.',
  'What are the most critical findings?',
  'Are there contradictions between the sources?',
  'Which sources support the failure conclusion?',
  'What immediate actions should the team take?'
];

export function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleSuggestion = (prompt) => {
    if (isLoading) return;
    onSend(prompt);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-[#94A3B8] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#38BDF8]" />
          <span>Reasoning Prompts:</span>
        </span>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSuggestion(s)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#0a0f26] border border-[#18224b] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 hover:bg-[#121c42] transition disabled:opacity-50 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question across all project sources (documents, images, audio, video)..."
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#0a0f26] border border-[#18224b] text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition shadow-inner disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] transition disabled:opacity-40 shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
