'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';

interface TeamFormProps {
  onClose: () => void;
  projectId?: string;
  editingMember?: { id: string; name: string; email: string; role: string; department?: string; projectId: string } | null;
}

export default function TeamForm({ onClose, projectId, editingMember }: TeamFormProps) {
  const { addTeamMember, updateTeamMember } = useProjectStore();
  const [formData, setFormData] = useState({
    name: editingMember?.name || '',
    email: editingMember?.email || '',
    role: editingMember?.role || 'member',
    department: editingMember?.department || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    if (editingMember) {
      // Update existing member
      updateTeamMember(editingMember.projectId, editingMember.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'member' | 'viewer',
        department: formData.department,
      });
    } else {
      // Add new member
      addTeamMember(projectId || 'general', {
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'member' | 'viewer',
        department: formData.department,
      });
    }

    setFormData({
      name: '',
      email: '',
      role: 'member',
      department: '',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter team member name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter email address"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium mb-1">
          Department (Optional)
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter department"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {editingMember ? 'Update Team Member' : 'Add Team Member'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-muted text-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 