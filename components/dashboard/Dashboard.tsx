'use client';

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

export default function Dashboard() {
  const { projects, currentProject } = useProjectStore();

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

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-accent">Dashboard</h1>
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
              <h2 className="text-base lg:text-lg font-semibold text-accent">
                {currentProject ? 'Current Project' : 'Recent Projects'}
              </h2>
              <button className="text-sm text-primary hover:text-primary/80">
                View All
              </button>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              {displayProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
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
        <h2 className="text-base lg:text-lg font-semibold text-accent mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          <button className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <Plus className="text-primary" size={20} />
            <span className="text-xs lg:text-sm font-medium text-accent">New Project</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <CheckCircle className="text-primary" size={20} />
            <span className="text-xs lg:text-sm font-medium text-accent">New Task</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <Users className="text-primary" size={20} />
            <span className="text-xs lg:text-sm font-medium text-accent">Add Team</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-3 lg:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <Calendar className="text-primary" size={20} />
            <span className="text-xs lg:text-sm font-medium text-accent">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
} 