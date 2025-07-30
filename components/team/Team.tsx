'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { Users, Plus, Mail, Building, Crown, User, Eye, Trash2, Edit } from 'lucide-react';
import Modal from '../ui/Modal';
import TeamForm from '../ui/TeamForm';

export default function Team() {
  const { projects, addTeamMember, updateTeamMember, deleteTeamMember } = useProjectStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Get all team members from all projects
  const allTeamMembers = projects.flatMap(project => 
    project.teamMembers.map(member => ({
      ...member,
      projectName: project.name,
      projectId: project.id
    }))
  );

  // Filter by project if selected
  const filteredMembers = selectedProject === 'all' 
    ? allTeamMembers 
    : allTeamMembers.filter(member => member.projectId === selectedProject);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} className="text-yellow-500" />;
      case 'member':
        return <User size={16} className="text-blue-500" />;
      case 'viewer':
        return <Eye size={16} className="text-gray-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'member':
        return 'bg-blue-500 text-white border-blue-600';
      case 'viewer':
        return 'bg-gray-500 text-white border-gray-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleDeleteMember = (projectId: string, memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMember(projectId, memberId);
    }
  };

  const handleAddMember = (memberData: any) => {
    const projectId = selectedProject === 'all' ? projects[0]?.id || 'general' : selectedProject;
    addTeamMember(projectId, memberData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted">
            Manage team members across all projects.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users size={20} className="text-primary" />
            <div>
              <p className="text-sm text-muted">Total Members</p>
              <p className="text-2xl font-bold">{allTeamMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Crown size={20} className="text-yellow-500" />
            <div>
              <p className="text-sm text-muted">Admins</p>
              <p className="text-2xl font-bold">
                {allTeamMembers.filter(m => m.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <User size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-muted">Members</p>
              <p className="text-2xl font-bold">
                {allTeamMembers.filter(m => m.role === 'member').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Eye size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-muted">Viewers</p>
              <p className="text-2xl font-bold">
                {allTeamMembers.filter(m => m.role === 'viewer').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Team Members</h2>
        </div>
        <div className="divide-y divide-border">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div key={`${member.projectId}-${member.id}`} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{member.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted">
                        <span className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{member.email}</span>
                        </span>
                        {member.department && (
                          <span className="flex items-center space-x-1">
                            <Building size={14} />
                            <span>{member.department}</span>
                          </span>
                        )}
                        <span className="text-primary">{member.projectName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="p-2 text-muted hover:text-accent hover:bg-muted rounded-md transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.projectId, member.id)}
                      className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Users size={48} className="text-muted mx-auto mb-4" />
              <p className="text-muted">No team members found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingMember(null);
        }}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
      >
        <TeamForm 
          onClose={() => {
            setShowAddModal(false);
            setEditingMember(null);
          }}
          projectId={selectedProject === 'all' ? undefined : selectedProject}
          editingMember={editingMember}
        />
      </Modal>
    </div>
  );
} 