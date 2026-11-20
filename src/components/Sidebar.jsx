// src/components/Sidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart3,
  Trophy,
  Settings,
  Flame,
  Maximize2,
  HelpCircle,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StreakTooltipCard from './StreakTooltipCard';
import { AMBIENT_SOUND_OPTIONS } from '../utils/audioEngine';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    streak,
    setIsFocusMode,
    setShortcutsModalOpen,
    isAmbientPlaying,
    toggleAmbientSound,
    ambientType
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r transition-colors duration-200 z-30 ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-800 text-slate-300'
          : 'bg-white/90 border-slate-200 text-slate-600'
      } backdrop-blur-md`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center px-6 border-b border-inherit gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
          <Timer className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
            FocusFlow
          </span>
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-purple-400">
            Pro Productivity
          </span>
        </div>
      </div>

      {/* Streak Badge Pill with Hover Pop-up Card */}
      <div className="px-5 py-4">
        <StreakTooltipCard position="sidebar-flyout" className="w-full block">
          <div
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
              streak.current > 0
                ? 'bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-amber-500/30'
                : theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50'
                : 'bg-slate-100/70 border-slate-200'
            }`}
            title="Hover to view weekly & monthly streak details"
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${streak.current > 0 ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400' : 'text-slate-400'}`}>
                <Flame className={`w-4 h-4 ${streak.current > 0 ? 'fill-amber-400 animate-bounce' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  {streak.current} Day Streak
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Hover for details
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
              {streak.longest} max
            </span>
          </div>
        </StreakTooltipCard>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Ambient Sound Quick Action */}
      <div className="px-3 py-2">
        <button
          onClick={toggleAmbientSound}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
            isAmbientPlaying
              ? 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300'
              : theme === 'dark'
              ? 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Toggle ambient background soundscape (Rain/Waves/Fire/Clock/Zen Bowl)"
        >
          <div className="flex items-center gap-2 truncate mr-2">
            {isAmbientPlaying ? (
              <Volume2 className="w-4 h-4 text-purple-500 animate-pulse shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">
              {isAmbientPlaying
                ? AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.shortLabel || 'Sound Playing'
                : 'Ambient Audio'}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${isAmbientPlaying ? 'bg-purple-500/25 text-purple-700 dark:text-purple-200 font-mono' : 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'}`}>
            {isAmbientPlaying ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Footer Utility Actions */}
      <div className={`p-4 border-t border-inherit flex items-center justify-between`}>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-amber-400'
              : 'border-slate-200 hover:bg-slate-100 text-indigo-600'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsFocusMode(true)}
          className={`p-2 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title="Fullscreen Zen Focus Mode (F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShortcutsModalOpen(true)}
          className={`p-2 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
