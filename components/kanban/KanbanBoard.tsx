'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/store';
import { Plus, MoreVertical } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import Modal from '../ui/Modal';
import ColumnForm from '../ui/ColumnForm';

export default function KanbanBoard() {
  const { projects, currentProject, moveTask, reorderColumns } = useProjectStore();
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; projectId: string } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when currentProject changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentProject]);

  // Get tasks from current project or all projects
  const displayProjects = currentProject ? [currentProject] : projects;
  const allTasks = displayProjects.flatMap(project => 
    project.tasks.map(task => ({ ...task, projectId: project.id, projectName: project.name }))
  );

  // Get columns from current project or use default columns
  const columns = currentProject 
    ? currentProject.columns.sort((a, b) => a.order - b.order)
    : [
        { id: 'todo', title: 'To Do', color: 'bg-muted', order: 0 },
        { id: 'in-progress', title: 'In Progress', color: 'bg-primary', order: 1 },
        { id: 'review', title: 'Review', color: 'bg-muted', order: 2 },
        { id: 'done', title: 'Done', color: 'bg-primary', order: 3 },
      ];

  const handleDragStart = (taskId: string, projectId: string) => {
    console.log('Drag start:', taskId, projectId);
    setDraggedTask({ taskId, projectId });
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setDraggedTask(null);
  };

  const handleDrop = (status: string) => {
    console.log('Drop:', status, draggedTask);
    if (draggedTask) {
      moveTask(draggedTask.projectId, draggedTask.taskId, status);
      setDraggedTask(null);
    }
  };

  const handleColumnDragStart = (columnId: string) => {
    console.log('Column drag start:', columnId);
    setDraggedColumn(columnId);
  };

  const handleColumnDragEnd = () => {
    console.log('Column drag end');
    setDraggedColumn(null);
  };

  const handleColumnDrop = (draggedColumnId: string) => {
    console.log('Column drop:', draggedColumnId);
    if (draggedColumnId && currentProject) {
      // Get the current column order
      const currentOrder = columns.map(col => col.id);
      
      // Find the index of the dropped column
      const droppedIndex = currentOrder.indexOf(draggedColumnId);
      
      // Remove the dragged column from its current position
      const newOrder = currentOrder.filter(id => id !== draggedColumnId);
      
      // Insert the dragged column at the new position
      // For now, we'll just move it to the end, but you could implement more complex logic
      newOrder.push(draggedColumnId);
      
      console.log('Reordering columns:', newOrder);
      reorderColumns(currentProject.id, newOrder);
    }
  };

  const handleColumnReorder = (draggedColumnId: string, targetColumnId: string) => {
    console.log('Column reorder:', draggedColumnId, '->', targetColumnId);
    if (draggedColumnId && targetColumnId && currentProject && draggedColumnId !== targetColumnId) {
      // Get the current column order
      const currentOrder = columns.map(col => col.id);
      
      // Find the indices
      const draggedIndex = currentOrder.indexOf(draggedColumnId);
      const targetIndex = currentOrder.indexOf(targetColumnId);
      
      // Remove the dragged column
      const newOrder = currentOrder.filter(id => id !== draggedColumnId);
      
      // Insert at the target position
      newOrder.splice(targetIndex, 0, draggedColumnId);
      
      console.log('Reordering columns:', newOrder);
      reorderColumns(currentProject.id, newOrder);
    }
  };

  const handleColumnAdded = () => {
    setShowColumnModal(false);
    // Force a re-render
    setForceUpdate(prev => prev + 1);
  };

  console.log('KanbanBoard render:', { 
    currentProject: currentProject?.name, 
    columns: columns.length, 
    tasks: allTasks.length,
    forceUpdate 
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-muted">
            {currentProject ? `Managing tasks for ${currentProject.name}` : 'Manage all project tasks'}
          </p>
          {currentProject && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Project:</strong> {currentProject.name}
              </p>
              <p className="text-sm text-muted">
                {currentProject.description}
              </p>
              <p className="text-sm text-muted">
                Columns: {currentProject.columns.length}
              </p>
            </div>
          )}
        </div>

        {/* Board */}
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnTasks = allTasks.filter(task => task.status === column.id);
            console.log(`Column ${column.title}:`, columnTasks.length, 'tasks');
            
            return (
              <KanbanColumn
                key={`${column.id}-${forceUpdate}`}
                column={column}
                tasks={columnTasks}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                isDragging={!!draggedTask}
                onColumnDragStart={currentProject ? handleColumnDragStart : undefined}
                onColumnDragEnd={currentProject ? handleColumnDragEnd : undefined}
                onColumnDrop={currentProject ? handleColumnReorder : undefined}
                isColumnDragging={draggedColumn === column.id}
              />
            );
          })}

          {/* Add Column Button */}
          {currentProject && (
            <div className="flex-shrink-0 w-80">
              <div className="bg-surface border-2 border-dashed border-border rounded-lg h-full min-h-[500px] flex items-center justify-center">
                <button
                  onClick={() => setShowColumnModal(true)}
                  className="flex flex-col items-center space-y-2 p-6 text-muted hover:text-accent transition-colors"
                >
                  <Plus size={24} />
                  <span className="text-sm font-medium">Add Column</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Board Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {columns.map((column) => {
              const count = allTasks.filter(task => task.status === column.id).length;
              return (
                <div key={column.id} className="text-center">
                  <div className={`w-3 h-3 rounded-full ${column.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted">{column.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Column Modal */}
      {currentProject && (
        <Modal
          isOpen={showColumnModal}
          onClose={() => setShowColumnModal(false)}
          title="Add New Column"
        >
          <ColumnForm 
            onClose={handleColumnAdded} 
            projectId={currentProject.id}
          />
        </Modal>
      )}
    </>
  );
} 