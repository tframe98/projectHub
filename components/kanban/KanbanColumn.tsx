'use client';

import { Plus, MoreVertical } from 'lucide-react';
import KanbanTask from './KanbanTask';

interface Column {
  id: string;
  title: string;
  color: string;
}

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

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (taskId: string, projectId: string) => void;
  onDragEnd: () => void;
  onDrop: (status: string) => void;
}

export default function KanbanColumn({ 
  column, 
  tasks, 
  onDragStart, 
  onDragEnd, 
  onDrop 
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(column.id);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-surface border border-border rounded-lg">
        {/* Column Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-accent">{column.title}</h3>
              <span className="bg-muted text-muted text-xs px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-muted rounded">
                <Plus size={16} className="text-muted" />
              </button>
              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical size={16} className="text-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Column Content */}
        <div 
          className="p-4 min-h-[500px]"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted text-sm">No tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 