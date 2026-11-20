// src/components/AchievementBadge.jsx
import React from 'react';
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
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AchievementBadge({ achievement, isUnlocked, unlockedAt, progress = 0 }) {
  const { theme } = useApp();

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
      className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        isUnlocked
          ? 'bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/40 shadow-lg shadow-purple-500/10'
          : theme === 'dark'
          ? 'bg-slate-900/40 border-slate-800/80 opacity-70 hover:opacity-90'
          : 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-95'
      }`}
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
                : 'bg-slate-200 border-slate-300 text-slate-400'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
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
        <h4 className="text-sm font-bold text-slate-100 dark:text-white">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {achievement.description}
        </p>
      </div>

      {/* Bottom Progress or Unlock Date */}
      <div className="mt-4 pt-3 border-t border-inherit">
        {isUnlocked ? (
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
            <span>Unlocked</span>
            <span className="text-slate-400">
              {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Progress</span>
              <span className="font-mono font-bold text-purple-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
