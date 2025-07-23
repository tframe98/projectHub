'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatsCard({ title, value, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 lg:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-muted truncate">{title}</p>
          <p className="text-lg lg:text-2xl font-bold text-accent mt-1">{value}</p>
        </div>
        <div className={`p-2 lg:p-3 rounded-lg ${bgColor} flex-shrink-0`}>
          <Icon className={`${color}`} size={20} />
        </div>
      </div>
    </div>
  );
} 