// src/utils/achievements.js

export const ACHIEVEMENTS = [
  {
    id: 'first_focus',
    title: 'First Focus',
    description: 'Complete your first Pomodoro session',
    icon: 'Sparkles',
    category: 'Sessions',
    target: 1,
    unit: 'session',
    check: (stats) => stats.totalSessions >= 1,
    progress: (stats) => Math.min(100, (stats.totalSessions / 1) * 100)
  },
  {
    id: 'consistency',
    title: 'Consistency',
    description: 'Complete 5 Pomodoro sessions',
    icon: 'Target',
    category: 'Sessions',
    target: 5,
    unit: 'sessions',
    check: (stats) => stats.totalSessions >= 5,
    progress: (stats) => Math.min(100, (stats.totalSessions / 5) * 100)
  },
  {
    id: 'deep_worker',
    title: 'Deep Worker',
    description: 'Complete 10 Pomodoro sessions in total',
    icon: 'Flame',
    category: 'Sessions',
    target: 10,
    unit: 'sessions',
    check: (stats) => stats.totalSessions >= 10,
    progress: (stats) => Math.min(100, (stats.totalSessions / 10) * 100)
  },
  {
    id: 'focus_master',
    title: 'Focus Master',
    description: 'Complete 25 Pomodoro sessions',
    icon: 'Crown',
    category: 'Sessions',
    target: 25,
    unit: 'sessions',
    check: (stats) => stats.totalSessions >= 25,
    progress: (stats) => Math.min(100, (stats.totalSessions / 25) * 100)
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Complete 100 Pomodoro sessions',
    icon: 'Award',
    category: 'Sessions',
    target: 100,
    unit: 'sessions',
    check: (stats) => stats.totalSessions >= 100,
    progress: (stats) => Math.min(100, (stats.totalSessions / 100) * 100)
  },
  {
    id: 'habit_builder',
    title: 'Habit Builder',
    description: 'Maintain a 3-day focus streak',
    icon: 'TrendingUp',
    category: 'Streaks',
    target: 3,
    unit: 'days',
    check: (stats) => stats.streak.longest >= 3 || stats.streak.current >= 3,
    progress: (stats) => Math.min(100, (Math.max(stats.streak.current, stats.streak.longest) / 3) * 100)
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Reach a 7-day focus streak',
    icon: 'Zap',
    category: 'Streaks',
    target: 7,
    unit: 'days',
    check: (stats) => stats.streak.longest >= 7 || stats.streak.current >= 7,
    progress: (stats) => Math.min(100, (Math.max(stats.streak.current, stats.streak.longest) / 7) * 100)
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Reach a 14-day focus streak',
    icon: 'ShieldCheck',
    category: 'Streaks',
    target: 14,
    unit: 'days',
    check: (stats) => stats.streak.longest >= 14 || stats.streak.current >= 14,
    progress: (stats) => Math.min(100, (Math.max(stats.streak.current, stats.streak.longest) / 14) * 100)
  },
  {
    id: 'productivity_champion',
    title: 'Productivity Champion',
    description: 'Hit your daily focus session goal',
    icon: 'Trophy',
    category: 'Goals',
    target: 1,
    unit: 'daily goal',
    check: (stats) => stats.todaySessions >= stats.dailyGoalSessions && stats.dailyGoalSessions > 0,
    progress: (stats) => Math.min(100, (stats.todaySessions / Math.max(1, stats.dailyGoalSessions)) * 100)
  },
  {
    id: 'task_crusher',
    title: 'Task Crusher',
    description: 'Complete 5 productivity tasks',
    icon: 'CheckCircle2',
    category: 'Tasks',
    target: 5,
    unit: 'tasks',
    check: (stats) => stats.completedTasksCount >= 5,
    progress: (stats) => Math.min(100, (stats.completedTasksCount / 5) * 100)
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a focus session before 8:00 AM',
    icon: 'Sunrise',
    category: 'Time',
    target: 1,
    unit: 'morning session',
    check: (stats) => stats.hasEarlyMorningSession,
    progress: (stats) => (stats.hasEarlyMorningSession ? 100 : 0)
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a focus session after 9:00 PM',
    icon: 'Moon',
    category: 'Time',
    target: 1,
    unit: 'night session',
    check: (stats) => stats.hasLateNightSession,
    progress: (stats) => (stats.hasLateNightSession ? 100 : 0)
  }
];

/**
 * Checks all achievements against current stats and returns any newly unlocked ones
 * @param {Object} stats
 * @param {Array} currentUnlocked - array of { id, unlockedAt }
 * @returns {Array} newly unlocked achievements array
 */
export function evaluateAchievements(stats, currentUnlocked = []) {
  const unlockedSet = new Set(currentUnlocked.map(a => a.id));
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (!unlockedSet.has(ach.id) && ach.check(stats)) {
      newlyUnlocked.push({
        id: ach.id,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newlyUnlocked;
}
