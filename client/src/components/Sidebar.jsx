import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderSearch, 
  Sparkles, 
  MessageSquareCode, 
  Settings,
  ChevronLeft
} from 'lucide-react';

export function Sidebar({ project, fileCount = 0 }) {
  const { id: projectId } = useParams();

  const navItems = [
    {
      label: 'Overview',
      to: `/projects/${projectId}`,
      end: true,
      icon: LayoutDashboard
    },
    {
      label: 'Sources & Evidence',
      to: `/projects/${projectId}/files`,
      icon: FolderSearch,
      badge: fileCount
    },
    {
      label: 'AI Insights',
      to: `/projects/${projectId}/insights`,
      icon: Sparkles,
      highlight: true
    },
    {
      label: 'Multimodal Chat',
      to: `/projects/${projectId}/chat`,
      icon: MessageSquareCode
    },
    {
      label: 'Settings',
      to: `/projects/${projectId}/settings`,
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Project Header in Sidebar */}
      <div className="p-4 border-b border-slate-800/80">
        <NavLink
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </NavLink>
        <h2 className="text-sm font-semibold text-white truncate" title={project?.name}>
          {project?.name || 'Loading Project...'}
        </h2>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {project?.description || 'Multimodal Workspace'}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Unified Evidence Layer</span>
        </div>
        <span>Connected to Google Gemini Multimodal Reasoning Engine</span>
      </div>
    </aside>
  );
}

export default Sidebar;
