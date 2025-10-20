import { shopItems } from './shopData.js';

// Retrieve the currently signed-in user
const currentUserName = localStorage.getItem('currentUser');
let currentUserData = JSON.parse(localStorage.getItem('user_' + currentUserName)) || {};

// ✅ Ensure the Default Knight is always owned and equipped
if (!currentUserData.ownedItems) {
  currentUserData.ownedItems = ['defaultKnight'];
} else if (!currentUserData.ownedItems.includes('defaultKnight')) {
  currentUserData.ownedItems.push('defaultKnight');
}

if (!currentUserData.equippedSkin) {
  currentUserData.equippedSkin = 'defaultKnight';
}

// ✅ Ensure equipped maps exist
if (!currentUserData.equippedMap_easy) currentUserData.equippedMap_easy = 'FirewatchBackground';
if (!currentUserData.equippedMap_medium) currentUserData.equippedMap_medium = 'retro_background';
if (!currentUserData.equippedMap_hard) currentUserData.equippedMap_hard = 'burning-forest';

// ✅ Save corrections if any
localStorage.setItem('user_' + currentUserName, JSON.stringify(currentUserData));

// Safety check: if no user, redirect or show message
if (!currentUserData) {
  alert('Please log in to access the shop.');
  window.location.href = 'login.html';
}

// DOM elements
const shopContainer = document.getElementById('shop-container');
const shopGrid = document.getElementById('shop-grid');
const coinDisplay = document.getElementById('coinDisplay');

// ✅ Update coin display
function updateCoinDisplay() {
  coinDisplay.innerHTML = `💰 Coins: ${currentUserData.coins}`;
  const coinTooltip = document.getElementById('playerCoins');
  if (coinTooltip) coinTooltip.textContent = currentUserData.coins;
}

// ✅ Save back to localStorage
function saveUserData() {
  localStorage.setItem('user_' + currentUserName, JSON.stringify(currentUserData));
  updateCoinDisplay();
}

// ✅ Handle purchases
function handlePurchase(item) {
  if (currentUserData.coins < item.price) return;

  currentUserData.coins -= item.price;
  if (!currentUserData.ownedItems) currentUserData.ownedItems = [];
  currentUserData.ownedItems.push(item.id);

  // Auto-equip new item on purchase
  equipItem(item);

  saveUserData();
  renderShop();
}

// ✅ Handle equipping an item
function equipItem(item) {
  if (item.level) {
    // It's a background (map)
    if (item.level === 'easy') currentUserData.equippedMap_easy = item.id;
    else if (item.level === 'medium') currentUserData.equippedMap_medium = item.id;
    else if (item.level === 'hard') currentUserData.equippedMap_hard = item.id;
  } else {
    // It's a skin
    currentUserData.equippedSkin = item.id;
  }
  saveUserData();
  renderShop();
}

// ✅ Render shop
function renderShop() {
  shopGrid.innerHTML = '';

  shopItems.forEach(item => {
    const owned = currentUserData.ownedItems?.includes(item.id);
    const canAfford = currentUserData.coins >= item.price;

    const isEquipped =
      (!item.level && currentUserData.equippedSkin === item.id) ||
      (item.level === 'easy' && currentUserData.equippedMap_easy === item.id) ||
      (item.level === 'medium' && currentUserData.equippedMap_medium === item.id) ||
      (item.level === 'hard' && currentUserData.equippedMap_hard === item.id);

    const itemCard = document.createElement('div');
    itemCard.classList.add('item-card');

    // Image
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.classList.add('item-image');

    // Name
    const name = document.createElement('h3');
    name.classList.add('item-name');
    name.textContent = item.name;

    // Button
    const button = document.createElement('button');
    button.classList.add('buy-button');

    if (owned) {
      if (isEquipped) {
        button.textContent = 'Equipped';
        button.disabled = true;
        button.classList.add('disabled');
      } else {
        button.textContent = 'Equip';
        button.addEventListener('click', () => equipItem(item));
      }
    } else if (!canAfford) {
      button.textContent = 'Not Enough Coins';
      button.disabled = true;
      button.classList.add('disabled');
    } else {
      button.textContent = `Buy (${item.price} coins)`;
      button.addEventListener('click', () => handlePurchase(item));
    }

    // Append
    itemCard.appendChild(img);
    itemCard.appendChild(name);
    itemCard.appendChild(button);
    shopGrid.appendChild(itemCard);
  });
}

// ✅ Initialize
function initShop() {
  updateCoinDisplay();
  renderShop();
}

initShop();
