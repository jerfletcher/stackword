// StackWord — Generate shareable result text

/**
 * Generate share text for puzzle results.
 * @param {Game} game
 * @param {{ streak: number, level: number }} state
 * @returns {string}
 */
export function generateShareText(game, state) {
  const { wordsFound, puzzle, score, maxCombo, xp } = game;
  const totalWords = puzzle.words.length;
  const found = wordsFound.length;

  // Word grid — █ for found, _ for remaining
  const foundBlocks = '█'.repeat(found);
  const remainingBlocks = '_'.repeat(totalWords - found);
  const grid = foundBlocks + remainingBlocks;

  const status = found >= totalWords ? '🏆' : '🎮';

  const lines = [
    `StackWord #${puzzle.date}`,
    `${grid} ${found}/${totalWords} words`,
    `Score: ${score} | Combo: ${maxCombo}x`,
    `XP: ${xp} | Level: ${state.level}`,
    `🔥 Streak: ${state.streak} days`,
    ``,
    `Theme: ${puzzle.theme}`,
  ];

  return lines.join('\n');
}

/**
 * Try to share via Web Share API, fallback to clipboard copy.
 * @param {string} text
 */
export async function shareOrCopy(text) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'StackWord', text });
      return;
    } catch {
      // User cancelled share, fall through to copy
    }
  }
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    console.warn('Share and copy failed');
  }
}
