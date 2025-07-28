'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, GripVertical, Edit2, X } from 'lucide-react';
import KanbanTask from './KanbanTask';
import { useProjectStore } from '@/lib/store';

interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
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
  isDragging: boolean;
  onColumnDragStart?: (columnId: string) => void;
  onColumnDragEnd?: () => void;
  onColumnDrop?: (draggedColumnId: string, targetColumnId: string) => void;
  isColumnDragging?: boolean;
}

export default function KanbanColumn({ 
  column, 
  tasks, 
  onDragStart, 
  onDragEnd, 
  onDrop,
  isDragging,
  onColumnDragStart,
  onColumnDragEnd,
  onColumnDrop,
  isColumnDragging
}: KanbanColumnProps) {
  const { updateColumn, deleteColumn, currentProject } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Column drop:', column.id);
    onDrop(column.id);
  };

  const handleColumnDragStart = (e: React.DragEvent) => {
    if (onColumnDragStart) {
      e.dataTransfer.setData('text/plain', column.id);
      e.dataTransfer.effectAllowed = 'move';
      onColumnDragStart(column.id);
    }
  };

  const handleColumnDragEnd = (e: React.DragEvent) => {
    if (onColumnDragEnd) {
      e.preventDefault();
      onColumnDragEnd();
    }
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    if (onColumnDrop) {
      e.preventDefault();
      e.stopPropagation();
      const draggedColumnId = e.dataTransfer.getData('text/plain');
      if (draggedColumnId !== column.id) {
        onColumnDrop(draggedColumnId, column.id);
      }
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditTitle(column.title);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    if (editTitle.trim() && currentProject) {
      updateColumn(currentProject.id, column.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (currentProject && tasks.length === 0) {
      deleteColumn(currentProject.id, column.id);
    }
    setShowMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div 
      className={`flex-shrink-0 w-80 transition-all ${
        isColumnDragging ? 'opacity-50' : ''
      }`}
      draggable={!!onColumnDragStart}
      onDragStart={handleColumnDragStart}
      onDragEnd={handleColumnDragEnd}
      onDragOver={handleColumnDrop}
      onDrop={handleColumnDrop}
    >
      <div className={`bg-surface border border-border rounded-lg transition-colors ${
        isDragging ? 'border-primary/50 bg-primary/5' : ''
      }`}>
        {/* Column Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              {onColumnDragStart && (
                <div className="cursor-move text-muted hover:text-accent">
                  <GripVertical size={16} />
                </div>
              )}
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleEditSave}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-background border border-primary rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <h3 
                  className="font-semibold flex-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={handleEditStart}
                  title="Click to edit column name"
                >
                  {column.title}
                </h3>
              )}
              
              <span className="bg-muted text-muted text-xs px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 relative">
              <button 
                className="p-1 hover:bg-muted rounded"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={16} className="text-muted" />
              </button>
              
              {/* Column Menu */}
              {showMenu && (
                <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 min-w-32" ref={menuRef}>
                  <div className="py-1">
                    <button
                      onClick={handleEditStart}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Edit2 size={14} />
                      <span>Rename</span>
                    </button>
                    {tasks.length === 0 && (
                      <button
                        onClick={handleDelete}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <X size={14} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column Content */}
        <div 
          className={`p-4 min-h-[500px] transition-colors ${
            isDragging ? 'bg-primary/5' : ''
          }`}
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
              <p className="text-muted text-sm">
                {isDragging ? 'Drop task here' : 'No tasks'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 