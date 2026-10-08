import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../context/ToastContext';

// Tabs
import OverviewTab from './tabs/OverviewTab';
import SourcesTab from './tabs/SourcesTab';
import InsightsTab from './tabs/InsightsTab';
import ChatTab from './tabs/ChatTab';
import SettingsTab from './tabs/SettingsTab';

export function ProjectWorkspace() {
  const { id: projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [insights, setInsights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Load project and all related evidence
  const loadWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projRes, filesRes, notesRes, insightsRes, convsRes] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/projects/${projectId}/files`),
        api.get(`/api/projects/${projectId}/notes`),
        api.get(`/api/projects/${projectId}/insights`),
        api.get(`/api/projects/${projectId}/conversations`)
      ]);

      setProject(projRes.data);
      setFiles(filesRes.data || []);
      setNotes(notesRes.data || []);
      setInsights(insightsRes.data || []);

      // If conversations exist, load latest messages
      const convs = convsRes.data || [];
      if (convs.length > 0) {
        setActiveConversationId(convs[0].id);
        const msgsRes = await api.get(`/api/conversations/${convs[0].id}/messages`);
        setMessages(msgsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load project workspace:', err);
      setError(err.message || 'Could not load workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadWorkspace();
    }
  }, [projectId]);

  // File upload handler
  const handleUploadFile = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      toast.info(`Ingesting "${file.name}" into multimodal evidence layer...`);

      const res = await api.post(`/api/projects/${projectId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`"${file.name}" successfully indexed!`);
      setFiles((prev) => [res.data, ...prev]);

      // Automatically offer or trigger cross-modal analysis update
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // File delete handler
  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/api/files/${fileId}`);
      toast.success('Evidence source removed.');
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      toast.error('Failed to delete file: ' + err.message);
    }
  };

  // Note create handler
  const handleCreateNote = async (content) => {
    const res = await api.post(`/api/projects/${projectId}/notes`, { content });
    setNotes((prev) => [res.data, ...prev]);
  };

  // Execute cross-modal reasoning
  const handleRunAnalysis = async (focusQuery = '') => {
    setIsAnalyzing(true);
    try {
      toast.info('Synthesizing cross-modal evidence with Gemini reasoning engine...');
      const res = await api.post(`/api/projects/${projectId}/analyze`, { focusQuery });
      setInsights((prev) => [res.data, ...prev]);
      toast.success('Cross-modal reasoning completed! Inspect findings below.');
      navigate(`/projects/${projectId}/insights`);
    } catch (err) {
      toast.error('Cross-modal analysis failed: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send chat message
  const handleSendMessage = async (text) => {
    setIsSendingChat(true);
    // Optimistic UI update
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/api/projects/${projectId}/chat`, {
        message: text,
        conversationId: activeConversationId
      });

      setActiveConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.data.userMessage,
        res.data.assistantMessage
      ]);
    } catch (err) {
      toast.error('Chat error: ' + err.message);
      // Remove temporary message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsSendingChat(false);
    }
  };

  // Project update
  const handleUpdateProject = async (updates) => {
    const res = await api.put(`/api/projects/${projectId}`, updates);
    setProject(res.data);
  };

  // Project delete
  const handleDeleteProject = async () => {
    await api.delete(`/api/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading Multimodal Evidence Workspace..." />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorState message={error || 'Project not found.'} onRetry={loadWorkspace} />
        </div>
      </div>
    );
  }

  // Determine active tab from URL pathname
  const path = location.pathname;
  let activeTabComponent = null;

  if (path.endsWith('/files')) {
    activeTabComponent = (
      <SourcesTab
        files={files}
        notes={notes}
        onUploadFile={handleUploadFile}
        onDeleteFile={handleDeleteFile}
        onCreateNote={handleCreateNote}
        isUploading={isUploading}
      />
    );
  } else if (path.endsWith('/insights')) {
    activeTabComponent = (
      <InsightsTab
        insights={insights}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
        hasEvidence={files.length > 0 || notes.length > 0}
      />
    );
  } else if (path.endsWith('/chat')) {
    activeTabComponent = (
      <ChatTab
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={isSendingChat}
        files={files}
      />
    );
  } else if (path.endsWith('/settings')) {
    activeTabComponent = (
      <SettingsTab
        project={project}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    );
  } else {
    activeTabComponent = (
      <OverviewTab
        project={project}
        files={files}
        insights={insights}
        onRunAnalysis={() => handleRunAnalysis()}
        isAnalyzing={isAnalyzing}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Workspace Sidebar */}
        <Sidebar project={project} fileCount={files.length + notes.length} />

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTabComponent}
        </main>
      </div>
    </div>
  );
}

export default ProjectWorkspace;
