// src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';
import { sendBrowserNotification } from '../utils/notifications';

export function usePomodoro() {
  const {
    settings,
    recordCompletedSession,
    activeTask,
    activeTaskId,
    showToast,
    triggerConfetti
  } = useApp();

  // Mode durations in seconds
  const getDurationForMode = useCallback(
    (mode) => {
      switch (mode) {
        case 'shortBreak':
          return (settings.shortBreakDuration || 5) * 60;
        case 'longBreak':
          return (settings.longBreakDuration || 15) * 60;
        case 'focus':
        default:
          return (settings.workDuration || 25) * 60;
      }
    },
    [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration]
  );

  // Initialize timer state from localStorage or defaults
  const [timerState, setTimerState] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.ACTIVE_TIMER, null);
    const defaultMode = 'focus';
    const defaultDuration = (settings.workDuration || 25) * 60;

    if (!saved) {
      return {
        mode: defaultMode,
        remainingSeconds: defaultDuration,
        totalDurationSeconds: defaultDuration,
        isRunning: false,
        targetEndTime: null,
        cycleCount: 1,
        startedAt: null
      };
    }

    // Recovering from page refresh
    if (saved.isRunning && saved.targetEndTime) {
      const now = Date.now();
      const diffSec = Math.round((saved.targetEndTime - now) / 1000);

      if (diffSec <= 0) {
        // Timer completed during refresh/offline
        return {
          ...saved,
          remainingSeconds: 0,
          isRunning: false,
          targetEndTime: null
        };
      } else {
        // Timer still running! Resume accurately
        return {
          ...saved,
          remainingSeconds: diffSec
        };
      }
    }

    return saved;
  });

  const intervalRef = useRef(null);

  // Sync state to LocalStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.ACTIVE_TIMER, timerState);
  }, [timerState]);

  // Handle completion of a session
  const completeSession = useCallback(() => {
    const currentMode = timerState.mode;
    const isFocus = currentMode === 'focus';
    const durationMins = Math.round(timerState.totalDurationSeconds / 60);

    // Audio Alert
    if (settings.soundEnabled) {
      audioEngine.playChime(settings.soundType || 'zen', settings.soundVolume || 0.7);
    }

    // Browser Notification
    if (settings.notificationEnabled) {
      const title = isFocus ? '🎉 Focus Session Finished!' : '🔔 Break is Over!';
      const body = isFocus
        ? `Great job! You finished ${durationMins} minutes of deep focus. Take a break!`
        : 'Time to get back in the zone. Ready for another focus session?';
      sendBrowserNotification(title, { body });
    }

    // Record session
    recordCompletedSession({
      type: currentMode,
      durationMinutes: durationMins,
      taskId: isFocus ? activeTaskId : null,
      taskTitle: isFocus && activeTask ? activeTask.title : null
    });

    if (isFocus) {
      triggerConfetti();
      showToast(`🎯 Pomodoro completed! (${durationMins}m)`, 'success');
    } else {
      showToast('☕ Break completed!', 'info');
    }

    // Determine next mode and cycle count
    let nextMode = 'focus';
    let nextCycle = timerState.cycleCount;
    let shouldAutoStart = false;

    if (isFocus) {
      const isLongBreakDue = timerState.cycleCount >= (settings.longBreakInterval || 4);
      if (isLongBreakDue) {
        nextMode = 'longBreak';
        nextCycle = 1; // Reset cycle
      } else {
        nextMode = 'shortBreak';
        nextCycle = timerState.cycleCount + 1;
      }
      shouldAutoStart = Boolean(settings.autoStartBreaks);
    } else {
      nextMode = 'focus';
      shouldAutoStart = Boolean(settings.autoStartWork);
    }

    const nextDuration = getDurationForMode(nextMode);
    const now = Date.now();

    setTimerState({
      mode: nextMode,
      remainingSeconds: nextDuration,
      totalDurationSeconds: nextDuration,
      isRunning: shouldAutoStart,
      targetEndTime: shouldAutoStart ? now + nextDuration * 1000 : null,
      cycleCount: nextCycle,
      startedAt: shouldAutoStart ? now : null
    });
  }, [
    timerState.mode,
    timerState.totalDurationSeconds,
    timerState.cycleCount,
    settings.soundEnabled,
    settings.soundType,
    settings.soundVolume,
    settings.notificationEnabled,
    settings.longBreakInterval,
    settings.autoStartBreaks,
    settings.autoStartWork,
    recordCompletedSession,
    activeTaskId,
    activeTask,
    triggerConfetti,
    showToast,
    getDurationForMode
  ]);

  // Master Timer Tick Effect (Uses Date.now() timestamp deltas to prevent background tab drift)
  useEffect(() => {
    if (timerState.isRunning && timerState.targetEndTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.round((timerState.targetEndTime - now) / 1000));

        if (diffSeconds <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          completeSession();
        } else {
          setTimerState(prev => ({
            ...prev,
            remainingSeconds: diffSeconds
          }));
        }
      }, 300); // 300ms polling ensures smooth sub-second catchup
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.targetEndTime, completeSession]);

  // Controls: Start
  const startTimer = useCallback(() => {
    const now = Date.now();
    const targetEnd = now + timerState.remainingSeconds * 1000;

    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      targetEndTime: targetEnd,
      startedAt: prev.startedAt || now
    }));
  }, [timerState.remainingSeconds]);

  // Controls: Pause
  const pauseTimer = useCallback(() => {
    if (!timerState.isRunning) return;
    const now = Date.now();
    const exactRemaining = Math.max(0, Math.round((timerState.targetEndTime - now) / 1000));

    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      targetEndTime: null,
      remainingSeconds: exactRemaining
    }));
  }, [timerState.isRunning, timerState.targetEndTime]);

  // Controls: Toggle Start/Pause
  const toggleTimer = useCallback(() => {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [timerState.isRunning, pauseTimer, startTimer]);

  // Controls: Reset
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const duration = getDurationForMode(timerState.mode);
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      targetEndTime: null,
      remainingSeconds: duration,
      totalDurationSeconds: duration,
      startedAt: null
    }));
    showToast('Timer reset', 'info');
  }, [timerState.mode, getDurationForMode, showToast]);

  // Controls: Skip session
  const skipSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    let nextMode = 'focus';
    let nextCycle = timerState.cycleCount;

    if (timerState.mode === 'focus') {
      const isLongBreak = timerState.cycleCount >= (settings.longBreakInterval || 4);
      nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
      nextCycle = isLongBreak ? 1 : timerState.cycleCount + 1;
    } else {
      nextMode = 'focus';
    }

    const duration = getDurationForMode(nextMode);
    setTimerState({
      mode: nextMode,
      remainingSeconds: duration,
      totalDurationSeconds: duration,
      isRunning: false,
      targetEndTime: null,
      cycleCount: nextCycle,
      startedAt: null
    });

    showToast(`Skipped to ${nextMode === 'focus' ? 'Focus' : nextMode === 'shortBreak' ? 'Short Break' : 'Long Break'}`, 'info');
  }, [timerState.mode, timerState.cycleCount, settings.longBreakInterval, getDurationForMode, showToast]);

  // Controls: Manual Mode Switch
  const switchMode = useCallback(
    (newMode) => {
      if (newMode === timerState.mode && !timerState.isRunning) return;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const duration = getDurationForMode(newMode);
      setTimerState(prev => ({
        ...prev,
        mode: newMode,
        remainingSeconds: duration,
        totalDurationSeconds: duration,
        isRunning: false,
        targetEndTime: null,
        startedAt: null
      }));
    },
    [timerState.mode, timerState.isRunning, getDurationForMode]
  );

  // Update duration if user updates settings while timer is reset (not running)
  useEffect(() => {
    if (!timerState.isRunning && timerState.remainingSeconds === timerState.totalDurationSeconds) {
      const newDuration = getDurationForMode(timerState.mode);
      if (newDuration !== timerState.totalDurationSeconds) {
        setTimerState(prev => ({
          ...prev,
          remainingSeconds: newDuration,
          totalDurationSeconds: newDuration
        }));
      }
    }
  }, [
    settings.workDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    timerState.isRunning,
    timerState.remainingSeconds,
    timerState.totalDurationSeconds,
    timerState.mode,
    getDurationForMode
  ]);

  // Calculate progress percentage (0 to 100)
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      ((timerState.totalDurationSeconds - timerState.remainingSeconds) /
        timerState.totalDurationSeconds) *
        100
    )
  );

  return {
    mode: timerState.mode,
    remainingSeconds: timerState.remainingSeconds,
    totalDurationSeconds: timerState.totalDurationSeconds,
    isRunning: timerState.isRunning,
    cycleCount: timerState.cycleCount,
    progressPercent,
    startTimer,
    pauseTimer,
    toggleTimer,
    resetTimer,
    skipSession,
    switchMode
  };
}
