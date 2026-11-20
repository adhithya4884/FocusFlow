// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  Maximize2,
  Sun,
  Moon,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Timer,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatSecondsToTime, formatDisplayDate } from '../utils/dateUtils';
import StreakTooltipCard from './StreakTooltipCard';
import { AMBIENT_SOUND_OPTIONS } from '../utils/audioEngine';

export default function Navbar({ timerControl }) {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    streak,
    setIsFocusMode,
    isAmbientPlaying,
    toggleAmbientSound,
    ambientType,
    changeAmbientType,
    ambientVolume,
    changeAmbientVolume
  } = useApp();

  const [soundMenuOpen, setSoundMenuOpen] = useState(false);

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

        {/* Ambient Sound Dropdown Menu */}
        <div className="relative">
          <div className="flex items-center rounded-xl border border-inherit bg-slate-800/40">
            <button
              onClick={toggleAmbientSound}
              className={`p-2 rounded-l-xl transition-colors ${
                isAmbientPlaying
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isAmbientPlaying ? 'Mute ambient sound (M)' : 'Play ambient sound (M)'}
            >
              {isAmbientPlaying ? (
                <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSoundMenuOpen(prev => !prev)}
              className="px-1.5 py-2 border-l border-inherit text-slate-400 hover:text-white"
              title="Select soundscape"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Sound Menu Popup */}
          {soundMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border p-3 shadow-xl z-50 backdrop-blur-xl animate-in fade-in duration-150 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Select Ambient Sound
              </span>
              <div className="space-y-1">
                {AMBIENT_SOUND_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      changeAmbientType(opt.id);
                      if (!isAmbientPlaying) toggleAmbientSound();
                      setSoundMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      ambientType === opt.id
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {ambientType === opt.id && isAmbientPlaying && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    )}
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="mt-3 pt-2.5 border-t border-inherit">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Volume</span>
                  <span className="font-mono">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => changeAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Streak Indicator with Hover Pop-up Card */}
        <StreakTooltipCard>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${
              streak.current > 0
                ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-purple-500/10 text-amber-300 shadow-sm shadow-amber-500/10'
                : theme === 'dark'
                ? 'border-slate-800 bg-slate-900/60 text-slate-400'
                : 'border-slate-200 bg-slate-100 text-slate-600'
            }`}
            title="Hover to view weekly & monthly streak details"
          >
            <Flame className={`w-4 h-4 ${streak.current > 0 ? 'fill-amber-400 text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-mono font-bold">{streak.current}d</span>
          </div>
        </StreakTooltipCard>

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
