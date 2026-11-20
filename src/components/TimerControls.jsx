// src/components/TimerControls.jsx
import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TimerControls({
  mode = 'focus',
  isRunning = false,
  onToggle,
  onReset,
  onSkip,
  onSwitchMode
}) {
  const { theme, settings } = useApp();

  const modes = [
    { id: 'focus', label: 'Focus', duration: `${settings.workDuration || 25}m` },
    { id: 'shortBreak', label: 'Short Break', duration: `${settings.shortBreakDuration || 5}m` },
    { id: 'longBreak', label: 'Long Break', duration: `${settings.longBreakDuration || 15}m` }
  ];

  return (
    <div className="flex flex-col items-center gap-6 mt-6 w-full max-w-md mx-auto">
      {/* Mode Switcher Tabs */}
      <div
        className={`p-1.5 rounded-2xl border flex items-center justify-between w-full max-w-xs transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-slate-100 border-slate-200'
        }`}
      >
        {modes.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSwitchMode(m.id)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{m.label}</span>
              <span className={`block text-[10px] opacity-75 font-normal`}>
                {m.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className={`p-3.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
            theme === 'dark'
              ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
          }`}
          title="Reset timer (R)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Big Start / Pause Play Button */}
        <button
          onClick={onToggle}
          className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
          }`}
          title="Start / Pause (Space)"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>START FOCUS</span>
            </>
          )}
        </button>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className={`p-3.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
            theme === 'dark'
              ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
          }`}
          title="Skip session (S)"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono">Space</kbd> to toggle,{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono">R</kbd> to reset,{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono">S</kbd> to skip
      </p>
    </div>
  );
}
