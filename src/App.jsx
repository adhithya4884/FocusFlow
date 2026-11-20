// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Square } from 'lucide-react';
import { useApp } from './context/AppContext';
import { usePomodoro } from './hooks/usePomodoro';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import ZenFocusMode from './components/ZenFocusMode';
import TaskFormModal from './components/TaskFormModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { AMBIENT_SOUND_OPTIONS } from './utils/audioEngine';

// Pages
import Dashboard from './pages/Dashboard';
import FocusTimer from './pages/FocusTimer';
import Tasks from './pages/Tasks';
import Statistics from './pages/Statistics';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

export default function App() {
  const {
    activeTab,
    isFocusMode,
    setIsFocusMode,
    setShortcutsModalOpen,
    isAmbientPlaying,
    toggleAmbientSound,
    ambientType,
    ambientVolume,
    toast,
    theme
  } = useApp();

  const timerControl = usePomodoro();

  // Task form modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setEditingTask(null);
    setTaskModalOpen(false);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing inside an input, textarea, or contentEditable
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isInput) return;

      // Space: Start/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        timerControl.toggleTimer();
      }
      // R: Reset
      else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        timerControl.resetTimer();
      }
      // S: Skip
      else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        timerControl.skipSession();
      }
      // F: Toggle Zen Fullscreen Mode
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      }
      // M: Toggle Ambient Sound
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleAmbientSound();
      }
      // ?: Open Shortcuts Modal
      else if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timerControl, setIsFocusMode, toggleAmbientSound, setShortcutsModalOpen]);

  // Page Routing Switcher
  const renderPage = () => {
    switch (activeTab) {
      case 'timer':
        return <FocusTimer timerControl={timerControl} onOpenTaskModal={handleOpenTaskModal} />;
      case 'tasks':
        return <Tasks onOpenTaskModal={handleOpenTaskModal} />;
      case 'stats':
        return <Statistics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard timerControl={timerControl} onOpenTaskModal={handleOpenTaskModal} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'} ambient-bg`}>
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Navbar timerControl={timerControl} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Zen Distraction-Free Fullscreen Overlay */}
      <ZenFocusMode timerControl={timerControl} />

      {/* Task Creation & Editing Modal */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={handleCloseTaskModal}
        taskToEdit={editingTask}
      />

      {/* Keyboard Shortcuts Cheat-Sheet Modal */}
      <KeyboardShortcutsModal />

      {/* Global Floating Mini Audio Controller (Instant 1-Click Stop from anywhere) */}
      {isAmbientPlaying && (
        <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:py-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-purple-500/40 text-slate-100 shadow-purple-500/10'
                : 'bg-white/95 border-purple-300 text-slate-900 shadow-xl'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-bold flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-none">
                <span>{AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.icon || '🎵'}</span>
                <span className="hidden sm:inline">
                  {AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.label || 'Sound'}
                </span>
                <span className="sm:hidden">
                  {AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.shortLabel || 'Sound'}
                </span>
              </span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold ml-0.5">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>

            <button
              onClick={toggleAmbientSound}
              className="ml-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
              title="Stop Ambient Audio (M)"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Sound</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating In-App Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-purple-900/90 border-purple-500/50 text-purple-100'
                : toast.type === 'error'
                ? 'bg-rose-900/90 border-rose-500/50 text-rose-100'
                : 'bg-slate-900/90 border-slate-700 text-slate-100'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
