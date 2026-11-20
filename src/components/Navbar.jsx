// src/components/Navbar.jsx
import React from 'react';
import {
  Maximize2,
  Sun,
  Moon,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatSecondsToTime, formatDisplayDate } from '../utils/dateUtils';

export default function Navbar({ timerControl }) {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    streak,
    setIsFocusMode,
    isAmbientPlaying,
    toggleAmbientSound
  } = useApp();

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    timer: 'Pomodoro Focus Timer',
    tasks: 'Task Management',
    stats: 'Productivity Analytics',
    achievements: 'Streaks & Achievements',
    settings: 'Settings & Preferences'
  };

  const isTimerRunning = timerControl?.isRunning;
  const showMiniTimer = isTimerRunning && activeTab !== 'timer';

  return (
    <header
      className={`h-16 px-4 md:px-8 border-b sticky top-0 z-20 flex items-center justify-between backdrop-blur-md transition-colors ${
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-800/80 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-900'
      }`}
    >
      {/* Title & Date */}
      <div>
        <h1 className="text-base md:text-lg font-bold tracking-tight">
          {tabTitles[activeTab] || 'FocusFlow'}
        </h1>
        <p className="hidden md:block text-xs text-slate-400">
          {formatDisplayDate()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mini Sticky Global Timer Pill */}
        {showMiniTimer && (
          <div
            onClick={() => setActiveTab('timer')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:bg-purple-500/25 cursor-pointer shadow-sm shadow-purple-500/20 transition-all animate-pulse"
            title="Click to view full timer"
          >
            <Timer className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-xs font-bold text-white">
              {formatSecondsToTime(timerControl.remainingSeconds)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                timerControl.toggleTimer();
              }}
              className="p-1 rounded-full hover:bg-purple-600/40 text-white"
            >
              {timerControl.isRunning ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
            </button>
          </div>
        )}

        {/* Ambient Sound Icon Button */}
        <button
          onClick={toggleAmbientSound}
          className={`p-2 rounded-xl border transition-colors ${
            isAmbientPlaying
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
              : theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-slate-400'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title="Toggle Ambient Sound"
        >
          {isAmbientPlaying ? (
            <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Streak Indicator (visible on mobile / tablet navbar) */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold ${
            streak.current > 0
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              : theme === 'dark'
              ? 'border-slate-800 text-slate-400'
              : 'border-slate-200 text-slate-600'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${streak.current > 0 ? 'fill-amber-400' : ''}`} />
          <span>{streak.current}d</span>
        </div>

        {/* Zen Mode Button */}
        <button
          onClick={() => setIsFocusMode(true)}
          className={`hidden md:flex p-2 rounded-xl border transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title="Distraction-Free Zen Mode (F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2 rounded-xl border transition-colors ${
            theme === 'dark'
              ? 'border-slate-800 hover:bg-slate-800 text-amber-400'
              : 'border-slate-200 hover:bg-slate-100 text-indigo-600'
          }`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
