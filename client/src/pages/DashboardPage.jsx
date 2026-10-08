import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../context/ToastContext';
import { 
  FolderKanban, 
  Plus, 
  Sparkles, 
  Layers, 
  FileCheck2, 
  Activity, 
  Clock, 
  ArrowRight,
  Database,
  Trash2
} from 'lucide-react';

export function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New project modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/projects');
      setProjects(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Project name is required.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.post('/api/projects', {
        name: name.trim(),
        description: description.trim()
      });
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      setName('');
      setDescription('');
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/projects/seed-demo');
      toast.success('Factory Equipment Inspection demo loaded!');
      await fetchProjects();
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      toast.error('Could not load demo project: ' + err.message);
      setLoading(false);
    }
  };

  // Metrics summary
  const totalProjects = projects.length;
  const totalFiles = projects.reduce((acc, p) => acc + (p.fileCount || 0), 0);
  const totalInsights = projects.reduce((acc, p) => acc + (p.insightCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col selection:bg-[#38BDF8]/30 selection:text-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[#18224b]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Multimodal Workspaces
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Select or create a project to analyze evidence across PDF, images, audio, video, and notes.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSeedDemo}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0a0f26] hover:bg-[#121c42] text-[#38BDF8] border border-[#38BDF8]/30 transition hover:border-[#38BDF8]/60 shadow-sm cursor-pointer"
              title="Load Factory Equipment Inspection Demo dataset"
            >
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Load Factory Demo</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Analytics Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94A3B8]">Total Projects</span>
              <FolderKanban className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-[#F8FAFC] mt-2">{totalProjects}</div>
            <span className="text-[11px] text-[#94A3B8] mt-0.5 block">Isolated evidence environments</span>
          </div>

          <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94A3B8]">Indexed Sources</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-[#F8FAFC] mt-2">{totalFiles}</div>
            <span className="text-[11px] text-[#94A3B8] mt-0.5 block">Across PDF, Image, Audio, Video &amp; Notes</span>
          </div>

          <div className="p-5 rounded-2xl border border-[#18224b] bg-[#0a0f26]/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94A3B8]">AI Synthesized Insights</span>
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
            </div>
            <div className="text-2xl font-bold text-[#F8FAFC] mt-2">{totalInsights}</div>
            <span className="text-[11px] text-[#94A3B8] mt-0.5 block">Cross-modal reasonings generated</span>
          </div>
        </div>

        {/* Projects List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#F8FAFC]">Recent Projects</h2>
            <span className="text-xs text-[#94A3B8]">{projects.length} workspace(s) available</span>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving project evidence repositories..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchProjects} />
          ) : projects.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#18224b] bg-[#0a0f26]/30">
              <FolderKanban className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#F8FAFC]">No Projects Found</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-6">
                Get started by creating a new project or loading our pre-configured Turbine 4B Factory Inspection demo.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSeedDemo}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0a0f26] text-[#38BDF8] border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 transition cursor-pointer"
                >
                  Load Factory Inspection Demo
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1d4ed8] text-[#F8FAFC] transition shadow-md shadow-[#2563EB]/25 cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                        {project.fileCount || 0} Sources
                      </span>
                      <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#18224b] flex items-center justify-between text-xs text-[#94A3B8] group-hover:text-[#38BDF8] transition">
                    <span className="font-medium text-[11px]">Open Workspace</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Multimodal Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Turbine Unit 4B Forensic Inspection"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0f26] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F8FAFC] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the real-world scenario, incident, or investigation context..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0f26] border border-[#1e2c62] text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0a0f26] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1d4ed8] hover:to-[#7c3aed] text-[#F8FAFC] shadow-lg shadow-[#2563EB]/25 transition disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? 'Creating Workspace...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DashboardPage;
