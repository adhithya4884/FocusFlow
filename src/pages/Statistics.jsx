// src/pages/Statistics.jsx
import React from 'react';
import {
  Clock,
  Target,
  Flame,
  Calendar,
  Award,
  CheckCircle2,
  BarChart3,
  History,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMinutesHuman } from '../utils/dateUtils';
import StatCard from '../components/StatCard';
import FocusCharts from '../components/FocusCharts';
import ActivityHeatmap from '../components/ActivityHeatmap';

export default function Statistics() {
  const { aggregateStats, sessions, theme } = useApp();

  const recentSessions = sessions.slice(0, 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Productivity Analytics & Insights
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Detailed metrics calculated from your real completed focus sessions
        </p>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Focus Time"
          value={formatMinutesHuman(aggregateStats.totalFocusMinutes)}
          subtitle="All-time focused duration"
          icon={Clock}
          accentColor="purple"
        />

        <StatCard
          title="Total Pomodoros"
          value={aggregateStats.totalSessions}
          subtitle="Genuine completed cycles"
          icon={Target}
          accentColor="indigo"
        />

        <StatCard
          title="Avg Session Length"
          value={`${aggregateStats.avgSessionMinutes}m`}
          subtitle="Average time per focus block"
          icon={Timer}
          accentColor="cyan"
        />

        <StatCard
          title="Peak Productive Day"
          value={aggregateStats.mostProductiveDay}
          subtitle="Highest logged focus volume"
          icon={Award}
          accentColor="amber"
        />
      </div>

      {/* Interactive Charts Section */}
      <FocusCharts />

      {/* Heatmap Section */}
      <ActivityHeatmap />

      {/* Productivity Session History Table */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Recent Completed Sessions</h3>
        </div>

        {recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-inherit text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Type</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Duration</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Associated Task</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-right">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {recentSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          s.type === 'focus'
                            ? 'bg-purple-100 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300'
                            : s.type === 'shortBreak'
                            ? 'bg-cyan-100 dark:bg-cyan-500/15 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                            : 'bg-emerald-100 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {s.type === 'focus' ? 'Focus' : s.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {s.durationMinutes}m
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 truncate max-w-xs font-medium">
                      {s.taskTitle || <span className="text-slate-400 dark:text-slate-500 italic">Free Session</span>}
                    </td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(s.completedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No session history yet. Complete your first Pomodoro to populate the audit log!
          </div>
        )}
      </div>
    </div>
  );
}
