
function loadUserSession() {
  const userName = localStorage.getItem('currentUser');
  if (!userName) return; // No one is logged in

  const userData = JSON.parse(localStorage.getItem('user_' + userName));
  if (!userData) return;

  // Update the UI
  const usernameSpan = document.getElementById('playerUsername');
  const passSpan = document.getElementById('playerPass');
  const coinsSpan = document.getElementById('playerCoins');

  if (usernameSpan) usernameSpan.textContent = userData.username;
  if (passSpan) passSpan.textContent = userData.password;
  if (coinsSpan) coinsSpan.textContent = userData.coins;
}

// Run automatically when the page loads
window.addEventListener('DOMContentLoaded', loadUserSession);
