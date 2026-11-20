// src/pages/FocusTimer.jsx
import React from 'react';
import {
  Target,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ListPlus,
  Square,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CircularTimer from '../components/CircularTimer';
import TimerControls from '../components/TimerControls';
import { AMBIENT_SOUND_OPTIONS } from '../utils/audioEngine';

export default function FocusTimer({ timerControl, onOpenTaskModal }) {
  const {
    tasks,
    activeTaskId,
    setActiveTaskId,
    theme,
    setIsFocusMode,
    isAmbientPlaying,
    toggleAmbientSound,
    ambientType,
    changeAmbientType,
    ambientVolume,
    changeAmbientVolume,
    settings
  } = useApp();

  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Session Utility Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
            {timerControl.mode === 'focus'
              ? 'Deep Focus Mode'
              : timerControl.mode === 'shortBreak'
              ? 'Recharge & Rest'
              : 'Long Recovery Break'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zen Mode Button */}
          <button
            onClick={() => setIsFocusMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              theme === 'dark'
                ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title="Zen Fullscreen Focus (F)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zen Mode</span>
          </button>
        </div>
      </div>

      {/* Center Circular Timer */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border relative transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/40 border-slate-800/80'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <CircularTimer
          mode={timerControl.mode}
          remainingSeconds={timerControl.remainingSeconds}
          totalDurationSeconds={timerControl.totalDurationSeconds}
          isRunning={timerControl.isRunning}
          cycleCount={timerControl.cycleCount}
          progressPercent={timerControl.progressPercent}
        />

        {/* Timer Controls */}
        <TimerControls
          mode={timerControl.mode}
          isRunning={timerControl.isRunning}
          onToggle={timerControl.toggleTimer}
          onReset={timerControl.resetTimer}
          onSkip={timerControl.skipSession}
          onSwitchMode={timerControl.switchMode}
        />
      </div>

      {/* Task Assignment Selector */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold tracking-tight uppercase text-slate-400">
              Select Task for This Session
            </h3>
          </div>
          <button
            onClick={() => onOpenTaskModal()}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>

        {pendingTasks.length > 0 ? (
          <select
            value={activeTaskId || ''}
            onChange={(e) => setActiveTaskId(e.target.value || null)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="">-- No specific task (Free Focus) --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.priority}] {t.title} (🍅 {t.completedPomodoros}/{t.estimatedPomodoros})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-slate-400">
            No pending tasks. You can focus freely or create a new task above!
          </p>
        )}
      </div>

      {/* Overhauled Ambient Soundbar Control */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAmbientSound}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isAmbientPlaying
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
                : 'bg-purple-600 border-purple-500 text-white hover:bg-purple-500 shadow-md shadow-purple-600/20'
            }`}
          >
            {isAmbientPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Turn Off Sound</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Sound</span>
              </>
            )}
          </button>
          <div>
            <span className="text-xs font-bold block text-slate-900 dark:text-white">
              {isAmbientPlaying
                ? `${AMBIENT_SOUND_OPTIONS.find((s) => s.id === ambientType)?.label} Playing`
                : 'Ambient Audio Muted'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Procedural Web Audio Engine (Rain, Waves, Fire, Clock, Zen Bowl)
            </span>
          </div>
        </div>

        {/* Sound Type & Volume */}
        <div className="flex items-center gap-3">
          <select
            value={ambientType}
            onChange={(e) => changeAmbientType(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            {AMBIENT_SOUND_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => changeAmbientVolume(parseFloat(e.target.value))}
            className="w-24 accent-purple-500 cursor-pointer"
            title="Ambient Volume"
          />
        </div>
      </div>
    </div>
  );
}
