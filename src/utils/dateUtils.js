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

  // Deduplicate and sort dates ascending
  const uniqueDates = [...new Set(sessionDates)].sort();
  const dateSet = new Set(uniqueDates);

  const today = getLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // Check if active today or yesterday for current streak
  let currentStreak = 0;
  let checkDate = new Date();
  let checkStr = getLocalDateString(checkDate);

  // If user completed today, start counting from today
  // If not completed today, but completed yesterday, streak is still alive!
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

  // Count backwards consecutively
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

  // Calculate longest streak across history
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
