// src/components/StreakTooltipCard.jsx
import React, { useState, useRef } from 'react';
import { Flame, Calendar, Trophy, Zap, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMinutesHuman } from '../utils/dateUtils';

export default function StreakTooltipCard({ children }) {
  const { detailedStreakStats, streak, theme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const {
    weekActiveCount,
    weekDays,
    weekFocusMinutes,
    monthName,
    currentYear,
    monthActiveCount,
    totalDaysInMonth,
    daysElapsedInMonth,
    monthFocusMinutes,
    monthConsistencyPercent
  } = detailedStreakStats;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Anchor Trigger */}
      {children}

      {/* Floating Pop-up Card */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-3 w-80 sm:w-88 rounded-2xl border p-4.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-amber-500/30 text-slate-100 shadow-amber-500/10'
              : 'bg-white/95 border-amber-300 text-slate-900 shadow-xl'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight">Streak & Habit Intelligence</h4>
                <p className="text-[10px] text-slate-400">Consistency metrics breakdown</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {streak.longest}d record
            </span>
          </div>

          {/* Current Streak Highlight Pill */}
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border border-amber-500/25 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                Current Active Streak
              </span>
              <span className="text-xl font-black font-mono tracking-tight text-amber-300">
                {streak.current} {streak.current === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-300 block">
                {streak.current >= 3 ? '🔥 Unstoppable flow' : '🌱 Building momentum'}
              </span>
              <span className="text-[10px] text-slate-400">Keep it going tomorrow!</span>
            </div>
          </div>

          {/* Section 1: This Week's Consistency */}
          <div className="mt-3.5 pt-3 border-t border-inherit">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>This Week's Activity</span>
              </div>
              <span className="font-mono text-indigo-400 text-[11px]">
                {weekActiveCount} / 7 Days ({formatMinutesHuman(weekFocusMinutes)})
              </span>
            </div>

            {/* 7-day pill grid (Mon-Sun) */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((wd, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                    {wd.label}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg border flex flex-col items-center justify-center text-[10px] font-bold font-mono transition-all ${
                      wd.isActive
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-400 text-white shadow-sm shadow-purple-500/30'
                        : wd.isToday
                        ? 'border-amber-400 text-amber-400 bg-amber-500/10 animate-pulse'
                        : wd.isFuture
                        ? 'border-dashed border-slate-700/60 text-slate-600'
                        : theme === 'dark'
                        ? 'bg-slate-800/60 border-slate-700 text-slate-500'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                    title={`${wd.fullDay}: ${wd.isActive ? `${wd.minutes}m focus` : 'No sessions'}`}
                  >
                    {wd.dayNum}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: This Month's Consistency */}
          <div className="mt-3.5 pt-3 border-t border-inherit">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{monthName} {currentYear}</span>
              </div>
              <span className="font-mono text-purple-400 text-[11px]">
                {monthActiveCount} / {daysElapsedInMonth} Days Active
              </span>
            </div>

            {/* Month consistency bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-1.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${monthConsistencyPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{monthConsistencyPercent}% Monthly Consistency</span>
              <span>Total: {formatMinutesHuman(monthFocusMinutes)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
