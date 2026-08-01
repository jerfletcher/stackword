// GameBoard — All interactive game logic
(async () => {
  const { createGame, checkWord, isComplete } = await import('./game.js');
  const { loadState, recordCompletion, saveState } = await import('./state.js');
  const { generateShareText, shareOrCopy } = await import('./share.js');
  const { getDailyPuzzle } = await import('./words.js');

  // DOM elements
  const currentWordEl = document.getElementById('sw-current-word');
  const foundWordsEl = document.getElementById('sw-found-words');
  const progressEl = document.getElementById('sw-progress');
  const letterTilesEl = document.getElementById('sw-letter-tiles');
  const clearBtn = document.getElementById('sw-clear-btn');
  const checkBtn = document.getElementById('sw-check-btn');
  const resultsEl = document.getElementById('sw-results');
  const shareBtn = document.getElementById('sw-share-btn');
  const shareFeedbackEl = document.getElementById('sw-share-copy-feedback');

  // Game state
  const puzzle = getDailyPuzzle();
  const game = createGame(puzzle);
  let persistentState = loadState();
  let currentInput = '';
  let gameFinished = false;

  // --- Render letter tiles ---
  function renderTiles() {
    letterTilesEl.innerHTML = '';
    puzzle.letters.forEach((letter, index) => {
      const tile = document.createElement('button');
      tile.className = 'sw-letter-tile w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center transition-all duration-200 active:scale-90 select-none';
      tile.textContent = letter;
      tile.dataset.letter = letter;
      tile.dataset.index = index;

      if (index === 0) {
        // Root letter — highlighted
        tile.classList.add(
          'bg-gradient-to-br', 'from-violet-500', 'to-indigo-600',
          'text-white', 'shadow-lg', 'shadow-violet-500/30',
          'w-13', 'h-13', 'sm:w-14', 'sm:h-14', 'md:w-16', 'md:h-16',
          'text-xl', 'sm:text-2xl'
        );
      } else {
        tile.classList.add(
          'bg-gray-800', 'hover:bg-gray-700', 'text-gray-200',
          'border', 'border-gray-700', 'hover:border-violet-500/50'
        );
      }

      tile.addEventListener('click', () => handleLetterClick(letter, tile));
      letterTilesEl.appendChild(tile);
    });
  }

  // --- Update word input display ---
  function updateInputDisplay() {
    if (!currentWordEl) return;
    if (currentInput.length === 0) {
      currentWordEl.innerHTML = '<span class="text-gray-600 text-lg font-normal">Tap letters to build a word</span>';
    } else {
      currentWordEl.innerHTML = currentInput.split('').map(ch =>
        `<span class="text-white">${ch.toUpperCase()}</span>`
      ).join('');
    }
  }

  // --- Update progress ---
  function updateProgress() {
    if (!progressEl) return;
    const found = game.wordsFound.length;
    const total = puzzle.words.length;
    progressEl.textContent = `${found} / ${total} words found`;
  }

  // --- Add found word to stack ---
  function addWordToStack(word, points, combo) {
    if (!foundWordsEl) return;
    const entry = document.createElement('div');
    entry.className = 'sw-word-entry flex items-center justify-between px-3 py-2 bg-gray-800/60 rounded-lg border border-gray-700/50';

    const comboLabel = combo > 1 ? ` ${combo}x` : '';

    entry.innerHTML = `
      <span class="font-semibold text-white capitalize">${word}</span>
      <span class="text-xs">
        <span class="text-violet-400 font-bold">+${points}</span>
        <span class="text-violet-500/60">${comboLabel}</span>
      </span>
    `;

    foundWordsEl.appendChild(entry);

    // Scroll to bottom of found words
    entry.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  // --- Dispatch score update event for ScoreBoard ---
  function dispatchScoreUpdate() {
    const today = new Date().toISOString().split('T')[0];
    const todayHigh = persistentState.highScores?.[today] ?? game.score;

    window.dispatchEvent(new CustomEvent('game-score-update', {
      detail: {
        score: game.score,
        combo: game.combo,
        totalXp: persistentState.xp + game.xp,
        level: Math.floor(Math.sqrt((persistentState.xp + game.xp) / 100)) + 1,
        todayHighScore: Math.max(game.score, todayHigh)
      }
    }));
  }

  // --- Handle letter tile click ---
  function handleLetterClick(letter, tileEl) {
    if (gameFinished) return;
    if (currentInput.length >= 12) return; // Max word length

    currentInput += letter;
    updateInputDisplay();

    // Tile press animation
    tileEl.classList.add('sw-tile-press');
    setTimeout(() => tileEl.classList.remove('sw-tile-press'), 150);
  }

  // --- Shake animation for wrong guesses ---
  function shakeInput() {
    if (!currentWordEl) return;
    currentWordEl.classList.add('sw-shake');
    setTimeout(() => currentWordEl.classList.remove('sw-shake'), 400);
  }

  // --- Check Word ---
  function handleCheckWord() {
    if (gameFinished) return;
    if (currentInput.length < 2) {
      shakeInput();
      return;
    }

    const guess = currentInput.trim().toLowerCase();
    const result = checkWord(guess, game);

    if (result.valid && result.isNew) {
      // Correct — new word found!
      addWordToStack(guess, result.points, result.combo);
      updateProgress();
      dispatchScoreUpdate();

      // Combo glow effect on score
      if (result.combo > 1) {
        const scoreDisplay = document.getElementById('sw-score');
        if (scoreDisplay) {
          scoreDisplay.classList.add('sw-combo-glow');
          setTimeout(() => scoreDisplay.classList.remove('sw-combo-glow'), 1500);
        }
      }

      // Check for puzzle completion
      if (isComplete(game)) {
        handlePuzzleComplete();
        return;
      }
    } else if (result.valid && !result.isNew) {
      // Already found — brief visual feedback
      currentWordEl.innerHTML = '<span class="text-amber-400 text-lg">Already found!</span>';
    } else {
      // Invalid word
      shakeInput();
      currentWordEl.innerHTML = '<span class="text-red-400 text-lg">Not a valid word</span>';
      setTimeout(() => {
        if (currentInput.length > 0) {
          updateInputDisplay();
        }
      }, 800);
    }

    // Clear input after a short delay
    setTimeout(() => {
      currentInput = '';
      updateInputDisplay();
    }, result.valid ? 300 : 1200);
  }

  // --- Clear input ---
  function handleClear() {
    if (gameFinished) return;
    currentInput = '';
    updateInputDisplay();
  }

  // --- Puzzle complete ---
  function handlePuzzleComplete() {
    gameFinished = true;

    // Record completion
    const today = new Date().toISOString().split('T')[0];
    persistentState = recordCompletion(today, game.score, game.xp, persistentState);

    // Update results card
    const totalWords = puzzle.words.length;
    document.getElementById('sw-result-score').textContent = game.score.toLocaleString();
    document.getElementById('sw-result-words').textContent = `${totalWords}/${totalWords}`;
    document.getElementById('sw-result-combo').textContent = `${game.maxCombo}x`;
    document.getElementById('sw-result-xp').textContent = `+${game.xp}`;
    document.getElementById('sw-result-streak').textContent = `${persistentState.streak} days`;

    // Show results
    resultsEl.classList.remove('hidden');

    // Final score dispatch
    dispatchScoreUpdate();

    // Hide game controls
    clearBtn.classList.add('hidden');
    checkBtn.classList.add('hidden');
  }

  // --- Share ---
  async function handleShare() {
    if (!shareBtn || !shareFeedbackEl) return;

    const shareText = generateShareText(game, persistentState);
    await shareOrCopy(shareText);

    // Show feedback
    shareBtn.textContent = '✓ Copied!';
    shareBtn.classList.add('bg-emerald-600');
    shareFeedbackEl.classList.remove('hidden');

    setTimeout(() => {
      shareBtn.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.5.46 1.19.76 1.96.76 1.54 0 2.79-1.25 2.79-2.79S19.54 2.37 18 2.37 15.21 3.62 15.21 5.16c0 .24.04.47.09.7L8.25 9.97C7.76 9.49 7.08 9.2 6.34 9.2 4.8 9.2 3.54 10.45 3.54 12s1.26 2.79 2.8 2.79c.74 0 1.42-.29 1.91-.77l7.11 4.15c-.05.21-.08.43-.08.66 0 1.54 1.25 2.79 2.79 2.79s2.79-1.25 2.79-2.79-1.25-2.79-2.79-2.79z"/></svg>
        Share Results
      `;
      shareBtn.classList.remove('bg-emerald-600');
      shareFeedbackEl.classList.add('hidden');
    }, 2000);
  }

  // --- Keyboard support ---
  document.addEventListener('keydown', (e) => {
    if (gameFinished) return;

    if (e.key === 'Enter') {
      handleCheckWord();
    } else if (e.key === 'Backspace') {
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateInputDisplay();
      }
    } else if (e.key === 'Escape') {
      handleClear();
    } else {
      // Check if pressed key matches any letter tile
      const letter = e.key.toUpperCase();
      if (letter.length === 1 && puzzle.letters.includes(letter)) {
        const tile = letterTilesEl.querySelector(`[data-letter="${letter}"]`);
        if (tile) {
          handleLetterClick(letter, tile);
        }
      }
    }
  });

  // --- Event listeners ---
  if (checkBtn) checkBtn.addEventListener('click', handleCheckWord);
  if (clearBtn) clearBtn.addEventListener('click', handleClear);
  if (shareBtn) shareBtn.addEventListener('click', handleShare);

  // --- Initialize ---
  renderTiles();
  updateProgress();
  dispatchScoreUpdate();
})();
