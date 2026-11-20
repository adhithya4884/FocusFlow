// src/components/CircularTimer.jsx
import React from 'react';
import { Target, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatSecondsToTime } from '../utils/dateUtils';

export default function CircularTimer({
  mode = 'focus',
  remainingSeconds = 1500,
  totalDurationSeconds = 1500,
  isRunning = false,
  cycleCount = 1,
  progressPercent = 0
}) {
  const { activeTask, setActiveTaskId, theme, settings } = useApp();

  const radius = 135;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Stroke offset goes from circumference (0%) to 0 (100%)
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Colors based on mode
  const modeConfigs = {
    focus: {
      title: 'FOCUS SESSION',
      pillClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      gradientId: 'focusGradient',
      startColor: '#a855f7',
      endColor: '#6366f1',
      glowColor: 'rgba(168, 85, 247, 0.4)'
    },
    shortBreak: {
      title: 'SHORT BREAK',
      pillClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      gradientId: 'shortBreakGradient',
      startColor: '#06b6d4',
      endColor: '#3b82f6',
      glowColor: 'rgba(6, 182, 212, 0.4)'
    },
    longBreak: {
      title: 'LONG BREAK',
      pillClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      gradientId: 'longBreakGradient',
      startColor: '#10b981',
      endColor: '#059669',
      glowColor: 'rgba(16, 185, 129, 0.4)'
    }
  };

  const currentConfig = modeConfigs[mode] || modeConfigs.focus;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* SVG Circular Ring */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 320 320">
          <defs>
            {/* Linear Gradients for modes */}
            <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            {/* Filter glow */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated Progress Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke={`url(#${currentConfig.gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glowFilter)"
            style={{
              transition: isRunning ? 'stroke-dashoffset 0.3s ease-out' : 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {/* Mode Pill */}
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-2 transition-all ${currentConfig.pillClass}`}
          >
            {currentConfig.title}
          </div>

          {/* Remaining Time Display */}
          <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-slate-100 dark:text-white drop-shadow-md">
            {formatSecondsToTime(remainingSeconds)}
          </div>

          {/* Session / Cycle Progress Indicator */}
          <div className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
            <span>
              Session {cycleCount} of {settings.longBreakInterval || 4}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Task Bar */}
      {activeTask && (
        <div
          className={`mt-4 max-w-sm w-full mx-auto px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            theme === 'dark'
              ? 'bg-slate-800/80 border-purple-500/30 text-slate-200'
              : 'bg-white border-purple-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 truncate mr-2">
            <Target className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">
              {activeTask.title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              🍅 {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros}
            </span>
            <button
              onClick={() => setActiveTaskId(null)}
              className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
              title="Unlink task"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
