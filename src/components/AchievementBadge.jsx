// src/components/AchievementBadge.jsx
import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Flame,
  Crown,
  Award,
  TrendingUp,
  Zap,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Sunrise,
  Moon,
  Lock,
  Check,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AchievementBadge({ achievement, isUnlocked, unlockedAt, progress = 0 }) {
  const { theme } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  const iconMap = {
    Sparkles,
    Target,
    Flame,
    Crown,
    Award,
    TrendingUp,
    Zap,
    ShieldCheck,
    Trophy,
    CheckCircle2,
    Sunrise,
    Moon
  };

  const IconComponent = iconMap[achievement.icon] || Trophy;

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        isUnlocked
          ? 'bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/40 shadow-lg shadow-purple-500/10 hover:border-purple-400 hover:scale-[1.02]'
          : theme === 'dark'
          ? 'bg-slate-900/40 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700 hover:scale-[1.02]'
          : 'bg-white border-slate-200 opacity-80 hover:opacity-100 hover:border-purple-300 hover:scale-[1.02] shadow-sm'
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div>
        {/* Top Header with Icon and Lock/Check status */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              isUnlocked
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                : theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {achievement.category}
            </span>

            {isUnlocked ? (
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center">
                <Lock className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {achievement.description}
        </p>
      </div>

      {/* Bottom Progress or Unlock Date */}
      <div className="mt-4 pt-3 border-t border-inherit">
        {isUnlocked ? (
          <div className="flex items-center justify-between text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold">
            <span>✓ Unlocked</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Goal Progress</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover Details Pop-up Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 rounded-2xl bg-slate-950/95 border border-purple-500/40 text-white shadow-2xl z-50 pointer-events-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {achievement.title}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                isUnlocked
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 mt-2">
            {achievement.description}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Milestone Target:</span>
            <span className="font-mono font-bold text-amber-300">
              {achievement.target} {achievement.unit}
            </span>
          </div>

          {isUnlocked ? (
            <div className="mt-1 text-[10px] text-emerald-400 font-semibold">
              🎉 Completed on {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          ) : (
            <div className="mt-1 text-[10px] text-slate-400">
              ⚡ Progress: <span className="font-mono font-bold text-purple-400">{Math.round(progress)}% complete</span>
            </div>
          )}

          {/* Little arrow at bottom */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-purple-500/40 rotate-45 -mt-1.5" />
        </div>
      )}
    </div>
  );
}
