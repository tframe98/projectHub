'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';

interface ColumnFormProps {
  onClose: () => void;
  projectId: string;
}

const colorOptions = [
  { value: 'bg-muted', label: 'Sage', preview: 'bg-muted' },
  { value: 'bg-primary', label: 'Orange', preview: 'bg-primary' },
  { value: 'bg-accent', label: 'White', preview: 'bg-accent' },
  { value: 'bg-background', label: 'Dark', preview: 'bg-background' },
];

export default function ColumnForm({ onClose, projectId }: ColumnFormProps) {
  const { addColumn } = useProjectStore();
  const [formData, setFormData] = useState({
    title: '',
    color: 'bg-muted',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addColumn(projectId, {
      title: formData.title.trim(),
      color: formData.color,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Column Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter column title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Column Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${formData.color === color.value 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-muted'
                }
              `}
            >
              <div className={`w-full h-4 rounded ${color.preview}`} />
              <p className="text-xs mt-1">{color.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create Column
        </button>
      </div>
    </form>
  );
} 