'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Users,
  Target,
  Activity,
  Plus
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import RecentTasks from './RecentTasks';
import StatsCard from './StatsCard';
import Modal from '../ui/Modal';
import ProjectForm from '../ui/ProjectForm';
import TaskForm from '../ui/TaskForm';

export default function Dashboard() {
  const { projects, currentProject, setCurrentProject, setView } = useProjectStore();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Calculate overall stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'done').length, 0
  );
  const overdueTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today && t.status !== 'done';
    }).length, 0
  );

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: CheckCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((completedTasks / totalTasks) * 100)}%`,
      icon: TrendingUp,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const displayProjects = currentProject ? [currentProject] : projects;

  const handleProjectClick = (project: any) => {
    setCurrentProject(project);
    setView('kanban');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'project':
        setShowProjectModal(true);
        break;
      case 'task':
        setShowTaskModal(true);
        break;
      case 'team':
        // TODO: Implement team management
        console.log('Team management coming soon');
        break;
      case 'schedule':
        // TODO: Implement scheduling
        console.log('Scheduling coming soon');
        break;
    }
  };

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Dashboard</h1>
          <p className="text-sm lg:text-base text-muted">
            Welcome back! Here&apos;s an overview of your projects and tasks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Alerts */}
        {overdueTasks > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-red-500">Overdue Tasks</h3>
                <p className="text-sm text-muted">
                  You have {overdueTasks} overdue tasks that need attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Projects List */}
          <div className="xl:col-span-2">
            <div className="bg-surface border border-border rounded-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-base lg:text-lg font-semibold">
                  {currentProject ? 'Current Project' : 'Recent Projects'}
                </h2>
                <button 
                  className="text-sm text-primary hover:text-primary/80"
                  onClick={() => setView('kanban')}
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                {displayProjects.slice(0, 3).map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => handleProjectClick(project)}
                    className="cursor-pointer"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="xl:col-span-1">
            <RecentTasks />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border rounded-lg p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
            <button 
              onClick={() => handleQuickAction('project')}
              className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Plus size={20} />
              <span className="text-xs lg:text-sm font-medium">New Project</span>
            </button>
            <button 
              onClick={() => handleQuickAction('task')}
              className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <CheckCircle size={20} />
              <span className="text-xs lg:text-sm font-medium">New Task</span>
            </button>
            <button 
              onClick={() => handleQuickAction('team')}
              className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Users size={20} />
              <span className="text-xs lg:text-sm font-medium">Add Team</span>
            </button>
            <button 
              onClick={() => handleQuickAction('schedule')}
              className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Calendar size={20} />
              <span className="text-xs lg:text-sm font-medium">Schedule</span>
            </button>
          </div>
        </div>
      </div>

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