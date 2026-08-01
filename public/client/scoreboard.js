// ScoreBoard — listens for game-score-update events dispatched by GameBoard
const scoreEl = document.getElementById('sw-score');
const comboBadgeEl = document.getElementById('sw-combo-badge');
const highScoreEl = document.getElementById('sw-high-score');
const levelEl = document.getElementById('sw-level');
const xpTextEl = document.getElementById('sw-xp-text');
const xpBarEl = document.getElementById('sw-xp-bar');
const puzzleDateEl = document.getElementById('sw-puzzle-date');

// Load persistent state for initial high score display
let persistentState = { streak: 0, xp: 0, level: 1, highScores: {} };
try {
  const raw = localStorage.getItem('stackword_state');
  if (raw) persistentState = JSON.parse(raw);
} catch { /* use defaults */ }

// Show today's high score
const today = new Date().toISOString().split('T')[0];
const todayHigh = persistentState.highScores?.[today] ?? null;
if (todayHigh) {
  highScoreEl.textContent = todayHigh.toLocaleString();
}

// Show puzzle date
if (puzzleDateEl) {
  const [y, m, d] = today.split('-');
  puzzleDateEl.textContent = `${m}/${d}`;
}

// Initialize level/XP from persistent state
if (levelEl) levelEl.textContent = persistentState.level || 1;
if (xpTextEl) xpTextEl.textContent = `${(persistentState.xp || 0)} XP`;

// Listen for score updates from GameBoard
window.addEventListener('game-score-update', (e) => {
  const { score, combo, totalXp, level, todayHighScore } = e.detail;

  // Animate score update
  if (scoreEl) {
    scoreEl.textContent = score.toLocaleString();
    scoreEl.classList.add('scale-110');
    setTimeout(() => scoreEl.classList.remove('scale-110'), 200);
  }

  // Combo badge
  if (comboBadgeEl) {
    if (combo > 1) {
      comboBadgeEl.textContent = `${combo}x`;
      comboBadgeEl.style.opacity = '1';
      comboBadgeEl.style.background = 'rgba(139, 92, 246, 0.4)';
      comboBadgeEl.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.3)';
    } else if (combo === 1) {
      comboBadgeEl.textContent = '1x';
      comboBadgeEl.style.opacity = '0.5';
      comboBadgeEl.style.background = 'rgba(107, 114, 128, 0.2)';
      comboBadgeEl.style.boxShadow = 'none';
    } else {
      comboBadgeEl.style.opacity = '0';
    }
  }

  // High score
  if (todayHighScore !== null && highScoreEl) {
    highScoreEl.textContent = todayHighScore.toLocaleString();
  }

  // Level
  if (levelEl) levelEl.textContent = level || 1;

  // XP bar
  if (totalXp !== undefined) {
    const currentLevel = level || 1;
    const currentLevelXp = (currentLevel - 1) * (currentLevel - 1) * 100;
    const nextLevelXp = currentLevel * currentLevel * 100;
    const xpInLevel = totalXp - currentLevelXp;
    const xpNeeded = nextLevelXp - currentLevelXp;
    const percentage = Math.min(xpInLevel / xpNeeded, 1) * 100;

    if (xpBarEl) xpBarEl.style.width = `${percentage}%`;
    if (xpTextEl) xpTextEl.textContent = `${totalXp} XP`;
  }
});
