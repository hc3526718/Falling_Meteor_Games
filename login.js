const userInput   = document.getElementById('userInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn     = document.getElementById('loginBtn');
const playerUsername  = document.getElementById('playerUsername');
const playerCoins  = document.getElementById('playerCoins');
const UserText = document.getElementById('UserText');
const PassText = document.getElementById('PassText');
const playerPass = document.getElementById('playerPass');
const errorMsg = document.getElementById('errorMsg');
const registerBtn = document.getElementById('registerBtn');
const successMsg = document.getElementById('successMsg');

loginBtn.addEventListener('click', () => {
  const username = userInput.value.trim();
  const password = passwordInput.value.trim();
  errorMsg.textContent = '';

  // Retrieve existing user
  let userData = localStorage.getItem('user_' + username);
  if (!userData) {
    errorMsg.textContent = "Account does not exist. Please create one first.";
    registerBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    registerBtn.addEventListener('click', () => {
        window.location.href = "registration.html";
    });
    return;
  }

  const user = JSON.parse(userData);

  // Check password
  if (user.password !== password) {
    errorMsg.textContent = "Incorrect password, please try again.";
    return;
  }

  // Store current user for easy access
  localStorage.setItem('currentUser', username);

  // Update UI
  playerUsername.textContent = username;
  playerPass.textContent = password;
  playerCoins.textContent = user.coins;

  successMsg.textContent = "Login successful, continue to the games and shop pages!";

});