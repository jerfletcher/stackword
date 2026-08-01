// StackWord — Core game logic

/**
 * Create a new game from a puzzle.
 * @param {{ letters: string[], words: string[], theme: string, date: string }} puzzle
 * @returns {Game}
 */
export function createGame(puzzle) {
  return {
    puzzle,
    wordsFound: [],
    score: 0,
    combo: 0,       // consecutive correct words
    maxCombo: 0,
    xp: 0,
    guesses: [],    // all guesses made (for tracking wrong attempts)
  };
}

/**
 * Check if a guess is a valid word in this puzzle.
 * @param {string} guess
 * @param {Game} game
 * @returns {{ valid: boolean, isNew: boolean, points: number, combo: number, xp: number }}
 */
export function checkWord(guess, game) {
  const lower = guess.toLowerCase();
  const alreadyFound = game.wordsFound.some(w => w.toLowerCase() === lower);
  const isWord = game.puzzle.words.some(w => w.toLowerCase() === lower);

  if (!isWord) {
    // Invalid word breaks combo
    game.combo = 0;
    game.guesses.push({ word: lower, valid: false });
    return { valid: false, isNew: false, points: 0, combo: 0, xp: 0 };
  }

  if (alreadyFound) {
    // Already found — doesn't break combo but no points
    return { valid: true, isNew: false, points: 0, combo: game.combo, xp: 0 };
  }

  // New valid word
  game.combo += 1;
  if (game.combo > game.maxCombo) game.maxCombo = game.combo;

  const basePoints = lower.length * 10;
  const multiplier = Math.min(game.combo, 5); // max 5x combo
  const points = basePoints * multiplier;
  const xp = Math.floor(points * 1.5);

  game.wordsFound.push(lower);
  game.score += points;
  game.xp += xp;
  game.guesses.push({ word: lower, valid: true });

  return { valid: true, isNew: true, points, combo: game.combo, xp };
}

/**
 * Check if puzzle is complete.
 */
export function isComplete(game) {
  return game.wordsFound.length >= game.puzzle.words.length;
}

/**
 * Calculate level from XP.
 */
export function getLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Remaining words count.
 */
export function remainingWords(game) {
  return game.puzzle.words.length - game.wordsFound.length;
}
