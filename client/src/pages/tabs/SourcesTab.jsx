import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import FileCard from '../../components/FileCard';
import Modal from '../../components/Modal';
import SourceBadge from '../../components/SourceBadge';
import { useToast } from '../../context/ToastContext';
import { Plus, FileCode, Eye, Download, FileText } from 'lucide-react';

export function SourcesTab({ 
  files = [], 
  notes = [], 
  onUploadFile, 
  onDeleteFile, 
  onCreateNote, 
  isUploading 
}) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Preview modal state
  const [previewFile, setPreviewFile] = useState(null);

  const toast = useToast();

  const handleCreateNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      toast.warning('Please enter note content.');
      return;
    }

    setIsSavingNote(true);
    try {
      await onCreateNote(noteContent.trim());
      toast.success('Technician field note added to evidence layer.');
      setNoteContent('');
      setIsNoteModalOpen(false);
    } catch (err) {
      toast.error('Failed to save note: ' + err.message);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#18224b]">
        <div>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Unified Evidence Sources</h2>
          <p className="text-xs text-[#94A3B8]">
            Ingest documents, photos, audio logs, videos, or technician observations.
          </p>
        </div>

        <button
          onClick={() => setIsNoteModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0a0f26] hover:bg-[#121c42] text-[#F8FAFC] border border-[#18224b] transition cursor-pointer"
        >
          <FileCode className="w-4 h-4 text-[#38BDF8]" />
          <span>Add Technician Note</span>
        </button>
      </div>

      {/* Upload Zone */}
      <FileUploader onUpload={onUploadFile} isUploading={isUploading} />

      {/* Uploaded Sources Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">
            Repository Evidence ({files.length} Files, {notes.length} Field Notes)
          </h3>
        </div>

        {files.length === 0 && notes.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#18224b] bg-[#0a0f26]/30 text-[#94A3B8] text-xs">
            No evidence sources uploaded yet. Drag and drop files above or add a field note.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Files List */}
            {files.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={(f) => setPreviewFile(f)}
                    onDelete={onDeleteFile}
                  />
                ))}
              </div>
            )}

            {/* User Field Notes */}
            {notes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
                  Field &amp; Emergency Notes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl border border-[#38BDF8]/25 bg-[#0a0f26]/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <SourceBadge modality="text" size="xs" />
                          <span className="text-[10px] text-[#94A3B8]">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#F8FAFC]/90 whitespace-pre-wrap font-mono leading-relaxed bg-[#050816] p-2.5 rounded-lg border border-[#18224b]">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Field Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Technician Evidence Note"
      >
        <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
              Field Log / Observation Note *
            </label>
            <textarea
              rows={5}
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Technician observed heavy 1800 RPM vibration. Found bronze shavings in secondary filter basket..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050816] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] font-mono transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingNote}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-md shadow-[#2563EB]/25 transition disabled:opacity-50 cursor-pointer"
            >
              {isSavingNote ? 'Saving...' : 'Add to Evidence Layer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* File Evidence Inspection Modal */}
      <Modal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        title={previewFile ? `Evidence Inspection: ${previewFile.original_name}` : 'Evidence Details'}
        maxWidth="max-w-2xl"
      >
        {previewFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#18224b]">
              <SourceBadge modality={previewFile.modality} size="md" />
              <span className="text-xs text-[#94A3B8]">
                Status: <strong className="text-emerald-400">{previewFile.processing_status}</strong>
              </span>
            </div>

            {/* AI Summary */}
            {previewFile.ai_summary && (
              <div>
                <h5 className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-1">
                  Multimodal AI Analysis
                </h5>
                <div className="p-3 rounded-xl bg-[#0a0f26] border border-[#8B5CF6]/30 text-xs text-[#F8FAFC]/90 leading-relaxed">
                  {previewFile.ai_summary}
                </div>
              </div>
            )}

            {/* Extracted Raw Content */}
            {previewFile.extracted_text && (
              <div>
                <h5 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Extracted Content / Transcript / Timeline
                </h5>
                <pre className="p-3.5 rounded-xl bg-[#050816] border border-[#18224b] text-xs text-[#38BDF8] font-mono overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
                  {previewFile.extracted_text}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0a0f26] text-[#F8FAFC] border border-[#18224b] hover:bg-[#121c42] transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SourcesTab;
