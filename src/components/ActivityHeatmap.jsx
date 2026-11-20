// src/components/ActivityHeatmap.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { getHeatmapData } from '../utils/statistics';
import { formatMinutesHuman } from '../utils/dateUtils';
import { Calendar } from 'lucide-react';

export default function ActivityHeatmap() {
  const { sessions, theme } = useApp();

  const days = getHeatmapData(sessions);

  // Intensity color palettes
  const intensityColors = {
    dark: [
      'bg-slate-800/60 border-slate-700/50 hover:border-slate-500', // 0
      'bg-purple-950/80 border-purple-800/60 text-purple-200',      // 1
      'bg-purple-800/80 border-purple-600/60 text-white',           // 2
      'bg-purple-600 border-purple-400 text-white',                 // 3
      'bg-indigo-500 border-indigo-300 text-white shadow-sm shadow-indigo-500/50' // 4
    ],
    light: [
      'bg-slate-100 border-slate-200 hover:border-slate-300',       // 0
      'bg-purple-100 border-purple-200 text-purple-900',            // 1
      'bg-purple-300 border-purple-400 text-purple-950',            // 2
      'bg-purple-500 border-purple-600 text-white',                 // 3
      'bg-indigo-600 border-indigo-700 text-white shadow-sm shadow-indigo-500/30' // 4
    ]
  };

  const palette = theme === 'dark' ? intensityColors.dark : intensityColors.light;

  const totalActiveDays = days.filter(d => d.minutes > 0).length;

  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold tracking-tight">Focus Activity Matrix (35 Days)</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300">
          {totalActiveDays} Active Focus Days
        </span>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`group relative aspect-square rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer transition-all hover:scale-110 hover:z-10 ${
              palette[day.intensity]
            }`}
          >
            <span className="text-[10px] font-mono font-semibold">
              {day.formatted.split(' ')[1]}
            </span>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none whitespace-nowrap">
              <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-white shadow-xl">
                <span className="font-bold">{day.formatted}</span>: {day.minutes > 0 ? formatMinutesHuman(day.minutes) : 'No sessions'}
              </div>
              <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-700 rotate-45 -mt-1"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-end gap-2 text-[11px] text-slate-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3.5 h-3.5 rounded-md border ${palette[level]}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
