//
import { shopItems } from './shopData.js';

function getItemById(id) {
  return shopItems.find(item => item.id === id);
}

//
const gameOverSound = new Audio('../assets/game-over-arcade-6435.mp3')
const gameLoopsound = new Audio('../assets/phonk-music-419315.mp3')
gameOverSound.volume = 0.5;
gameLoopsound.volume = 0.2;
gameLoopsound.loop = true;

//
const gameContainer = document.getElementById('game-container');
const bonusContainer = document.getElementById('bonusContainer');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('high-score');
const textscoreDisplay = document.getElementById('high-score-text');

//
const currentuserName = localStorage.getItem('currentUser');
let currentUserData = currentuserName
  ? JSON.parse(localStorage.getItem('user_' + currentuserName))
  : null;

//
const equippedSkinId = currentUserData.equippedSkin || 'defaultKnight';
const equippedSkin = shopItems.find(item => item.id === equippedSkinId) || shopItems[0];
const equippedMap = getItemById(currentUserData?.equippedMap_hard || '../assets/burning-world.png');

//
if (equippedMap) {
  gameContainer.style.backgroundImage = `url(${equippedMap.image})`;
  gameContainer.style.backgroundSize = 'cover';
  gameContainer.style.backgroundPosition = 'center';
}

//
let playerX = window.innerWidth / 2 - 10;
let mazeSpeed = 4;
let meteors = [];
let bonusCoinsDropped = [];
let bonusCoins = 0;
let score = 0;
const speedIncreaseStep = 50;
let gameOver = false;
let gameLoop;

// Meteor sprite hard coding meteor sprite frame width, height and no. of frames along with image url from assets file
const meteorImg = new Image();
meteorImg.src = '../assets/meteor-frames-hroiz.png';
const totalFrames = 3;
const frameWidth = 300 / totalFrames;
const frameHeight = 153;

//
const playerImg = equippedSkin.image;
const runTotalFrames = equippedSkin.frames;
const playerFrameWidth = equippedSkin.frameWidth / runTotalFrames;
const playerFrameHeight = equippedSkin.frameHeight;
const scale = 1.9;

//
let currentPlayerFrame = 0;
let playerFrameTimer = 0;
const playerFrameInterval = 5;
let facing = 'right';

//
document.addEventListener('keydown', e => {
  if (gameOver) return;

  if (e.key === 'ArrowLeft') {
    playerX -= 30;
    facing = 'left';
  }
  if (e.key === 'ArrowRight') {
    playerX += 30;
    facing = 'right';
  }

  playerX = Math.max(0, Math.min(window.innerWidth - player.offsetWidth, playerX));
  player.style.left = `${playerX}px`;

  // Flip direction
  player.style.transform = facing === 'left'
    ? `scale(-${scale}, ${scale})`
    : `scale(${scale}, ${scale})`;
});

// ---------- Update Score Function ----------
//
function updateScore() {
  score++;
  document.getElementById('score').textContent = score;
}

// ---------- Check Speed Increase Function ----------
//
function checkSpeedIncrease() {
  if (score % speedIncreaseStep === 0 && score !== 0) {
    mazeSpeed += 0.3;
  }
}

// ---------- Create Meteor Function ----------
//
function createMeteor() {
  //
  const meteor = document.createElement('canvas');
  const ctx = meteor.getContext('2d');
  meteor.width = frameWidth;
  meteor.height = frameHeight;
  meteor.classList.add('meteor');
  gameContainer.appendChild(meteor);

  const meteorWidth = 40;
  const startX = Math.random() * (window.innerWidth - meteorWidth);
  const startY = -meteorWidth;

  meteor.style.left = `${startX}px`;
  meteor.style.top = `${startY}px`;

  // Random diagonal direction
  const direction = Math.random() < 0.5 ? -1 : 1;
  const horizontalSpeed = 1 + Math.random() * 2; // 1–3px per frame
  const verticalSpeed = 3 + Math.random() * 4;   // 3–7px per frame
  //
  meteors.push({
        el: meteor,
        ctx: ctx,
        x: startX,
        y: startY,
        vx: horizontalSpeed * direction,
        vy: verticalSpeed,
        width: frameWidth,
        height: frameHeight,
        frame: 0,
        exploded: false
   });

}
// ---------- Bonus Coin Creation Logic Function ----------
//
function createBonusCoin(y) {
  //
  let safeX;
  let attempts = 0;
  const coinWidth = 40;
  const coinHeight = 40;
  const maxAttempts = 20;
  //
  do {
    attempts++;
    safeX = Math.random() * (window.innerWidth - coinWidth);
    var overlap = meteors.some(m => {
      const wallX = m.x;
      const wallY = m.y;
      const wallW = m.width;
      const wallH = m.height;

      return (
        safeX < wallX + wallW &&
        safeX + coinWidth > wallX &&
        y < wallY + wallH &&
        y + coinHeight > wallY
      );
    });
  } while (overlap && attempts < maxAttempts);
  //
  if (attempts < maxAttempts) {
    const coin = document.createElement('div');
    coin.classList.add('bonus-coin');
    coin.style.top = `${y}px`;
    coin.style.left = `${safeX}px`;
    bonusContainer.appendChild(coin);
    bonusCoinsDropped.push(coin);
  }
}

