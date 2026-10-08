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
        <h2 className="text-lg font-bold text-[#F8FAFC]">Project Settings</h2>
        <p className="text-xs text-[#94A3B8]">
          Manage workspace metadata and lifecycle.
        </p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70 space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
            Project Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#050816] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#050816] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-md shadow-[#2563EB]/25 transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-950/15 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-xs text-[#94A3B8]">
          Permanently delete this project, along with all uploaded evidence files, notes, AI insights, and chat history.
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>{isDeleting ? 'Deleting...' : 'Delete Project Workspace'}</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsTab;
