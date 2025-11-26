'use client';

import { useAppStore } from '@/lib/store';
import { Video, Image, MessageSquare, Music, Code, Settings, ChevronLeft, History, FolderOpen, LayoutDashboard } from 'lucide-react';

const navItems = [
  { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-indigo-500 to-purple-500' },
  { id: 'video' as const, icon: Video, label: 'Video Generation', gradient: 'from-purple-500 to-pink-500' },
  { id: 'image' as const, icon: Image, label: 'Image Generation', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'text' as const, icon: MessageSquare, label: 'Text Generation', gradient: 'from-green-500 to-emerald-500' },
  { id: 'music' as const, icon: Music, label: 'Music Generation', gradient: 'from-orange-500 to-red-500' },
  { id: 'code' as const, icon: Code, label: 'Code Sandbox', gradient: 'from-yellow-500 to-amber-500' },
  { id: 'history' as const, icon: History, label: 'History', gradient: 'from-gray-500 to-slate-500' },
  { id: 'media' as const, icon: FolderOpen, label: 'Media Gallery', gradient: 'from-pink-500 to-rose-500' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          relative flex flex-col bg-secondary border-r border-border
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-72' : 'w-20'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="gradient-text font-bold text-xl">MiniMax</span>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-border">
          <button
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
