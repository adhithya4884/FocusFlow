// src/components/StatCard.jsx
import React from 'react';
import { useApp } from '../context/AppContext';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'purple',
  badgeText
}) {
  const { theme } = useApp();

  const accentStyles = {
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/15 text-purple-300'
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      badge: 'bg-indigo-500/15 text-indigo-300'
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/15 text-cyan-300'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-300'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/15 text-amber-300'
    }
  };

  const style = accentStyles[accentColor] || accentStyles.purple;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
          {value}
        </span>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
