'use client';

import { useProjectStore } from '@/lib/store';
import { Plus, MoreVertical } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import { useState } from 'react';

export default function KanbanBoard() {
  const { projects, currentProject } = useProjectStore();
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; projectId: string } | null>(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' },
  ];

  // Get tasks from current project or all projects
  const displayProjects = currentProject ? [currentProject] : projects;
  const allTasks = displayProjects.flatMap(project => 
    project.tasks.map(task => ({ ...task, projectId: project.id, projectName: project.name }))
  );

  const handleDragStart = (taskId: string, projectId: string) => {
    setDraggedTask({ taskId, projectId });
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (status: string) => {
    if (draggedTask) {
      // Update task status in store
      // This would be implemented with the actual store update
      console.log(`Moving task ${draggedTask.taskId} to ${status}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent">Kanban Board</h1>
        <p className="text-muted">
          {currentProject ? `Managing tasks for ${currentProject.name}` : 'Manage all project tasks'}
        </p>
      </div>

      {/* Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = allTasks.filter(task => task.status === column.id);
          
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-accent mb-4">Board Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {columns.map((column) => {
            const count = allTasks.filter(task => task.status === column.id).length;
            return (
              <div key={column.id} className="text-center">
                <div className={`w-3 h-3 rounded-full ${column.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-accent">{count}</p>
                <p className="text-sm text-muted">{column.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 