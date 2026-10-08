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
    <aside className="w-64 shrink-0 border-r border-[#18224b] bg-[#050816]/95 backdrop-blur-md flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Project Header in Sidebar */}
      <div className="p-4 border-b border-[#18224b]">
        <NavLink
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#38BDF8] transition mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </NavLink>
        <h2 className="text-sm font-semibold text-[#F8FAFC] truncate" title={project?.name}>
          {project?.name || 'Loading Project...'}
        </h2>
        <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
          {project?.description || 'Multimodal Workspace'}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] text-[#F8FAFC] shadow-md shadow-[#2563EB]/25 font-semibold'
                    : 'text-[#94A3B8] hover:bg-[#0a0f26] hover:text-[#F8FAFC]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-[#F8FAFC]'
                          : item.highlight
                          ? 'text-[#38BDF8]'
                          : 'text-[#94A3B8]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-[#F8FAFC]'
                          : 'bg-[#0a0f26] text-[#38BDF8] border border-[#18224b]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-[#18224b] text-[11px] text-[#94A3B8]">
        <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC] mb-1">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
          <span>Unified Evidence Layer</span>
        </div>
        <span className="text-[10px] text-[#94A3B8]">Connected to Google Gemini AI Engine</span>
      </div>
    </aside>
  );
}

export default Sidebar;
