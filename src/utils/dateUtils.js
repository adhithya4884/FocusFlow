// src/utils/dateUtils.js

/**
 * Returns YYYY-MM-DD string in local time
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats seconds into MM:SS
 */
export function formatSecondsToTime(seconds) {
  const safeSec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSec / 60);
  const s = safeSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Formats minutes into human-readable e.g. "2h 15m" or "45m"
 */
export function formatMinutesHuman(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

/**
 * Gets personalized greeting based on hour of day
 */
export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Formats a date into a clean display: "Friday, Nov 20, 2026"
 */
export function formatDisplayDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Calculates current streak and longest streak accurately
 * @param {Array} sessionDates - Array of YYYY-MM-DD date strings
 */
export function calculateStreaks(sessionDates = []) {
  if (!sessionDates || sessionDates.length === 0) {
    return { current: 0, longest: 0, lastActiveDate: null };
  }

  const uniqueDates = [...new Set(sessionDates)].sort();
  const dateSet = new Set(uniqueDates);

  const today = getLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let currentStreak = 0;
  let checkDate = new Date();

  if (dateSet.has(today)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (dateSet.has(yesterdayStr)) {
    currentStreak = 1;
    checkDate = yesterday;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    currentStreak = 0;
  }

  if (currentStreak > 0) {
    while (true) {
      const prevStr = getLocalDateString(checkDate);
      if (dateSet.has(prevStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDateObj = null;

  for (const dateStr of uniqueDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDateObj = new Date(y, m - 1, d);

    if (!prevDateObj) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currentDateObj - prevDateObj);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDateObj = currentDateObj;
  }

  return {
    current: currentStreak,
    longest: Math.max(currentStreak, longestStreak),
    lastActiveDate: uniqueDates[uniqueDates.length - 1] || null
  };
}

/**
 * Calculates detailed streak breakdown for week & month tooltip
 */
export function getDetailedStreakStats(sessions = []) {
  const focusSessions = sessions.filter(s => s.type === 'focus');
  const sessionDates = focusSessions.map(s => getLocalDateString(new Date(s.completedAt)));
  const dateSet = new Set(sessionDates);
  const streak = calculateStreaks(sessionDates);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // 1. THIS WEEK'S BREAKDOWN (Monday to Sunday)
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  // Days since Monday: if Sun(0) -> 6, if Mon(1) -> 0, etc.
  const diffToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - diffToMonday);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const fullDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let weekActiveCount = 0;
  let weekFocusMinutes = 0;

  const weekDays = dayLabels.map((label, idx) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + idx);
    const dStr = getLocalDateString(d);
    const isActive = dateSet.has(dStr);
    const isToday = dStr === getLocalDateString(today);
    const isFuture = d > today && !isToday;

    // Sum focus minutes
    const daySessions = focusSessions.filter(
      s => getLocalDateString(new Date(s.completedAt)) === dStr
    );
    const dayMinutes = daySessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);

    if (isActive) {
      weekActiveCount++;
      weekFocusMinutes += dayMinutes;
    }

    return {
      label,
      fullDay: fullDayNames[idx],
      dateStr: dStr,
      dayNum: d.getDate(),
      isActive,
      isToday,
      isFuture,
      minutes: dayMinutes
    };
  });

  // 2. THIS MONTH'S BREAKDOWN
  const monthName = today.toLocaleString('en-US', { month: 'long' });
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let monthActiveCount = 0;
  let monthFocusMinutes = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateSet.has(dStr)) {
      monthActiveCount++;
      const daySessions = focusSessions.filter(
        s => getLocalDateString(new Date(s.completedAt)) === dStr
      );
      monthFocusMinutes += daySessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    }
  }

  const daysElapsedInMonth = today.getDate();
  const monthConsistencyPercent = Math.round((monthActiveCount / daysElapsedInMonth) * 100);

  return {
    streak,
    weekActiveCount,
    weekDays,
    weekFocusMinutes,
    monthName,
    currentYear,
    monthActiveCount,
    totalDaysInMonth,
    daysElapsedInMonth,
    monthFocusMinutes,
    monthConsistencyPercent
  };
}
