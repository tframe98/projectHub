'use client';

import { useProjectStore } from '@/lib/store';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
  const inProgressTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'in-progress').length, 0
  );
  const todoTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'todo').length, 0
  );
  const reviewTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'review').length, 0
  );
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Project progress data
  const projectProgress = projects.map(project => ({
    name: project.name,
    progress: project.progress,
    status: project.status,
    tasks: project.tasks.length,
    completed: project.tasks.filter(t => t.status === 'done').length
  }));

  // Task distribution data
  const taskDistribution = [
    { status: 'To Do', count: todoTasks, color: 'bg-muted', icon: Clock },
    { status: 'In Progress', count: inProgressTasks, color: 'bg-primary', icon: Activity },
    { status: 'Review', count: reviewTasks, color: 'bg-yellow-500', icon: AlertCircle },
    { status: 'Done', count: completedTasks, color: 'bg-green-500', icon: CheckCircle },
  ];

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      change: '+5%',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      change: '+15%',
      trend: 'up',
      icon: PieChart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted">
          Track your project performance and team productivity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <stat.icon size={24} className="text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
          <div className="space-y-4">
            {projectProgress.length > 0 ? (
              projectProgress.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-sm text-muted">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        project.progress >= 80 ? 'bg-green-500' : 
                        project.progress >= 50 ? 'bg-primary' : 'bg-muted'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{project.completed}/{project.tasks} tasks completed</span>
                    <span className={`px-2 py-1 rounded-full text-xs  ${
                      project.status === 'active' ? 'bg-primary/20 text-primary' :
                      project.status === 'completed' ? 'bg-green-500/20 text-slate-950' :
                      'bg-muted'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BarChart3 size={48} className="text-muted mx-auto mb-4" />
                <p className="text-muted">No projects to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
          <div className="space-y-4">
            {taskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex items-center space-x-2">
                    <item.icon size={16} className="text-muted" />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{item.count}</span>
                  <span className="text-xs text-muted">
                    ({totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
            
            {totalTasks === 0 && (
              <div className="text-center py-8">
                <PieChart size={48} className="text-muted mx-auto mb-4" />
                <p className="text-muted">No tasks to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project, index) => (
            <div key={project.id} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Project "{project.name}" was updated
                </p>
                <p className="text-xs text-muted">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-muted">
                {project.progress}% complete
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 