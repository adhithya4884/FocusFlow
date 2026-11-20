// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  storage,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  INITIAL_TASKS,
  generateDemoData,
  exportDataAsJson,
  validateImportData
} from '../utils/storage';
import { calculateStreaks, getLocalDateString } from '../utils/dateUtils';
import { calculateAggregateStats } from '../utils/statistics';
import { evaluateAchievements } from '../utils/achievements';
import { audioEngine } from '../utils/audioEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => storage.get(STORAGE_KEYS.THEME, 'dark'));

  // Settings state
  const [settings, setSettings] = useState(() =>
    storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // Tasks state
  const [tasks, setTasks] = useState(() => storage.get(STORAGE_KEYS.TASKS, INITIAL_TASKS));

  // Active Task for Timer
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Completed Sessions Log
  const [sessions, setSessions] = useState(() => storage.get(STORAGE_KEYS.SESSIONS, []));

  // Unlocked Achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState(() =>
    storage.get(STORAGE_KEYS.ACHIEVEMENTS, [])
  );

  // Active UI View / Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Zen Focus Mode Overlay
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Keyboard Shortcuts Modal
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Ambient Sound State
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState(() => settings.ambientType || 'rain');
  const [ambientVolume, setAmbientVolume] = useState(() => settings.ambientVolume || 0.4);

  // In-app Toast message
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Synchronize HTML root class for Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
    storage.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist Settings
  useEffect(() => {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Persist Tasks
  useEffect(() => {
    storage.set(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  // Persist Sessions
  useEffect(() => {
    storage.set(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  // Persist Achievements
  useEffect(() => {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, unlockedAchievements);
  }, [unlockedAchievements]);

  // Compute Streaks from session dates
  const streak = useMemo(() => {
    const dates = sessions
      .filter(s => s.type === 'focus')
      .map(s => getLocalDateString(new Date(s.completedAt)));
    return calculateStreaks(dates);
  }, [sessions]);

  // Compute Overall Statistics
  const aggregateStats = useMemo(() => {
    const base = calculateAggregateStats(sessions, tasks, settings.dailyGoalSessions);
    return {
      ...base,
      streak
    };
  }, [sessions, tasks, settings.dailyGoalSessions, streak]);

  // Trigger Celebration Confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#06b6d4', '#10b981', '#f59e0b']
      });
    } catch {
      // Non-blocking if canvas unsupported
    }
  }, []);

  // Check achievements whenever stats update
  const checkAchievements = useCallback(() => {
    const newlyUnlocked = evaluateAchievements(aggregateStats, unlockedAchievements);
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
      triggerConfetti();
      newlyUnlocked.forEach(ach => {
        showToast(`🏆 Achievement Unlocked: ${ach.id.replace('_', ' ').toUpperCase()}!`, 'success');
      });
    }
  }, [aggregateStats, unlockedAchievements, triggerConfetti, showToast]);

  // Handle ambient sound playback changes
  const toggleAmbientSound = useCallback(() => {
    if (isAmbientPlaying) {
      audioEngine.stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      audioEngine.startAmbient(ambientType, ambientVolume);
      setIsAmbientPlaying(true);
    }
  }, [isAmbientPlaying, ambientType, ambientVolume]);

  const changeAmbientType = useCallback((newType) => {
    setAmbientType(newType);
    setSettings(prev => ({ ...prev, ambientType: newType }));
    if (isAmbientPlaying) {
      audioEngine.startAmbient(newType, ambientVolume);
    }
  }, [isAmbientPlaying, ambientVolume]);

  const changeAmbientVolume = useCallback((newVol) => {
    setAmbientVolume(newVol);
    setSettings(prev => ({ ...prev, ambientVolume: newVol }));
    audioEngine.setAmbientVolume(newVol);
  }, []);

  // Task Actions
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'General',
      estimatedPomodoros: Math.max(1, Number(taskData.estimatedPomodoros) || 1),
      completedPomodoros: 0,
      completed: false,
      dueDate: taskData.dueDate || '',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task created successfully!', 'success');
    return newTask;
  }, [showToast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
    showToast('Task updated!', 'info');
  }, [showToast]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    showToast('Task deleted.', 'info');
  }, [activeTaskId, showToast]);

  const toggleTaskCompleted = useCallback((taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const willComplete = !t.completed;
          if (willComplete) {
            triggerConfetti();
          }
          return {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : null
          };
        }
        return t;
      })
    );
  }, [triggerConfetti]);

  const incrementTaskPomodoro = useCallback((taskId) => {
    if (!taskId) return;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newCompleted = (t.completedPomodoros || 0) + 1;
          const shouldAutoComplete = newCompleted >= t.estimatedPomodoros && !t.completed;
          if (shouldAutoComplete) {
            triggerConfetti();
            showToast(`🎉 Task Goal Reached: "${t.title}"!`, 'success');
          }
          return {
            ...t,
            completedPomodoros: newCompleted,
            completed: shouldAutoComplete ? true : t.completed,
            completedAt: shouldAutoComplete ? new Date().toISOString() : t.completedAt
          };
        }
        return t;
      })
    );
  }, [triggerConfetti, showToast]);

  // Active Task for Timer binding
  const selectTaskForTimer = useCallback((taskId) => {
    setActiveTaskId(taskId);
    setActiveTab('timer');
  }, []);

  // Record a completed session
  const recordCompletedSession = useCallback((sessionData) => {
    const newSession = {
      id: `session-${Date.now()}`,
      type: sessionData.type, // 'focus' | 'shortBreak' | 'longBreak'
      durationMinutes: sessionData.durationMinutes,
      completedAt: new Date().toISOString(),
      taskId: sessionData.taskId || null,
      taskTitle: sessionData.taskTitle || null
    };

    setSessions(prev => [newSession, ...prev]);

    if (sessionData.type === 'focus') {
      if (sessionData.taskId) {
        incrementTaskPomodoro(sessionData.taskId);
      }
      setTimeout(() => {
        checkAchievements();
      }, 100);
    }
  }, [incrementTaskPomodoro, checkAchievements]);

  // Load Demo Data
  const loadDemoData = useCallback(() => {
    const demo = generateDemoData();
    setSessions(demo.sessions);
    setTasks(demo.tasks);
    setUnlockedAchievements(demo.achievements);
    showToast('Demo data loaded successfully! Explore charts & achievements.', 'success');
    triggerConfetti();
  }, [showToast, triggerConfetti]);

  // Reset Application Data
  const resetAllData = useCallback(() => {
    storage.clearAll();
    setSettings(DEFAULT_SETTINGS);
    setTasks(INITIAL_TASKS);
    setSessions([]);
    setActiveTaskId(null);
    setUnlockedAchievements([]);
    audioEngine.stopAmbient();
    setIsAmbientPlaying(false);
    showToast('FocusFlow reset to default state.', 'info');
  }, [showToast]);

  // Export JSON
  const handleExportData = useCallback(() => {
    exportDataAsJson({
      settings,
      tasks,
      sessions,
      achievements: unlockedAchievements
    });
    showToast('Data exported successfully!', 'success');
  }, [settings, tasks, sessions, unlockedAchievements, showToast]);

  // Import JSON
  const handleImportData = useCallback((jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      const validation = validateImportData(parsed);

      if (!validation.valid) {
        showToast(validation.error, 'error');
        return false;
      }

      if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.sessions)) setSessions(parsed.sessions);
      if (Array.isArray(parsed.achievements)) setUnlockedAchievements(parsed.achievements);

      showToast('Data imported successfully!', 'success');
      triggerConfetti();
      return true;
    } catch {
      showToast('Invalid JSON file format.', 'error');
      return false;
    }
  }, [showToast, triggerConfetti]);

  // Current active task object
  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        settings,
        setSettings,
        tasks,
        activeTaskId,
        setActiveTaskId,
        activeTask,
        selectTaskForTimer,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        incrementTaskPomodoro,
        sessions,
        recordCompletedSession,
        streak,
        aggregateStats,
        unlockedAchievements,
        activeTab,
        setActiveTab,
        isFocusMode,
        setIsFocusMode,
        shortcutsModalOpen,
        setShortcutsModalOpen,
        isAmbientPlaying,
        ambientType,
        ambientVolume,
        toggleAmbientSound,
        changeAmbientType,
        changeAmbientVolume,
        toast,
        showToast,
        triggerConfetti,
        loadDemoData,
        resetAllData,
        handleExportData,
        handleImportData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
