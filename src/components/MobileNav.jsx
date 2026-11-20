// src/components/MobileNav.jsx
import React from 'react';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart3,
  Trophy,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const { activeTab, setActiveTab, theme } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'achievements', label: 'Badges', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around ${
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-800 text-slate-400'
          : 'bg-white/95 border-slate-200 text-slate-600'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-purple-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-purple-500/15' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
