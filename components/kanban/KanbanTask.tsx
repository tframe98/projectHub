'use client';

import { MoreVertical, Calendar, User } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  projectId: string;
  projectName: string;
}

interface KanbanTaskProps {
  task: Task;
  onDragStart: (taskId: string, projectId: string) => void;
  onDragEnd: () => void;
}

export default function KanbanTask({ task, onDragStart, onDragEnd }: KanbanTaskProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart(task.id, task.projectId);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="bg-background border border-border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-accent text-sm line-clamp-2">
          {task.title}
        </h4>
        <button className="p-1 hover:bg-muted rounded flex-shrink-0">
          <MoreVertical size={14} className="text-muted" />
        </button>
      </div>

      <p className="text-xs text-muted mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          <span className="text-xs text-muted capitalize">
            {task.priority}
          </span>
        </div>
        <span className="text-xs text-muted">
          {task.projectName}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <User size={12} className="text-muted" />
          <span className="text-xs text-muted truncate">
            {task.assignee}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Calendar size={12} className="text-muted" />
          <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-muted'}`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
} 