'use client';

import { useProjectStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import KanbanBoard from '../kanban/KanbanBoard';
import Analytics from '../analytics/Analytics';

export default function DashboardLayout() {
  const { view, sidebarOpen, toggleSidebar } = useProjectStore();

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'kanban':
        return <KanbanBoard />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header />
        
        <main className="p-4 lg:p-6">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
} 