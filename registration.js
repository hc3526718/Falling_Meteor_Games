const emailInput   = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const createBtn    = document.getElementById('registerBtn'); // <– make sure you have a separate button for account creation
const playerEmail  = document.getElementById('playerEmail');
const playerCoins  = document.getElementById('playerCoins');
const EmailText    = document.getElementById('EmailText');
const PassText     = document.getElementById('PassText');
const errorMsg     = document.getElementById('errorMsg'); // new line
const successMsg = document.getElementById('successMsg');
const UserName = document.getElementById('userName');
const PhoneNum = document.getElementById('phoneNum');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText').querySelector('span');
const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phonenumregex = /^\+?\d{9,15}$/;

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  let strength = 0;

  // Regex checks
  if (value.length >= 8) strength++; // length
  if (/[A-Z]/.test(value)) strength++; // uppercase
  if (/[a-z]/.test(value)) strength++; // lowercase
  if (/[0-9]/.test(value)) strength++; // number
  if (/[^A-Za-z0-9]/.test(value)) strength++; // special character

  // Update UI
  switch (strength) {
    case 0:
      strengthBar.style.width = '0%';
      strengthBar.style.background = 'red';
      strengthText.textContent = 'None';
      break;
    case 1:
      strengthBar.style.width = '20%';
      strengthBar.style.background = 'red';
      strengthText.textContent = 'Very Weak';
      break;
    case 2:
      strengthBar.style.width = '40%';
      strengthBar.style.background = 'orange';
      strengthText.textContent = 'Weak';
      break;
    case 3:
      strengthBar.style.width = '60%';
      strengthBar.style.background = 'yellow';
      strengthText.textContent = 'Moderate';
      break;
    case 4:
      strengthBar.style.width = '80%';
      strengthBar.style.background = 'lightgreen';
      strengthText.textContent = 'Strong';
      break;
    case 5:
      strengthBar.style.width = '100%';
      strengthBar.style.background = 'green';
      strengthText.textContent = 'Very Strong';
      break;
  }
});

// ------------------ ACCOUNT CREATION ------------------
createBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = UserName.value.trim();
  const phone_number = PhoneNum.value.trim();
  errorMsg.textContent = '';

  if (!emailregex.test(email)) {
     errorMsg.textContent = "Please enter a valid email\n(e.g. name@example.com)";
     return;
  }

  if (!passregex.test(password)){
     errorMsg.textContent = "Please enter a valid password (e.g. p@SSword123)";
     return;
  }

  if (!phonenumregex.test(phone_number)){
      errorMsg.textContent = "Please enter a vliad phone number (e.g. +441234567890)";
      return;
  }

  // Check if user already exists
  let existingUser = localStorage.getItem('user_' + username);
  if (existingUser) {
    errorMsg.textContent = "Account already exists. Please log in instead.";
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "none";
    loginBtn.addEventListener('click', () => {
        window.location.href = "../HTML_Files/login.html";
    })
    return;
  }

  // Create new user object
  const newUser = {
    email,
    password,
    username,
    phone_number,
    coins: 0,
    scores: { easy: 0, medium: 0, hard: 0 },
    equippedMap_easy: "FirewatchBackground",
    equippedMap_hard: "burning-forest",
    equippedMap_medium: "retro_background",
    equippedSkin: "defaultKnight",
    ownedItems: ["retro_background", "burning-forest", "FirewatchBackground", ]
  };

  // Save to localStorage
  localStorage.setItem('user_' + username, JSON.stringify(newUser));
  localStorage.setItem('currentUser', username);
  successMsg.textContent = "Account created successfully! You can now log in.";
});