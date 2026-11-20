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
  ambientType: 'rain', // 'rain', 'brown', 'white', 'binaural'
  ambientVolume: 0.4,
  notificationEnabled: false,
  dailyGoalSessions: 4,
  dailyGoalMinutes: 100
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Review project requirements & scope',
    description: 'Go over the project specs and organize main priorities',
    priority: 'High',
    category: 'Work',
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    completed: false,
    dueDate: getLocalDateString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Complete Deep Work Session 1',
    description: 'Focus solely on the core architecture and features',
    priority: 'High',
    category: 'Coding',
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    completed: false,
    dueDate: getLocalDateString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Read documentation & optimize workflow',
    description: 'Learn new keyboard shortcuts and refine habits',
    priority: 'Medium',
    category: 'Study',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    completed: false,
    dueDate: '',
    createdAt: new Date().toISOString()
  }
];

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

  // Must have at least one recognized key
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
 * Generates realistic Demo Data for portfolio testing
 */
export function generateDemoData() {
  const sessions = [];
  const today = new Date();

  // Create 12 days of sessions across the last 14 days (creating a 5-day active streak)
  const activeDaysAgo = [0, 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13];

  activeDaysAgo.forEach(daysAgo => {
    const sessionDate = new Date();
    sessionDate.setDate(today.getDate() - daysAgo);

    // Number of sessions for this day (2 to 5)
    const count = 2 + (daysAgo % 3);
    for (let i = 0; i < count; i++) {
      const sTime = new Date(sessionDate);
      sTime.setHours(9 + i * 2, 15 + i * 10, 0);

      sessions.push({
        id: `demo-session-${daysAgo}-${i}`,
        type: 'focus',
        durationMinutes: 25,
        completedAt: sTime.toISOString(),
        taskId: i % 2 === 0 ? 'demo-task-1' : 'demo-task-2',
        taskTitle: i % 2 === 0 ? 'Frontend Component Architecture' : 'Productivity Research & UI System'
      });
    }
  });

  const tasks = [
    {
      id: 'demo-task-1',
      title: 'Frontend Component Architecture',
      description: 'Implement reusable UI components and modular layout',
      priority: 'High',
      category: 'Coding',
      estimatedPomodoros: 6,
      completedPomodoros: 6,
      completed: true,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 3).toISOString()
    },
    {
      id: 'demo-task-2',
      title: 'Productivity Research & UI System',
      description: 'Design dark/light theme tokens and purple glow system',
      priority: 'Medium',
      category: 'Design',
      estimatedPomodoros: 4,
      completedPomodoros: 4,
      completed: true,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000 * 4).toISOString()
    },
    {
      id: 'demo-task-3',
      title: 'High-Precision Timer Engine Verification',
      description: 'Verify background tab drift prevention with timestamp deltas',
      priority: 'High',
      category: 'Coding',
      estimatedPomodoros: 4,
      completedPomodoros: 3,
      completed: false,
      dueDate: getLocalDateString(today),
      createdAt: new Date(today.getTime() - 86400000).toISOString()
    },
    {
      id: 'demo-task-4',
      title: 'Prepare Project Documentation & Testing Checklist',
      description: 'Write complete deployment steps and architecture notes',
      priority: 'Medium',
      category: 'Work',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      completed: false,
      dueDate: getLocalDateString(new Date(today.getTime() + 86400000)),
      createdAt: new Date().toISOString()
    }
  ];

  const achievements = [
    { id: 'first_focus', unlockedAt: new Date(today.getTime() - 86400000 * 13).toISOString() },
    { id: 'consistency', unlockedAt: new Date(today.getTime() - 86400000 * 10).toISOString() },
    { id: 'deep_worker', unlockedAt: new Date(today.getTime() - 86400000 * 7).toISOString() },
    { id: 'focus_master', unlockedAt: new Date(today.getTime() - 86400000 * 2).toISOString() },
    { id: 'habit_builder', unlockedAt: new Date(today.getTime() - 86400000 * 2).toISOString() },
    { id: 'productivity_champion', unlockedAt: today.toISOString() },
    { id: 'task_crusher', unlockedAt: new Date(today.getTime() - 86400000 * 4).toISOString() }
  ];

  return {
    sessions,
    tasks,
    achievements
  };
}
