// src/utils/statistics.js
import { getLocalDateString } from './dateUtils';

/**
 * Computes all aggregate metrics from stored session logs and tasks
 */
export function calculateAggregateStats(sessions = [], tasks = [], dailyGoalSessions = 4) {
  const focusSessions = sessions.filter(s => s.type === 'focus');
  const totalSessions = focusSessions.length;

  const totalFocusMinutes = focusSessions.reduce(
    (acc, s) => acc + (Number(s.durationMinutes) || 0),
    0
  );

  const todayStr = getLocalDateString(new Date());

  // Today's sessions
  const todaySessionsList = focusSessions.filter(
    s => getLocalDateString(new Date(s.completedAt)) === todayStr
  );
  const todaySessionsCount = todaySessionsList.length;
  const todayFocusMinutes = todaySessionsList.reduce(
    (acc, s) => acc + (Number(s.durationMinutes) || 0),
    0
  );

  // This week's sessions (past 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const weekSessionsList = focusSessions.filter(s => new Date(s.completedAt) >= sevenDaysAgo);
  const weekFocusMinutes = weekSessionsList.reduce(
    (acc, s) => acc + (Number(s.durationMinutes) || 0),
    0
  );

  // Average session duration
  const avgSessionMinutes = totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0;

  // Day of week productivity distribution
  const dayOfWeekCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  focusSessions.forEach(s => {
    const d = new Date(s.completedAt).getDay();
    dayOfWeekCounts[d] = (dayOfWeekCounts[d] || 0) + (Number(s.durationMinutes) || 0);
  });

  let bestDayIndex = 1; // Default Monday
  let maxDayMinutes = -1;
  Object.entries(dayOfWeekCounts).forEach(([dayIdx, minutes]) => {
    if (minutes > maxDayMinutes) {
      maxDayMinutes = minutes;
      bestDayIndex = Number(dayIdx);
    }
  });
  const mostProductiveDay = maxDayMinutes > 0 ? dayNames[bestDayIndex] : 'N/A';

  // Check early morning or late night sessions
  let hasEarlyMorningSession = false;
  let hasLateNightSession = false;

  focusSessions.forEach(s => {
    const hour = new Date(s.completedAt).getHours();
    if (hour < 8) hasEarlyMorningSession = true;
    if (hour >= 21) hasLateNightSession = true;
  });

  // Completed tasks count
  const completedTasksCount = tasks.filter(t => t.completed).length;

  return {
    totalSessions,
    totalFocusMinutes,
    todaySessions: todaySessionsCount,
    todayFocusMinutes,
    weekFocusMinutes,
    avgSessionMinutes,
    mostProductiveDay,
    completedTasksCount,
    dailyGoalSessions,
    hasEarlyMorningSession,
    hasLateNightSession
  };
}

/**
 * Prepares 7-day or 14-day daily focus bar chart data
 */
export function getDailyChartData(sessions = [], daysCount = 7) {
  const result = [];
  const today = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Sum minutes for this date
    const daySessions = sessions.filter(
      s => s.type === 'focus' && getLocalDateString(new Date(s.completedAt)) === dateStr
    );

    const minutes = daySessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const sessionsCount = daySessions.length;

    result.push({
      dateStr,
      label: daysCount <= 7 ? dayName : formattedDate,
      minutes,
      hours: Number((minutes / 60).toFixed(1)),
      sessions: sessionsCount
    });
  }

  return result;
}

/**
 * Prepares weekly trend data (past 4 weeks)
 */
export function getWeeklyChartData(sessions = []) {
  const weeks = [];
  const now = new Date();

  for (let w = 3; w >= 0; w--) {
    const start = new Date(now.getTime() - (w * 7 + 6) * 86400000);
    const end = new Date(now.getTime() - w * 7 * 86400000);

    const weekSessions = sessions.filter(s => {
      if (s.type !== 'focus') return false;
      const sDate = new Date(s.completedAt);
      return sDate >= start && sDate <= end;
    });

    const minutes = weekSessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);

    weeks.push({
      label: `Week ${4 - w}`,
      range: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      minutes,
      hours: Number((minutes / 60).toFixed(1)),
      sessions: weekSessions.length
    });
  }

  return weeks;
}

/**
 * Prepares session type distribution (Focus vs Short Break vs Long Break)
 */
export function getSessionDistributionData(sessions = []) {
  let focus = 0;
  let shortBreak = 0;
  let longBreak = 0;

  sessions.forEach(s => {
    if (s.type === 'focus') focus++;
    else if (s.type === 'shortBreak') shortBreak++;
    else if (s.type === 'longBreak') longBreak++;
  });

  return [
    { name: 'Focus Work', value: focus, color: '#8b5cf6' },
    { name: 'Short Breaks', value: shortBreak, color: '#06b6d4' },
    { name: 'Long Breaks', value: longBreak, color: '#10b981' }
  ].filter(item => item.value > 0);
}

/**
 * Returns focus heatmap grid data for the last 35 days (5 weeks x 7 days)
 */
export function getHeatmapData(sessions = []) {
  const days = [];
  const today = new Date();

  // Create lookup for minutes per date
  const minutesByDate = {};
  sessions.forEach(s => {
    if (s.type === 'focus') {
      const dStr = getLocalDateString(new Date(s.completedAt));
      minutesByDate[dStr] = (minutesByDate[dStr] || 0) + (Number(s.durationMinutes) || 0);
    }
  });

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);
    const minutes = minutesByDate[dateStr] || 0;

    // Intensity levels from 0 to 4
    let intensity = 0;
    if (minutes > 0 && minutes < 25) intensity = 1;
    else if (minutes >= 25 && minutes < 60) intensity = 2;
    else if (minutes >= 60 && minutes < 120) intensity = 3;
    else if (minutes >= 120) intensity = 4;

    days.push({
      dateStr,
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      minutes,
      intensity
    });
  }

  return days;
}
