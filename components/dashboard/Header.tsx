'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Plus,
  Filter
} from 'lucide-react';
import Modal from '../ui/Modal';
import ProjectForm from '../ui/ProjectForm';
import TaskForm from '../ui/TaskForm';

export default function Header() {
  const { currentProject } = useProjectStore();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <>
      <header className="bg-surface border-b border-border px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-base lg:text-lg font-semibold">
                {currentProject ? currentProject.name : 'All Projects'}
              </h2>
              {currentProject && (
                <p className="text-xs lg:text-sm text-muted">
                  {currentProject.tasks.length} tasks • {currentProject.progress}% complete
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {/* Filter */}
              <button className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors">
                <Filter size={18} className="text-muted" />
              </button>

              {/* Add New - Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Plus size={16} />
                  <span className="font-medium">New</span>
                  <ChevronDown size={14} />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      New Project
                    </button>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      New Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors">
                <Bell size={18} className="text-muted" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-foreground" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted">Project Manager</p>
                </div>
                <ChevronDown size={16} className="text-muted" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Create New Project"
      >
        <ProjectForm onClose={() => setShowProjectModal(false)} />
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create New Task"
      >
        <TaskForm 
          onClose={() => setShowTaskModal(false)} 
          projectId={currentProject?.id}
        />
      </Modal>
    </>
  );
} 