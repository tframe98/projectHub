'use client';

import { Project } from '@/lib/store';
import { Calendar, Users, MoreVertical } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'on-hold':
        return 'On Hold';
      default:
        return status;
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-sm lg:text-base truncate">{project.name}</h3>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(project.status)}`} />
          </div>
          
          <p className="text-xs lg:text-sm text-muted mb-3 line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3 text-xs text-muted">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={12} />
                <span>{project.tasks.length} tasks</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted">
                {getStatusText(project.status)}
              </span>
              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 lg:mt-4">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
} 