// src/pages/Achievements.jsx
import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../utils/achievements';
import AchievementBadge from '../components/AchievementBadge';

export default function Achievements() {
  const {
    aggregateStats,
    unlockedAchievements,
    streak,
    triggerConfetti,
    theme
  } = useApp();

  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Sessions', 'Streaks', 'Goals', 'Tasks', 'Time'];

  const unlockedMap = new Map(
    unlockedAchievements.map((item) => [item.id, item.unlockedAt])
  );

  const filteredAchievements = ACHIEVEMENTS.filter((ach) =>
    filterCategory === 'All' ? true : ach.category === filterCategory
  );

  const totalUnlocked = unlockedAchievements.length;
  const totalBadges = ACHIEVEMENTS.length;
  const completionPercentage = Math.round((totalUnlocked / totalBadges) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Streak Hero */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-slate-900 border-amber-500/20'
            : 'bg-gradient-to-r from-amber-50 via-purple-50 to-white border-amber-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Streak & Gamification Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {streak.current > 0
                ? `${streak.current} Day Habit Streak Active!`
                : 'Build Your Daily Habit'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
              Consistency builds greatness. You have unlocked{' '}
              <span className="font-bold text-purple-600 dark:text-purple-400">{totalUnlocked} of {totalBadges}</span> badges ({completionPercentage}% completion).
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={triggerConfetti}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate!</span>
            </button>
          </div>
        </div>

        {/* Overall Badge Progress Bar */}
        <div className="mt-6 pt-4 border-t border-inherit">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500 dark:text-slate-400">Mastery Progress</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : theme === 'dark'
                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAchievements.map((ach) => {
          const isUnlocked = unlockedMap.has(ach.id);
          const unlockedAt = unlockedMap.get(ach.id);
          const progress = isUnlocked ? 100 : ach.progress(aggregateStats);

          return (
            <AchievementBadge
              key={ach.id}
              achievement={ach}
              isUnlocked={isUnlocked}
              unlockedAt={unlockedAt}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
}
