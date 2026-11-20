// src/components/ZenFocusMode.jsx
import React, { useEffect } from 'react';
import { Minimize2, Volume2, VolumeX, Target, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatSecondsToTime } from '../utils/dateUtils';
import { AMBIENT_SOUND_OPTIONS } from '../utils/audioEngine';

export default function ZenFocusMode({ timerControl }) {
  const {
    isFocusMode,
    setIsFocusMode,
    activeTask,
    isAmbientPlaying,
    toggleAmbientSound,
    ambientType,
    changeAmbientType,
    ambientVolume,
    changeAmbientVolume
  } = useApp();

  // Escape key closes Zen Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, setIsFocusMode]);

  if (!isFocusMode) return null;

  const modeLabels = {
    focus: 'DEEP FOCUS SESSION',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK'
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070a12] text-white flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-300">
      {/* Top Bar in Zen Mode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
          <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
            FocusFlow Zen Mode
          </span>
        </div>

        {/* Ambient & Exit */}
        <div className="flex items-center gap-3">
          {/* Ambient Sound Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <button
              onClick={toggleAmbientSound}
              className="text-purple-400 hover:text-purple-300"
              title="Toggle sound"
            >
              {isAmbientPlaying ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
            <select
              value={ambientType}
              onChange={(e) => changeAmbientType(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              {AMBIENT_SOUND_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                  {opt.shortLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsFocusMode(false)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Exit Zen Mode (Esc)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Giant Countdown & Active Task */}
      <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto">
        <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-purple-400 mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          {modeLabels[timerControl.mode] || 'FOCUS'}
        </span>

        {/* Giant Monospace Timer */}
        <div className="font-mono text-7xl sm:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(168,85,247,0.35)] mb-6">
          {formatSecondsToTime(timerControl.remainingSeconds)}
        </div>

        {/* Active Task Details */}
        {activeTask ? (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-200 shadow-lg">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">{activeTask.title}</span>
            <span className="text-xs font-mono font-bold text-purple-400 ml-1">
              🍅 {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No specific task assigned</p>
        )}

        {/* Minimal Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={timerControl.resetTimer}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={timerControl.toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all ${
              timerControl.isRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30'
            }`}
          >
            {timerControl.isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>START</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-slate-500">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Esc</kbd> or click the minimize icon to return
      </div>
    </div>
  );
}
