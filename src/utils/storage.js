// src/utils/storage.js
import { getLocalDateString } from './dateUtils';

const STORAGE_KEYS = {
  THEME: 'focusflow_theme',
  SETTINGS: 'focusflow_settings',
  TASKS: 'focusflow_tasks',
  SESSIONS: 'focusflow_sessions',
  ACTIVE_TIMER: 'focusflow_active_timer',
  ACHIEVEMENTS: 'focusflow_achievements'
};

export const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundType: 'zen', // 'zen', 'digital', 'gong', 'marimba'
  soundVolume: 0.7,
  ambientEnabled: false,
  ambientType: 'rain', // 'rain', 'forest', 'cafe', 'binaural', 'brown'
  ambientVolume: 0.45,
  notificationEnabled: false,
  dailyGoalSessions: 4,
  dailyGoalMinutes: 100
};

/**
 * Realistic Default Initial Sample Data
 * Seeded across November 2026 to immediately test and showcase all charts, streaks, and achievements!
 */
export function getInitialSeedData() {
  const sessions = [];
  const today = new Date(); // 2026-11-20

  // Active dates in November 2026:
  // Nov 20 (today), Nov 19, Nov 18, Nov 17, Nov 16 (creating active 5-day streak)
  // and earlier active days: Nov 14, 13, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1
  const daysAgoList = [
    0, 1, 2, 3, 4, // 5-day active streak (Nov 16 - Nov 20)
    6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19 // earlier in November
  ];

  const sampleTasksList = [
    { id: 'task-arch', title: 'FocusFlow Component Architecture' },
    { id: 'task-audio', title: 'Procedural Web Audio Engine' },
    { id: 'task-heat', title: 'Monthly Activity Matrix & Analytics' },
    { id: 'task-habits', title: 'Productivity Research & Habit Loops' }
  ];

  daysAgoList.forEach((daysAgo, dayIdx) => {
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - daysAgo);

    // Number of sessions per day (2 to 5)
    const sessionCount = daysAgo === 0 ? 3 : 2 + (daysAgo % 4);

    for (let i = 0; i < sessionCount; i++) {
      const sTime = new Date(sDate);
      sTime.setHours(9 + i * 2, 15 + (i * 12) % 45, 0);

      const taskObj = sampleTasksList[(dayIdx + i) % sampleTasksList.length];

      sessions.push({
        id: `seed-session-${daysAgo}-${i}`,
        type: 'focus',
        durationMinutes: 25,
        completedAt: sTime.toISOString(),
        taskId: taskObj.id,
        taskTitle: taskObj.title
      });
    }

    // Add a couple of short break logs for distribution chart
    if (dayIdx % 2 === 0) {
      const bTime = new Date(sDate);
      bTime.setHours(11, 45, 0);
      sessions.push({
        id: `seed-break-${daysAgo}`,
        type: 'shortBreak',
        durationMinutes: 5,
        completedAt: bTime.toISOString()
      });
    }
  });

  const tasks = [
    {
      id: 'task-arch',
      title: 'FocusFlow Component Architecture',
      description: 'Implement reusable modular UI components and responsive layout',
      priority: 'High',
      category: 'Coding',
      estimatedPomodoros: 4,
      completedPomodoros: 4,
      completed: true,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 5).toISOString()
    },
    {
      id: 'task-audio',
      title: 'Procedural Web Audio Engine',
      description: 'Synthesize Rain, Birds, Cafe, and 40Hz Binaural Beats via Web Audio API',
      priority: 'High',
      category: 'Coding',
      estimatedPomodoros: 3,
      completedPomodoros: 3,
      completed: true,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 4).toISOString()
    },
    {
      id: 'task-heat',
      title: 'Monthly Activity Matrix & Analytics',
      description: 'Calculate real month-to-date metrics, consistency rates, and Recharts charts',
      priority: 'High',
      category: 'Coding',
      estimatedPomodoros: 4,
      completedPomodoros: 3,
      completed: false,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 2).toISOString()
    },
    {
      id: 'task-habits',
      title: 'Productivity Research & Habit Loops',
      description: 'Study Deep Work frameworks and streak gamification mechanics',
      priority: 'Medium',
      category: 'Study',
      estimatedPomodoros: 2,
      completedPomodoros: 1,
      completed: false,
      dueDate: getLocalDateString(new Date(today.getTime() + 86400000)),
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-design',
      title: 'SaaS Theme Tokens & Ambient Glow',
      description: 'Craft dark theme tokens, glassmorphism cards, and violet glow accents',
      priority: 'Medium',
      category: 'Design',
      estimatedPomodoros: 3,
      completedPomodoros: 3,
      completed: true,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 3).toISOString()
    },
    {
      id: 'task-docs',
      title: 'Project Documentation & Testing Guide',
      description: 'Complete comprehensive deployment checklist and component architecture',
      priority: 'Medium',
      category: 'Work',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      completed: false,
      dueDate: getLocalDateString(new Date(today.getTime() + 86400000 * 2)),
      createdAt: new Date().toISOString()
    }
  ];

  const achievements = [
    { id: 'first_focus', unlockedAt: new Date(today.getTime() - 86400000 * 18).toISOString() },
    { id: 'consistency', unlockedAt: new Date(today.getTime() - 86400000 * 14).toISOString() },
    { id: 'deep_worker', unlockedAt: new Date(today.getTime() - 86400000 * 10).toISOString() },
    { id: 'focus_master', unlockedAt: new Date(today.getTime() - 86400000 * 4).toISOString() },
    { id: 'habit_builder', unlockedAt: new Date(today.getTime() - 86400000 * 2).toISOString() },
    { id: 'productivity_champion', unlockedAt: today.toISOString() },
    { id: 'task_crusher', unlockedAt: new Date(today.getTime() - 86400000 * 3).toISOString() }
  ];

  return { sessions, tasks, achievements };
}

export const INITIAL_DATA = getInitialSeedData();

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.error(`Error reading ${key} from localStorage:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing ${key} to localStorage:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`Error removing ${key} from localStorage:`, err);
      return false;
    }
  },

  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      return true;
    } catch (err) {
      console.error('Error clearing FocusFlow storage:', err);
      return false;
    }
  }
};

export { STORAGE_KEYS };

/**
 * Validates imported JSON data format
 */
export function validateImportData(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    return { valid: false, error: 'Uploaded file is not a valid JSON object.' };
  }

  const hasRecognizedKey = ['settings', 'tasks', 'sessions', 'achievements'].some(
    k => k in jsonData
  );

  if (!hasRecognizedKey) {
    return { valid: false, error: 'JSON does not contain FocusFlow data fields.' };
  }

  return { valid: true, error: null };
}

/**
 * Exports current application state as a JSON file download
 */
export function exportDataAsJson(data) {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    settings: data.settings || DEFAULT_SETTINGS,
    tasks: data.tasks || [],
    sessions: data.sessions || [],
    achievements: data.achievements || []
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `focusflow_backup_${getLocalDateString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Regenerates Demo Data
 */
export function generateDemoData() {
  return getInitialSeedData();
}
