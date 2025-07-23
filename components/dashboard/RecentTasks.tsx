'use client';

import { useProjectStore } from '@/lib/store';
import { Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react';

export default function RecentTasks() {
  const { projects } = useProjectStore();

  // Get all tasks from all projects and sort by creation date
  const allTasks = projects
    .flatMap(project => project.tasks.map(task => ({ ...task, projectName: project.name })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'review':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Circle size={16} className="text-muted" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-accent">Recent Tasks</h2>
        <button className="text-sm text-primary hover:text-primary/80">
          View All
        </button>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {allTasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(task.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-accent truncate">
                    {task.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted truncate">
                    {task.projectName}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted truncate">
                    {task.assignee}
                  </span>
                  <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-muted'}`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {allTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No recent tasks</p>
        </div>
      )}
    </div>
  );
} 