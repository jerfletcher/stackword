// StackWord — Word list data and daily puzzle generation

/**
 * Puzzle groups — each has letters, valid words, and a theme.
 * Daily puzzle is selected by hashing the date to an index.
 */
export const PUZZLE_GROUPS = [
  {
    letters: ['S', 'T', 'A', 'C', 'K', 'W', 'O', 'R', 'D'],
    words: ['stack', 'word', 'cat', 'cow', 'tar', 'art', 'raw', 'war', 'stock', 'act', 'cot', 'rod', 'saw', 'row'],
    theme: 'Technology'
  },
  {
    letters: ['M', 'O', 'U', 'N', 'T', 'A', 'I', 'N'],
    words: ['mount', 'mountain', 'mountains', 'mountaineering', 'mountaineer', 'mountaineers'],
    theme: 'Nature'
  },
  {
    letters: ['S', 'U', 'N', 'F', 'L', 'O', 'W', 'E', 'R'],
    words: ['sun', 'sunflower', 'sunflowers', 'flower', 'flowers', 'flow', 'flowed', 'flowered', 'flowerer', 'flowerers', 'flowering', 'flowerings', 'flowerist', 'flowerists'],
    theme: 'Nature'
  },
  {
    letters: ['L', 'A', 'K', 'E', 'W', 'A', 'T', 'E', 'R'],
    words: ['lake', 'lakefront', 'lakefronts', 'lakeside', 'lakesides', 'lakeshore', 'lakeshores', 'lakeshored', 'lakeshoring'],
    theme: 'Nature'
  },
  {
    letters: ['R', 'I', 'V', 'E', 'R', 'B', 'O', 'A', 'T'],
    words: ['river', 'boat', 'riverboat', 'riverboats', 'riverine', 'riverbank', 'riverbanks', 'riverbed', 'riverbeds'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'I', 'N', 'E', 'F', 'O', 'R', 'E', 'S', 'T'],
    words: ['pine', 'forest', 'pineforest', 'pineforests', 'pinecone', 'pinecones', 'pineconed', 'pineconing'],
    theme: 'Nature'
  },
  {
    letters: ['M', 'E', 'A', 'D', 'O', 'W', 'B', 'L', 'O', 'S', 'S', 'O', 'M'],
    words: ['meadow', 'blossom', 'blossoms', 'blossoming', 'blossomings', 'meadowlark', 'meadowlarks', 'meadowbird', 'meadowbirds', 'meadowgrass', 'meadowgrasses'],
    theme: 'Nature'
  },
  {
    letters: ['O', 'C', 'E', 'A', 'N', 'W', 'A', 'V', 'E'],
    words: ['ocean', 'wave', 'oceanwave', 'oceanwaves', 'oceanic'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'A', 'S', 'T', 'A', 'T', 'O', 'M', 'A', 'T', 'O'],
    words: ['pasta', 'tomato', 'tomatoes', 'tomatosauce', 'tomatosauces'],
    theme: 'Food'
  },
  {
    letters: ['T', 'H', 'U', 'N', 'D', 'E', 'R', 'B', 'O', 'L', 'T'],
    words: ['thunder', 'bolt', 'thunderbolt', 'thunderbolts', 'thunderbird', 'thunderbirds', 'thunderous', 'thunderclap', 'thunderclaps', 'thunderhead', 'thunderheads'],
    theme: 'Weather'
  },
  {
    letters: ['W', 'A', 'T', 'E', 'R', 'F', 'A', 'L', 'L'],
    words: ['water', 'fall', 'waterfall', 'waterfalls'],
    theme: 'Nature'
  },
  {
    letters: ['S', 'T', 'A', 'R', 'L', 'I', 'G', 'H', 'T'],
    words: ['star', 'light', 'starlight', 'starlights', 'starfish', 'starfishes', 'starling', 'starlings', 'starlit', 'starlike', 'starless'],
    theme: 'Space'
  },
  {
    letters: ['M', 'O', 'U', 'N', 'T', 'A', 'I', 'N'],
    words: ['mount', 'mountain', 'mountains', 'mountaineering', 'mountaineer', 'mountaineers'],
    theme: 'Nature'
  },
  {
    letters: ['S', 'U', 'N', 'F', 'L', 'O', 'W', 'E', 'R'],
    words: ['sun', 'sunflower', 'sunflowers', 'flower', 'flowers', 'flow', 'flowed', 'flowered', 'flowerer', 'flowerers', 'flowering', 'flowerings', 'flowerist', 'flowerists'],
    theme: 'Nature'
  },
  {
    letters: ['L', 'A', 'K', 'E', 'W', 'A', 'T', 'E', 'R'],
    words: ['lake', 'lakefront', 'lakefronts', 'lakeside', 'lakesides', 'lakeshore', 'lakeshores', 'lakeshored', 'lakeshoring'],
    theme: 'Nature'
  },
  {
    letters: ['R', 'I', 'V', 'E', 'R', 'B', 'O', 'A', 'T'],
    words: ['river', 'boat', 'riverboat', 'riverboats', 'riverine', 'riverbank', 'riverbanks', 'riverbed', 'riverbeds'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'I', 'N', 'E', 'F', 'O', 'R', 'E', 'S', 'T'],
    words: ['pine', 'forest', 'pineforest', 'pineforests', 'pinecone', 'pinecones', 'pineconed', 'pineconing'],
    theme: 'Nature'
  },
  {
    letters: ['M', 'E', 'A', 'D', 'O', 'W', 'B', 'L', 'O', 'S', 'S', 'O', 'M'],
    words: ['meadow', 'blossom', 'blossoms', 'blossoming', 'blossomings', 'meadowlark', 'meadowlarks', 'meadowbird', 'meadowbirds', 'meadowgrass', 'meadowgrasses'],
    theme: 'Nature'
  },
  {
    letters: ['O', 'C', 'E', 'A', 'N', 'W', 'A', 'V', 'E'],
    words: ['ocean', 'wave', 'oceanwave', 'oceanwaves', 'oceanic'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'A', 'S', 'T', 'A', 'T', 'O', 'M', 'A', 'T', 'O'],
    words: ['pasta', 'tomato', 'tomatoes', 'tomatosauce', 'tomatosauces'],
    theme: 'Food'
  },
  {
    letters: ['T', 'H', 'U', 'N', 'D', 'E', 'R', 'B', 'O', 'L', 'T'],
    words: ['thunder', 'bolt', 'thunderbolt', 'thunderbolts', 'thunderbird', 'thunderbirds', 'thunderous', 'thunderclap', 'thunderclaps', 'thunderhead', 'thunderheads'],
    theme: 'Weather'
  },
  {
    letters: ['W', 'A', 'T', 'E', 'R', 'F', 'A', 'L', 'L'],
    words: ['water', 'fall', 'waterfall', 'waterfalls'],
    theme: 'Nature'
  },
  {
    letters: ['S', 'T', 'A', 'R', 'L', 'I', 'G', 'H', 'T'],
    words: ['star', 'light', 'starlight', 'starlights', 'starfish', 'starfishes', 'starling', 'starlings', 'starlit', 'starlike', 'starless'],
    theme: 'Space'
  },
  {
    letters: ['M', 'O', 'U', 'N', 'T', 'A', 'I', 'N'],
    words: ['mount', 'mountain', 'mountains', 'mountaineering', 'mountaineer', 'mountaineers'],
    theme: 'Nature'
  },
  {
    letters: ['S', 'U', 'N', 'F', 'L', 'O', 'W', 'E', 'R'],
    words: ['sun', 'sunflower', 'sunflowers', 'flower', 'flowers', 'flow', 'flowed', 'flowered', 'flowerer', 'flowerers', 'flowering', 'flowerings', 'flowerist', 'flowerists'],
    theme: 'Nature'
  },
  {
    letters: ['L', 'A', 'K', 'E', 'W', 'A', 'T', 'E', 'R'],
    words: ['lake', 'lakefront', 'lakefronts', 'lakeside', 'lakesides', 'lakeshore', 'lakeshores', 'lakeshored', 'lakeshoring'],
    theme: 'Nature'
  },
  {
    letters: ['R', 'I', 'V', 'E', 'R', 'B', 'O', 'A', 'T'],
    words: ['river', 'boat', 'riverboat', 'riverboats', 'riverine', 'riverbank', 'riverbanks', 'riverbed', 'riverbeds'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'I', 'N', 'E', 'F', 'O', 'R', 'E', 'S', 'T'],
    words: ['pine', 'forest', 'pineforest', 'pineforests', 'pinecone', 'pinecones', 'pineconed', 'pineconing'],
    theme: 'Nature'
  },
  {
    letters: ['M', 'E', 'A', 'D', 'O', 'W', 'B', 'L', 'O', 'S', 'S', 'O', 'M'],
    words: ['meadow', 'blossom', 'blossoms', 'blossoming', 'blossomings', 'meadowlark', 'meadowlarks', 'meadowbird', 'meadowbirds', 'meadowgrass', 'meadowgrasses'],
    theme: 'Nature'
  },
  {
    letters: ['O', 'C', 'E', 'A', 'N', 'W', 'A', 'V', 'E'],
    words: ['ocean', 'wave', 'oceanwave', 'oceanwaves', 'oceanic'],
    theme: 'Nature'
  },
  {
    letters: ['P', 'A', 'S', 'T', 'A', 'T', 'O', 'M', 'A', 'T', 'O'],
    words: ['pasta', 'tomato', 'tomatoes', 'tomatosauce', 'tomatosauces'],
    theme: 'Food'
  }
];

/**
 * Simple hash of a date string to a consistent index.
 */
function dateToIndex(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % PUZZLE_GROUPS.length;
}

/**
 * Get the daily puzzle for a given date.
 * @param {Date} date - Defaults to today.
 * @returns {{ letters: string[], words: string[], theme: string, date: string }}
 */
export function getDailyPuzzle(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const puzzle = PUZZLE_GROUPS[dateToIndex(dateStr)];
  return { ...puzzle, date: dateStr };
}

/**
 * Get all puzzle groups (for practice mode, etc.)
 */
export function getAllPuzzles() {
  return PUZZLE_GROUPS;
}
