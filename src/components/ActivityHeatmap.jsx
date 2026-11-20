// src/components/ActivityHeatmap.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { getCurrentMonthMatrixData } from '../utils/statistics';
import { formatMinutesHuman } from '../utils/dateUtils';
import { Calendar, Clock, Flame, CheckCircle, Sparkles } from 'lucide-react';

export default function ActivityHeatmap() {
  const { sessions, theme } = useApp();

  const matrixData = getCurrentMonthMatrixData(sessions);
  const { monthName, year, leadingBlanks, days, summary } = matrixData;

  // Day of week column headers (Monday to Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Intensity color palettes
  const intensityColors = {
    dark: [
      'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-500', // 0: no focus
      'bg-purple-950/70 border-purple-800/50 text-purple-300 shadow-sm shadow-purple-950/50', // 1: <25m
      'bg-purple-800/80 border-purple-600/70 text-purple-100 shadow-sm shadow-purple-900/50', // 2: 25-59m
      'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30',            // 3: 60-119m
      'bg-gradient-to-tr from-purple-600 to-indigo-500 border-indigo-300 text-white shadow-lg shadow-purple-500/40' // 4: 120m+
    ],
    light: [
      'bg-slate-100/80 border-slate-200 text-slate-500 hover:border-slate-300',
      'bg-purple-100 border-purple-200 text-purple-800',
      'bg-purple-200 border-purple-300 text-purple-900',
      'bg-purple-500 border-purple-600 text-white',
      'bg-gradient-to-tr from-purple-600 to-indigo-600 border-indigo-500 text-white shadow-sm'
    ]
  };

  const palette = theme === 'dark' ? intensityColors.dark : intensityColors.light;

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-inherit gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 border border-purple-500/30 text-purple-300 mb-1.5">
            <Calendar className="w-3 h-3" />
            <span>Monthly Habit Tracker</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
            {monthName} {year} Focus Activity Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily focus density and consistency overview for the current month
          </p>
        </div>

        {/* Month Summary KPI Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl border border-inherit bg-slate-800/30 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Focus</span>
            <span className="font-mono font-extrabold text-sm text-purple-400">
              {summary.totalHours} hrs
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-inherit bg-slate-800/30 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Days</span>
            <span className="font-mono font-extrabold text-sm text-indigo-400">
              {summary.activeDays} / {summary.daysElapsed}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-inherit bg-slate-800/30 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Consistency</span>
            <span className="font-mono font-extrabold text-sm text-emerald-400">
              {summary.consistencyRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Weekday Column Header Labels */}
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5 mt-5 mb-2 text-center">
        {weekDays.map((wDay, idx) => (
          <div
            key={idx}
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            {wDay}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
        {/* Leading blank offset days */}
        {Array.from({ length: leadingBlanks }).map((_, bIdx) => (
          <div
            key={`blank-${bIdx}`}
            className="aspect-square rounded-xl border border-dashed border-slate-800/30 opacity-20 pointer-events-none"
          />
        ))}

        {/* Days of Current Month */}
        {days.map((day) => (
          <div
            key={`day-${day.dayNumber}`}
            className={`group relative aspect-square rounded-xl border flex flex-col items-center justify-between p-1.5 sm:p-2 cursor-pointer transition-all duration-150 hover:scale-105 hover:z-20 ${
              day.isFuture
                ? 'border-dashed border-slate-800/60 text-slate-600 bg-slate-900/20'
                : palette[day.intensity]
            } ${
              day.isToday
                ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-950 font-black'
                : ''
            }`}
          >
            {/* Top row: day number & today dot */}
            <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-mono font-semibold">
              <span>{day.dayNumber}</span>
              {day.isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" title="Today" />
              )}
            </div>

            {/* Bottom session indicator */}
            {day.minutes > 0 ? (
              <span className="text-[9px] font-mono font-bold tracking-tight opacity-90 truncate max-w-full">
                {day.minutes}m
              </span>
            ) : (
              <span className="text-[9px] opacity-30 font-mono">-</span>
            )}

            {/* Hover Tooltip Popup */}
            <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap">
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white shadow-2xl backdrop-blur-md">
                <div className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Calendar className="w-3 h-3" />
                  <span>{day.formatted} {day.isToday ? '(Today)' : ''}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
                  <span>⏱️ Focus: <strong className="text-white">{day.minutes > 0 ? formatMinutesHuman(day.minutes) : 'None'}</strong></span>
                  <span>•</span>
                  <span>🍅 <strong className="text-white">{day.sessionsCount}</strong> sessions</span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 bg-slate-950 border-r border-b border-slate-700 rotate-45 -mt-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Legend & Help Footer */}
      <div className="mt-5 pt-3.5 border-t border-inherit flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full border border-purple-500 bg-purple-500/20" />
          <span>Active Day</span>
          <span className="mx-2">•</span>
          <span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/20" />
          <span>Today</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span>0m</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3.5 h-3.5 rounded-md border ${palette[level]}`}
              title={`Level ${level}`}
            />
          ))}
          <span>120m+</span>
        </div>
      </div>
    </div>
  );
}
