import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Trash2, Save, AlertTriangle } from 'lucide-react';

export function SettingsTab({ project, onUpdateProject, onDeleteProject }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Project name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProject({ name: name.trim(), description: description.trim() });
      toast.success('Project details updated successfully.');
    } catch (err) {
      toast.error('Failed to update project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this project and all its evidence?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteProject();
      toast.success('Project deleted.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete project: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-bold text-white">Project Settings</h2>
        <p className="text-xs text-slate-400">
          Manage workspace metadata and lifecycle.
        </p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Project Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-xs text-slate-400">
          Permanently delete this project, along with all uploaded evidence files, notes, AI insights, and chat history.
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>{isDeleting ? 'Deleting...' : 'Delete Project Workspace'}</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsTab;

