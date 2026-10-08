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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">Unified Evidence Sources</h2>
          <p className="text-xs text-slate-400">
            Ingest documents, photos, audio logs, videos, or technician observations.
          </p>
        </div>

        <button
          onClick={() => setIsNoteModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <FileCode className="w-4 h-4 text-sky-400" />
          <span>Add Technician Note</span>
        </button>
      </div>

      {/* Upload Zone */}
      <FileUploader onUpload={onUploadFile} isUploading={isUploading} />

      {/* Uploaded Sources Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">
            Repository Evidence ({files.length} Files, {notes.length} Field Notes)
          </h3>
        </div>

        {files.length === 0 && notes.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-slate-500 text-xs">
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Field &amp; Emergency Notes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl border border-sky-500/20 bg-sky-950/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <SourceBadge modality="text" size="xs" />
                          <span className="text-[10px] text-slate-500">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Field Log / Observation Note *
            </label>
            <textarea
              rows={5}
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Technician observed heavy 1800 RPM vibration. Found bronze shavings in secondary filter basket..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingNote}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition disabled:opacity-50"
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
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <SourceBadge modality={previewFile.modality} size="md" />
              <span className="text-xs text-slate-400">
                Status: <strong className="text-emerald-400">{previewFile.processing_status}</strong>
              </span>
            </div>

            {/* AI Summary */}
            {previewFile.ai_summary && (
              <div>
                <h5 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Multimodal AI Analysis
                </h5>
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed">
                  {previewFile.ai_summary}
                </div>
              </div>
            )}

            {/* Extracted Raw Content */}
            {previewFile.extracted_text && (
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Extracted Content / Transcript / Timeline
                </h5>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
                  {previewFile.extracted_text}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition"
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
