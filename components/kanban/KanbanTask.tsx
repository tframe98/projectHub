'use client';

import { Calendar, User, MoreVertical } from 'lucide-react';

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
    console.log('Task drag start:', task.id, task.projectId);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id, task.projectId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Task drag end');
    e.preventDefault();
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-all cursor-move hover:border-primary/50"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm line-clamp-2 flex-1">
          {task.title}
        </h4>
        <button 
          className="p-1 hover:bg-muted rounded ml-2"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={12} className="text-muted" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-muted mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          <span className="text-xs text-muted">{task.priority}</span>
        </div>

        <div className="flex items-center space-x-1">
          <User size={12} className="text-muted" />
          <span className="text-xs text-muted truncate max-w-16">
            {task.assignee}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-1">
          <Calendar size={12} className="text-muted" />
          <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-muted'}`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>

        <span className="text-xs text-muted truncate max-w-20">
          {task.projectName}
        </span>
      </div>
    </div>
  );
} 