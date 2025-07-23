'use client';

import { useProjectStore } from '@/lib/store';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  Target,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Analytics() {
  const { projects } = useProjectStore();

  // Calculate analytics data
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
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

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  const metrics = [
    {
      title: 'Total Projects',
      value: totalProjects,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks,
      change: '-3%',
      trend: 'down',
      icon: Clock,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  const projectPerformance = projects.map(project => ({
    name: project.name,
    progress: project.progress,
    tasks: project.tasks.length,
    completed: project.tasks.filter(t => t.status === 'done').length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent">Analytics</h1>
        <p className="text-muted">
          Track your project performance and team productivity
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{metric.title}</p>
                <p className="text-2xl font-bold text-accent mt-1">{metric.value}</p>
                <div className="flex items-center space-x-1 mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={metric.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-accent mb-4">Project Progress</h2>
          <div className="space-y-4">
            {projectPerformance.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-accent">{project.name}</span>
                  <span className="text-sm text-muted">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{project.completed}/{project.tasks} tasks completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-accent mb-4">Task Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                <span className="text-sm font-medium text-accent">To Do</span>
              </div>
              <span className="text-sm font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'todo').length, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-accent">In Progress</span>
              </div>
              <span className="text-sm font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'in-progress').length, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium text-accent">Review</span>
              </div>
              <span className="text-sm font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'review').length, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-accent">Done</span>
              </div>
              <span className="text-sm font-bold text-accent">
                {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'done').length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-accent mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-accent">{completionRate}%</p>
            <p className="text-sm text-muted">Task Completion</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-accent">{averageProgress}%</p>
            <p className="text-sm text-muted">Average Progress</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="text-purple-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-accent">{activeProjects}</p>
            <p className="text-sm text-muted">Active Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
} 