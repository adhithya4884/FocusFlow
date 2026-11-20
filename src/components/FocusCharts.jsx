// src/components/FocusCharts.jsx
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  getDailyChartData,
  getWeeklyChartData,
  getSessionDistributionData
} from '../utils/statistics';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

export default function FocusCharts() {
  const { sessions, theme } = useApp();
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '14d'

  const dailyData = getDailyChartData(sessions, timeRange === '7d' ? 7 : 14);
  const weeklyData = getWeeklyChartData(sessions);
  const distributionData = getSessionDistributionData(sessions);

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';

  const hasData = sessions.length > 0;

  return (
    <div className="space-y-6">
      {/* Chart 1: Daily Focus Hours Bar Chart */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold tracking-tight">Daily Focus Time (Hours)</h3>
          </div>

          {/* Time range buttons */}
          <div className="flex items-center rounded-xl p-1 border border-inherit bg-slate-800/20 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeRange === '7d'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeRange === '14d'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
          </div>
        </div>

        {hasData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#fff' : '#000'
                  }}
                  formatter={(val, name, props) => [`${props.payload.minutes}m (${val} hrs)`, 'Focus Time']}
                  labelFormatter={(label, props) => props[0]?.payload.dateStr || label}
                />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
            <BarChart3 className="w-8 h-8 stroke-1 text-slate-600 mb-2" />
            <p className="text-xs">No focus sessions recorded yet. Start your first session to see daily analytics!</p>
          </div>
        )}
      </div>

      {/* Grid: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Area Chart */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">Weekly Focus Momentum</h3>
          </div>

          {hasData ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" stroke={textColor} fontSize={11} tickLine={false} />
                  <YAxis stroke={textColor} fontSize={11} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: isDark ? '#fff' : '#000'
                    }}
                    formatter={(val, name, props) => [`${props.payload.minutes}m (${val} hrs)`, 'Total Hours']}
                    labelFormatter={(label, props) => props[0]?.payload.range || label}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <p className="text-xs">Complete sessions to unlock weekly momentum curves.</p>
            </div>
          )}
        </div>

        {/* Session Distribution Donut Chart */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-tight">Session Type Distribution</h3>
          </div>

          {distributionData.length > 0 ? (
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <p className="text-xs">No sessions completed yet.</p>
            </div>
          )}

          {/* Distribution legend */}
          {distributionData.length > 0 && (
            <div className="flex items-center justify-center gap-4 text-xs">
              {distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">
                    {item.name}: <span className="font-bold">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
