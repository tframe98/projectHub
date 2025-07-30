'use client';

import { useProjectStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Trello, 
  BarChart3, 
  Calendar,
  Plus, 
  Menu,
  X,
  FolderOpen,
  Users,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const { 
    sidebarOpen, 
    toggleSidebar, 
    view, 
    setView, 
    projects, 
    currentProject, 
    setCurrentProject 
  } = useProjectStore();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as const },
    { name: 'Kanban Board', icon: Trello, view: 'kanban' as const },
    { name: 'Analytics', icon: BarChart3, view: 'analytics' as const },
    { name: 'Calendar', icon: Calendar, view: 'calendar' as const },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-surface border border-border"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 lg:p-6 border-b border-border">
            <h1 className="text-lg lg:text-xl font-bold text-primary">Project Hub</h1>
            <p className="text-xs lg:text-sm text-muted">Management Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setView(item.view)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${view === item.view 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted hover:text-accent hover:bg-muted'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Projects Section */}
            <div className="mt-6 lg:mt-8">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-sm font-semibold text-accent">Projects</h3>
                <button className="p-1 rounded-md hover:bg-muted">
                  <Plus size={16} className="text-muted" />
                </button>
              </div>
              
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setCurrentProject(project)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
                      ${currentProject?.id === project.id 
                        ? 'bg-muted text-accent' 
                        : 'text-muted hover:text-accent hover:bg-muted'
                      }
                    `}
                  >
                    <FolderOpen size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{project.name}</p>
                      <p className="text-xs text-muted truncate">
                        {project.tasks.length} tasks
                      </p>
                    </div>
                    <div className={`
                      w-2 h-2 rounded-full flex-shrink-0
                      ${project.status === 'active' ? 'bg-green-500' : 
                        project.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}
                    `} />
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <button 
                onClick={() => setView('team')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  view === 'team' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted hover:text-accent hover:bg-muted'
                }`}
              >
                <Users size={18} />
                <span>Team</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-accent hover:bg-muted">
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 