// ---------- Game Over Function ----------
//
function showGameOver(coinsEarned, bonusEarned) {
  //
  gameLoopsound.pause();
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  gameOver = true;
  cancelAnimationFrame(gameLoop);

  player.style.opacity = '0.5';
  player.style.transition = 'opacity 0.9s';

  // Update text before overlay
  document.getElementById(
    'coinsEarnedText'
  ).textContent = `You earned ${coinsEarned} coins and ${bonusEarned} bonus coins`;

  // Shows the overlay first
  const overlay = document.getElementById('gameOverOverlay');
  overlay.classList.add('show');

  // Saves score logic stays as is to localStorage[currentUserData.scores.hard]
  const previousHigh = currentUserData?.scores?.hard || 0;
  if (score >= previousHigh) {
    currentUserData.scores.hard = score;
    localStorage.setItem('user_' + currentuserName, JSON.stringify(currentUserData));
    textscoreDisplay.innerHTML = `
      <p>🎉 New Highscore! ${score}</p>
    `;
  } else {
    scoreDisplay.innerHTML = `
      <p>Score: ${score}</p>
      <p style="color:#999;">Highscore: ${previousHigh}</p>
    `;
  }
}

// ---------- Animate Player Function ----------
//
function animatePlayer() {
  playerFrameTimer++;
  if (playerFrameTimer >= playerFrameInterval) {
    currentPlayerFrame = (currentPlayerFrame + 1) % runTotalFrames;
    playerFrameTimer = 0;
  }

  // Update character background position when animating through their frames  player.style.backgroundImage = `url(${playerImg})`;
  player.style.backgroundRepeat = 'no-repeat';
  player.style.backgroundSize = `${playerFrameWidth * runTotalFrames}px ${playerFrameHeight}px`;
  player.style.width = `${playerFrameWidth}px`;
  player.style.height = `${playerFrameHeight}px`;
  player.style.backgroundPosition = `-${currentPlayerFrame * playerFrameWidth}px 0`;
}

// ---------- Update Game ----------
//
function updateGame(timestamp) {
  if (gameOver) return;

  // Update meteors
  meteors.forEach((m, index) => {
    const ctx = m.ctx;
    ctx.clearRect(0, 0, frameWidth, frameHeight);
    m.x += m.vx;
    m.y += m.vy;
    m.el.style.left = `${m.x}px`;
    m.el.style.top = `${m.y}px`;

    // Clear & draw current frame
    ctx.clearRect(0, 0, frameWidth, frameHeight);

    const frameIndex = Math.floor(m.frame);
    ctx.drawImage(
        meteorImg,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
    );
    m.width = frameWidth;
    m.height = frameHeight;

    m.el.style.top = `${m.y}px`;

    // Collision check with player to determine the character hitbox interacts with a coin
    // If so the total bonus coins hit will be stored in the coinsEarned variable (determined by math.floor[largest integer] of score/105)
    // Upon user death these coins will be added to the localStorage value coins while also changing and storing the currentUserData.score.hard high score
    const playerY = window.innerHeight * 0.75;
    if (
      playerX < m.x + m.width &&
      playerX + player.offsetWidth > m.x &&
      m.y + m.height > playerY &&
      m.y < playerY + player.offsetHeight
    ) {
      const coinsEarned = Math.floor(score / 105);
      if (currentUserData) {
        if (!currentUserData.scores) currentUserData.scores = {};
        if (!currentUserData.scores.hard) currentUserData.scores.hard = 0;
        currentUserData.coins += coinsEarned + bonusCoins;
        if (score > currentUserData.scores.hard) {
          currentUserData.scores.hard = score;
        }
        localStorage.setItem('user_' + currentuserName, JSON.stringify(currentUserData));
      }
      showGameOver(coinsEarned, bonusCoins);
      return;
    }

  });

  // Update bonus coins
  bonusCoinsDropped.forEach((coin, index) => {
    const coinY = parseInt(coin.style.top);
    coin.style.top = `${coinY + mazeSpeed}px`;
    const coinX = parseInt(coin.style.left);
    if (
      playerX < coinX + 40 &&
      playerX + 20 > coinX &&
      coinY + 40 > window.innerHeight * 0.8 &&
      coinY < window.innerHeight * 0.8 + 20
    ) {
      bonusCoins += 5;
      bonusContainer.removeChild(coin);
      bonusCoinsDropped.splice(index, 1);
    }
    if (coinY > window.innerHeight) {
      bonusContainer.removeChild(coin);
      bonusCoinsDropped.splice(index, 1);
    }
  });

  // Spawn new meteors & coins using values 0.04 and 0.025 which represent their frequency (smaller the value less frequent each element appears)
  if (Math.random() < 0.04) createMeteor();
  if (Math.random() < 0.0025) createBonusCoin(-40);

  animatePlayer();
  gameLoop = requestAnimationFrame(updateGame);
  updateScore();
  checkSpeedIncrease();
}

// Game Over Overlay Buttons - are displayed with the game over screen and allows user to route back to games.html or play game again
document.getElementById('restartBtn').addEventListener('click', () => {
  window.location.reload();
});
document.getElementById('levelsBtn').addEventListener('click', () => {
  window.location.href = 'games.html';
});

// Starts the game and requests first animation frame for meteors, coins and player character, also begins playing level music 
gameLoop = requestAnimationFrame(updateGame);
gameLoopsound.currentTime = 0;
gameLoopsound.play();
