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
  ChevronDown,
  Square
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

        {/* Ambient Sound Dropdown Menu with Instant Stop/Play Toggle */}
        <div className="relative">
          <div
            className={`flex items-center rounded-xl border transition-all ${
              isAmbientPlaying
                ? 'border-purple-500/50 bg-purple-500/15 shadow-sm shadow-purple-500/15 text-purple-700 dark:text-purple-300'
                : theme === 'dark'
                ? 'border-slate-800 bg-slate-850 text-slate-400'
                : 'border-slate-200 bg-slate-100 text-slate-600'
            }`}
          >
            {/* 1-Click Direct Toggle Button (Stop or Play) */}
            <button
              onClick={toggleAmbientSound}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-l-xl text-xs font-semibold transition-colors ${
                isAmbientPlaying
                  ? 'hover:bg-purple-500/20'
                  : theme === 'dark'
                  ? 'hover:bg-slate-800 hover:text-white'
                  : 'hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isAmbientPlaying ? 'Click to Stop Sound (M)' : 'Click to Play Sound (M)'}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.shortLabel || 'Sound'}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 ml-0.5 hover:bg-rose-500/30">
                    Stop ⏹
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="hidden sm:inline">Sound</span>
                </>
              )}
            </button>

            {/* Menu Dropdown Chevron */}
            <button
              onClick={() => setSoundMenuOpen((prev) => !prev)}
              className="px-1.5 py-2 border-l border-inherit text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Select ambient sound & adjust volume"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Sound Menu Popup */}
          {soundMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border p-3.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in duration-150 ${
                theme === 'dark'
                  ? 'bg-slate-900/98 border-slate-800 text-slate-100 shadow-purple-500/10'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              {/* Direct Quick Turn Off / Play Header Action */}
              <div className="mb-2.5 pb-2.5 border-b border-inherit">
                {isAmbientPlaying ? (
                  <button
                    onClick={() => {
                      toggleAmbientSound();
                      setSoundMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Turn Off Ambient Sound</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toggleAmbientSound();
                      setSoundMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/25 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      Play {AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.shortLabel || 'Sound'}
                    </span>
                  </button>
                )}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 px-1">
                Choose Soundscape
              </span>
              <div className="space-y-1">
                {AMBIENT_SOUND_OPTIONS.map((opt) => {
                  const isCurrent = ambientType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (isCurrent && isAmbientPlaying) {
                          // Clicking active sound turns it off!
                          toggleAmbientSound();
                        } else {
                          changeAmbientType(opt.id);
                          if (!isAmbientPlaying) toggleAmbientSound();
                        }
                        setSoundMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span>{opt.label}</span>
                      </div>
                      {isCurrent && isAmbientPlaying ? (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0">
                          Playing ⏹
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] opacity-80 shrink-0">Selected</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="mt-3 pt-2.5 border-t border-inherit">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  <span>Volume Level</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {Math.round(ambientVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => changeAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
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
