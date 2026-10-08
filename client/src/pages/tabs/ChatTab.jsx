import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import Modal from '../../components/Modal';
import SourceBadge from '../../components/SourceBadge';
import { Brain, MessageSquareCode, Sparkles } from 'lucide-react';

export function ChatTab({ 
  messages = [], 
  onSendMessage, 
  isSending, 
  files = [] 
}) {
  const [selectedSource, setSelectedSource] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSourceClick = (sourceRef) => {
    const sName = typeof sourceRef === 'string' ? sourceRef : sourceRef?.name;
    const file = files.find(f => f.original_name.toLowerCase() === sName?.toLowerCase());
    if (file) {
      setSelectedSource(file);
    } else {
      setSelectedSource({
        original_name: sName,
        modality: sourceRef?.type || 'document',
        ai_summary: `Source citation extracted from multimodal cross-modal reasoning.`,
        extracted_text: `Direct evidence record for ${sName}.`
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] min-h-[480px]">
      {/* Chat Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Cross-Modal Forensic Assistant</h2>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Indexed to {files.length} project source(s)</span>
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-12 px-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">Ask Cross-Modal Inquiries</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              OmniMind AI synthesizes text, images, PDF documents, audio logs, and videos. Ask questions using the reasoning prompts below.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={msg.id || index}
              message={msg}
              onSourceClick={handleSourceClick}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-2 border-t border-slate-800">
        <ChatInput onSend={onSendMessage} isLoading={isSending} />
      </div>

      {/* Source Citation Preview Modal */}
      <Modal
        isOpen={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
        title={selectedSource ? `Evidence Citation: ${selectedSource.original_name}` : 'Source'}
      >
        {selectedSource && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <SourceBadge modality={selectedSource.modality} size="sm" />
              <span className="text-xs font-mono text-slate-400">{selectedSource.original_name}</span>
            </div>

            {selectedSource.ai_summary && (
              <div>
                <h5 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  AI Summary
                </h5>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedSource.ai_summary}
                </p>
              </div>
            )}

            {selectedSource.extracted_text && (
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Extracted Evidence
                </h5>
                <pre className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {selectedSource.extracted_text}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ChatTab;

