// ---------- Load HighScores Function ----------
//
function loadHighScores(selectedLevel = 'easy') {
  const tbody = document.querySelector('#highscoreTable tbody');
  tbody.innerHTML = '';

  const users = [];

  // Collect all users’ scores from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('user_')) continue;

    const user = JSON.parse(localStorage.getItem(key));
    if (user && user.scores && user.scores[selectedLevel] !== undefined) {
      users.push({
        username: user.username,
        score: user.scores[selectedLevel] || 0
      });
    }
  }

  // Sort DESCENDING (highest score first)
  users.sort((a, b) => b.score - a.score);

  // Populate table
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.score}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Listen for filter button clicks
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-buttons button');

  // Load Easy by default
  loadHighScores('easy');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove 'active' from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const level = btn.dataset.level;
      loadHighScores(level);
    });
  });
});

