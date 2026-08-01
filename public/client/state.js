// StackWord — localStorage persistence for streak, XP, level, completed puzzles

const STORAGE_KEY = 'stackword_state';

const DEFAULT_STATE = {
  streak: 0,
  xp: 0,
  level: 1,
  completedPuzzles: [],     // array of date strings "YYYY-MM-DD"
  highScores: {},           // { "2026-08-01": 1240, ... }
  totalGamesPlayed: 0,
};

/**
 * Load state from localStorage.
 * @returns {{ streak: number, xp: number, level: number, completedPuzzles: string[], highScores: object, totalGamesPlayed: number }}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed }; // merge with defaults
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Save state to localStorage.
 * @param {object} state
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

/**
 * Update streak based on today's date and completion history.
 * @param {Date} date - Defaults to today.
 * @param {object} state - Current state from loadState().
 * @returns {{ streak: number, streakChanged: boolean }}
 */
export function updateStreak(date = new Date(), state) {
  const today = date.toISOString().split('T')[0];
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const playedToday = state.completedPuzzles.includes(today);
  const playedYesterday = state.completedPuzzles.includes(yesterdayStr);

  let streak = state.streak || 0;
  let streakChanged = false;

  if (playedToday) {
    // Already played today, streak stays
    return { streak, streakChanged: false };
  }

  if (playedYesterday) {
    // Consecutive day — increment
    streak += 1;
    streakChanged = true;
  } else if (state.completedPuzzles.length > 0) {
    // Gap detected — reset
    streak = 1;
    streakChanged = true;
  } else {
    // First game ever
    streak = 1;
    streakChanged = true;
  }

  return { streak, streakChanged };
}

/**
 * Record a puzzle completion.
 * @param {string} puzzleDate - "YYYY-MM-DD"
 * @param {number} score
 * @param {number} xpEarned
 * @param {object} state - Current state from loadState().
 * @returns {object} Updated state.
 */
export function recordCompletion(puzzleDate, score, xpEarned, state) {
  if (!state.completedPuzzles.includes(puzzleDate)) {
    state.completedPuzzles.push(puzzleDate);
    state.totalGamesPlayed += 1;
  }

  // Update high score for this date
  const currentHigh = state.highScores[puzzleDate] || 0;
  if (score > currentHigh) {
    state.highScores[puzzleDate] = score;
  }

  // Update XP and level
  state.xp += xpEarned;
  state.level = Math.floor(Math.sqrt(state.xp / 100)) + 1;

  // Update streak
  const { streak } = updateStreak(new Date(), state);
  state.streak = streak;

  // Persist
  saveState(state);

  return state;
}

/**
 * Check if player has already played today's puzzle.
 */
export function hasPlayedToday(date = new Date()) {
  const state = loadState();
  const today = date.toISOString().split('T')[0];
  return state.completedPuzzles.includes(today);
}

/**
 * Get total number of puzzles completed.
 */
export function getCompletedCount() {
  const state = loadState();
  return state.completedPuzzles.length;
}
