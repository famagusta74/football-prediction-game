# Football Prediction Game - Source Code Documentation

**Version:** 1.6.2
**Last Updated:** June 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Total Lines of Code:** ~2,500

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [HTML Structure](#3-html-structure)
4. [CSS Architecture](#4-css-architecture)
5. [JavaScript Modules](#5-javascript-modules)
6. [Firebase Integration](#6-firebase-integration)
7. [Code Examples](#7-code-examples)
8. [Best Practices](#8-best-practices)

---

## 1. Project Overview

**Repository:** Football Prediction Game  
**Version:** 1.4  
**Built by:** IBM Bob AI Assistant  
**Technology:** Vanilla JavaScript, HTML5, CSS3, Firebase  
**Lines of Code:** ~1,500 (JavaScript), ~800 (CSS), ~250 (HTML)

---

## 2. File Structure

```
football-prediction-game/
│
├── index.html                 # Main HTML file (250 lines)
│   ├── Login Screen
│   ├── Registration Screen
│   ├── Dashboard Screen
│   ├── Prediction Modal
│   ├── Pool Modals
│   └── Documentation Link
│
├── styles.css                 # Styling (800 lines)
│   ├── Global Styles
│   ├── Screen Layouts
│   ├── Component Styles
│   ├── Animations
│   └── Responsive Design
│
├── app.js                     # Application Logic (1,500 lines)
│   ├── Constants & Variables
│   ├── Initialization
│   ├── Authentication
│   ├── Predictions
│   ├── Pools
│   ├── Leaderboard
│   ├── Admin Functions
│   └── Utility Functions
│
├── firebase-config.js         # Firebase Setup (210 lines)
│   ├── Configuration
│   ├── Initialization
│   └── Helper Functions
│
├── README.md                  # Project Overview
├── FIREBASE_SETUP.md         # Setup Instructions
│
└── docs/
    ├── APPLICATION_DEFINITION.md
    ├── TECHNICAL_SPECIFICATION.md
    └── SOURCE_CODE_DOCUMENTATION.md
```

---

## 3. HTML Structure

### 3.1 Document Head
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Prediction Game</title>
    <link rel="stylesheet" href="styles.css">
    
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
    <script src="firebase-config.js"></script>
</head>
```

### 3.2 Login Screen
```html
<div id="loginScreen" class="screen active">
    <div class="container">
        <div class="version-header">v1.4</div>
        <div class="logo">⚽</div>
        <h1>Football Prediction Game</h1>
        
        <!-- Welcome Info Cards -->
        <div class="welcome-info">
            <div class="info-card">
                <div class="info-icon">🎯</div>
                <h3>Exact Score</h3>
                <p>Predict the exact score and win <strong>5x</strong> your bet!</p>
            </div>
            <div class="info-card">
                <div class="info-icon">✅</div>
                <h3>Correct Result</h3>
                <p>Get the winner right and earn <strong>2x</strong> your bet!</p>
            </div>
        </div>
        
        <!-- Login Form -->
        <div class="auth-form">
            <input type="text" id="nickname" placeholder="Enter Nickname">
            <input type="password" id="pin" placeholder="4-Digit PIN">
            <button onclick="login()" class="btn-primary">Login</button>
            <button onclick="showRegister()" class="btn-secondary">Create Account</button>
        </div>
    </div>
</div>
```

### 3.3 Dashboard Screen
```html
<div id="dashboardScreen" class="screen">
    <!-- Header -->
    <div class="header">
        <div class="user-info">
            <span id="userNickname">Player</span>
            <div class="coins">
                <span class="coin-icon">🪙</span>
                <span id="userCoins">1000</span>
            </div>
        </div>
        <button onclick="logout()" class="btn-logout">Logout</button>
    </div>
    
    <!-- Tabs -->
    <div class="tabs">
        <button class="tab active" onclick="showTab('predictions')">Predictions</button>
        <button class="tab" onclick="showTab('pools')">My Pools</button>
        <button class="tab" onclick="showTab('leaderboard')">Leaderboard</button>
        <button class="tab" onclick="showTab('matches')" style="display: none;">⚙️ Matches</button>
        <button class="tab" onclick="showTab('users')" style="display: none;">Users</button>
    </div>
    
    <!-- Tab Contents -->
    <div id="predictionsTab" class="tab-content active">
        <div id="matchesList" class="matches-list"></div>
    </div>
</div>
```

### 3.4 Prediction Modal
```html
<div id="predictionModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closePredictionModal()">&times;</span>
        <h2 id="modalMatchTitle">Match Prediction</h2>
        
        <div class="prediction-form">
            <div class="score-input">
                <label id="homeTeamLabel">Home Team</label>
                <input type="number" id="homeScore" min="0" value="0">
            </div>
            
            <div class="vs-divider">VS</div>
            
            <div class="score-input">
                <label id="awayTeamLabel">Away Team</label>
                <input type="number" id="awayScore" min="0" value="0">
            </div>
        </div>
        
        <div class="bet-section">
            <label>Bet Amount (🪙)</label>
            <input type="number" id="betAmount" min="10" value="50" onchange="updatePayoutDisplay()">
            
            <div class="payout-info">
                <div class="payout-item">
                    <span>Exact Score:</span>
                    <span id="exactPayout">250</span> 🪙
                </div>
                <div class="payout-item">
                    <span>Correct Result:</span>
                    <span id="resultPayout">100</span> 🪙
                </div>
            </div>
        </div>
        
        <button onclick="submitPrediction()" class="btn-primary">Submit Prediction</button>
    </div>
</div>
```

---

## 4. CSS Architecture

### 4.1 CSS Variables
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
    --background: #ecf0f1;
    --card-background: white;
    --text-color: #2c3e50;
    --border-radius: 10px;
    --box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    --transition: all 0.3s ease;
}
```

### 4.2 Layout System
```css
/* Flexbox for centering */
.screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

/* Grid for cards */
.matches-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
```

### 4.3 Component Styles
```css
/* Match Card */
.match-card {
    background: var(--card-background);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--box-shadow);
    cursor: pointer;
    transition: var(--transition);
}

.match-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

/* Button Styles */
.btn-primary {
    background: var(--secondary-color);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 16px;
    transition: var(--transition);
}

.btn-primary:hover {
    background: #2980b9;
    transform: scale(1.05);
}
```

### 4.4 Animations
```css
/* Fade In */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.screen.active {
    animation: fadeIn 0.5s ease;
}

/* Pulse Animation */
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.version-header {
    animation: pulse 2s infinite;
}
```

### 4.5 Responsive Design
```css
/* Mobile (< 768px) */
@media (max-width: 768px) {
    .matches-list {
        grid-template-columns: 1fr;
    }
    
    .tabs {
        flex-wrap: wrap;
    }
    
    .tab {
        flex: 1 1 45%;
    }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
    .matches-list {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
}
```

---

## 5. JavaScript Modules

### 5.1 Constants and Global Variables

```javascript
// App Version
const APP_VERSION = "v1.4";

// Admin Configuration
const ADMIN_NICKNAME = "Menicos";

// Data Storage
let currentUser = null;
let users = [];
let pools = [];
let predictions = [];
let matches = [];
let currentMatchId = null;
let useFirebase = false;
```

### 5.2 Initialization Module

```javascript
// Initialize Firebase and load data
async function initializeApp() {
    console.log(`Football Prediction Game ${APP_VERSION}`);
    
    // Try to initialize Firebase
    useFirebase = initializeFirebase();
    
    if (useFirebase) {
        console.log('Using Firebase for data storage');
        
        // Check if migration is needed
        const migrationDone = localStorage.getItem('firebaseMigrationDone');
        
        if (!migrationDone) {
            console.log('First time with Firebase - migrating localStorage data...');
            await migrateLocalStorageToFirebase();
        }
        
        // Load data from Firebase
        await loadDataFromFirebase();
        
        // Initialize matches from Firebase or use defaults
        if (matches.length === 0) {
            matches = [...sampleMatches];
            await FirebaseDB.saveAllMatches(matches);
        }
    } else {
        console.log('Firebase not available, using localStorage');
        // Fallback to localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
        pools = JSON.parse(localStorage.getItem('pools')) || [];
        predictions = JSON.parse(localStorage.getItem('predictions')) || [];
    }
    
    console.log(`Loaded ${users.length} users, ${pools.length} pools, ${predictions.length} predictions`);
}

// Initialize app when page loads
window.onload = init;

async function init() {
    // Initialize Firebase and load data
    await initializeApp();
    
    const savedUser = localStorage.getItem('currentUser');
    
    // Check if there's a pool invite in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const poolCode = urlParams.get('pool');
    
    if (poolCode) {
        localStorage.setItem('pendingPoolCode', poolCode);
    }
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
}
```

### 5.3 Authentication Module

```javascript
// Login Function
async function login() {
    const nickname = document.getElementById('nickname').value.trim();
    const pin = document.getElementById('pin').value;

    // Validation
    if (!nickname || !pin) {
        alert('Please enter both nickname and PIN');
        return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be exactly 4 digits');
        return;
    }

    // Reload users from Firebase/localStorage
    if (useFirebase) {
        users = await FirebaseDB.getUsers();
    } else {
        users = JSON.parse(localStorage.getItem('users')) || [];
    }

    // Find user
    const user = users.find(u => 
        u.nickname.toLowerCase() === nickname.toLowerCase() && 
        u.pin === pin
    );
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Daily coin replenishment check
        const lastLogin = new Date(user.lastLogin || 0);
        const now = new Date();
        const hoursSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60);
        
        if (hoursSinceLastLogin >= 24) {
            user.coins = Math.min(user.coins + 500, 2000);
            user.lastLogin = now.toISOString();
            await saveUsers();
        }
        
        showDashboard();
        
        // Check for pending pool invitation
        const pendingPoolCode = localStorage.getItem('pendingPoolCode');
        if (pendingPoolCode) {
            localStorage.removeItem('pendingPoolCode');
            autoJoinPool(pendingPoolCode);
        }
    } else {
        alert('Invalid nickname or PIN');
    }
}

// Register Function
async function register() {
    const nickname = document.getElementById('regNickname').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pin = document.getElementById('regPin').value;
    const pinConfirm = document.getElementById('regPinConfirm').value;

    // Validation
    if (!nickname || !email || !pin || !pinConfirm) {
        alert('Please fill in all fields');
        return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be exactly 4 digits');
        return;
    }

    if (pin !== pinConfirm) {
        alert('PINs do not match');
        return;
    }

    if (users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
        alert('Nickname already taken');
        return;
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        nickname: nickname,
        email: email,
        pin: pin,
        coins: 1000,
        totalPredictions: 0,
        correctPredictions: 0,
        exactScores: 0,
        winStreak: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers();
    
    // Notify admin about new registration
    await notifyAdminNewUser(newUser);

    alert('Account created successfully! Please login.');
    showLogin();
}

// Logout Function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboardScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
}
```

### 5.4 Prediction Module

```javascript
// Submit Prediction
async function submitPrediction() {
    const homeScore = parseInt(document.getElementById('homeScore').value);
    const awayScore = parseInt(document.getElementById('awayScore').value);
    const betAmount = parseInt(document.getElementById('betAmount').value);
    
    // Validation
    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
        alert('Please enter valid scores');
        return;
    }
    
    if (betAmount < 10) {
        alert('Minimum bet is 10 coins');
        return;
    }
    
    if (betAmount > currentUser.coins) {
        alert('Insufficient coins');
        return;
    }
    
    const match = matches.find(m => m.id === currentMatchId);
    if (!match) return;
    
    // Check if prediction is before kickoff
    if (new Date() > new Date(match.kickoff)) {
        alert('Cannot predict after match has started');
        return;
    }
    
    // Check for existing prediction
    const existingPredictionIndex = predictions.findIndex(p => 
        p.userId === currentUser.id && p.matchId === currentMatchId
    );
    
    if (existingPredictionIndex !== -1) {
        // Update existing prediction
        const oldBet = predictions[existingPredictionIndex].betAmount;
        currentUser.coins += oldBet; // Refund old bet
        predictions[existingPredictionIndex] = {
            ...predictions[existingPredictionIndex],
            homeScore,
            awayScore,
            betAmount,
            timestamp: new Date().toISOString()
        };
    } else {
        // Create new prediction
        const newPrediction = {
            id: Date.now(),
            userId: currentUser.id,
            matchId: currentMatchId,
            homeScore,
            awayScore,
            betAmount,
            timestamp: new Date().toISOString(),
            processed: false
        };
        predictions.push(newPrediction);
        currentUser.totalPredictions++;
    }
    
    // Deduct coins
    currentUser.coins -= betAmount;
    
    // Save changes
    await saveUsers();
    await savePredictions();
    await updateUserInStorage();
    
    // Update display
    document.getElementById('userCoins').textContent = currentUser.coins;
    closePredictionModal();
    loadMatches();
    
    alert('Prediction saved successfully!');
}

// Calculate Payout
function calculatePayout(prediction, actualScore) {
    const predictedHome = prediction.homeScore;
    const predictedAway = prediction.awayScore;
    const actualHome = actualScore.home;
    const actualAway = actualScore.away;
    
    // Exact score match
    if (predictedHome === actualHome && predictedAway === actualAway) {
        return prediction.betAmount * 5;
    }
    
    // Determine results
    const predictedResult = predictedHome > predictedAway ? 'home' : 
                           predictedHome < predictedAway ? 'away' : 'draw';
    const actualResult = actualHome > actualAway ? 'home' : 
                        actualHome < actualAway ? 'away' : 'draw';
    
    // Correct result
    if (predictedResult === actualResult) {
        return prediction.betAmount * 2;
    }
    
    // Incorrect prediction
    return 0;
}
```

### 5.5 Pool Management Module

```javascript
// Create Pool
async function createPool() {
    const poolName = document.getElementById('poolName').value.trim();
    const poolDescription = document.getElementById('poolDescription').value.trim();
    
    if (!poolName) {
        alert('Please enter a pool name');
        return;
    }
    
    const poolCode = generatePoolCode();
    
    const newPool = {
        id: Date.now(),
        name: poolName,
        description: poolDescription,
        code: poolCode,
        adminId: currentUser.id,
        members: [currentUser.id],
        createdAt: new Date().toISOString()
    };
    
    pools.push(newPool);
    await savePools();
    
    closeCreatePool();
    loadPools();
    
    // Generate invite link
    const inviteLink = `${window.location.origin}${window.location.pathname}?pool=${poolCode}`;
    
    alert(`Pool created successfully!\n\nPool Code: ${poolCode}\n\nInvite Link:\n${inviteLink}\n\nShare this link with friends!`);
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteLink);
    }
}

// Generate Pool Code
function generatePoolCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Join Pool
async function joinPool() {
    const poolCode = document.getElementById('poolCode').value.trim().toUpperCase();
    
    if (!poolCode) {
        alert('Please enter a pool code');
        return;
    }
    
    const pool = pools.find(p => p.code === poolCode);
    
    if (!pool) {
        alert('Invalid pool code');
        return;
    }
    
    if (pool.members.includes(currentUser.id)) {
        alert('You are already a member of this pool');
        return;
    }
    
    pool.members.push(currentUser.id);
    await savePools();
    
    closeJoinPool();
    loadPools();
    
    alert(`Successfully joined ${pool.name}!`);
}
```

### 5.6 Admin Module

```javascript
// Check if current user is admin
function isAdmin() {
    return currentUser && currentUser.nickname === ADMIN_NICKNAME;
}

// Load Admin Matches
function loadAdminMatches() {
    const matchesList = document.getElementById('adminMatchesList');
    matchesList.innerHTML = '';
    
    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'admin-match-item';
        
        const matchDate = new Date(match.kickoff);
        const isFinished = match.status === 'finished';
        
        matchItem.innerHTML = `
            <div>
                <strong>${match.homeTeam} vs ${match.awayTeam}</strong>
                <br>
                <small>${matchDate.toLocaleString()} | ${match.stage}</small>
                <br>
                <small>Status: <span style="color: ${isFinished ? '#28a745' : '#ffc107'}">${match.status.toUpperCase()}</span></small>
                ${isFinished && match.finalScore ? `<br><small>Final Score: ${match.finalScore.home} - ${match.finalScore.away}</small>` : ''}
            </div>
            <div>
                ${!isFinished ? `
                    <button onclick="enterMatchResult(${match.id})" class="btn-primary">
                        Enter Result
                    </button>
                ` : `
                    <button onclick="editMatchResult(${match.id})" class="btn-secondary">
                        Edit Result
                    </button>
                `}
            </div>
        `;
        matchesList.appendChild(matchItem);
    });
}

// Enter Match Result
async function enterMatchResult(matchId) {
    if (!isAdmin()) return;
    
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const homeScore = prompt(`Enter result for:\n${match.homeTeam} vs ${match.awayTeam}\n\nHome team (${match.homeTeam}) score:`, '0');
    if (homeScore === null) return;
    
    const awayScore = prompt(`Away team (${match.awayTeam}) score:`, '0');
    if (awayScore === null) return;
    
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);
    
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
        alert('Invalid scores!');
        return;
    }
    
    // Update match
    match.status = 'finished';
    match.finalScore = { home, away };
    
    // Save to Firebase/localStorage
    await saveMatches();
    
    loadAdminMatches();
    loadMatches();
    
    alert(`Match result saved!\n${match.homeTeam} ${home} - ${away} ${match.awayTeam}\n\nDon't forget to click "Process Results" to award payouts!`);
}

// Process Finished Matches
async function processFinishedMatches() {
    if (!isAdmin()) {
        alert('Only admin can process match results!');
        return;
    }
    
    let processedCount = 0;
    let totalPayout = 0;
    
    matches.forEach(match => {
        if (match.status === 'finished' && match.finalScore) {
            const matchPredictions = predictions.filter(p => p.matchId === match.id);
            
            matchPredictions.forEach(prediction => {
                if (prediction.processed) return;
                
                const payout = calculatePayout(prediction, match.finalScore);
                const user = users.find(u => u.id === prediction.userId);
                
                if (user) {
                    user.coins += payout;
                    
                    if (payout > 0) {
                        user.correctPredictions = (user.correctPredictions || 0) + 1;
                        if (payout === prediction.betAmount * 5) {
                            user.exactScores = (user.exactScores || 0) + 1;
                        }
                    }
                    
                    prediction.processed = true;
                    prediction.payout = payout;
                    
                    processedCount++;
                    totalPayout += payout;
                }
            });
        }
    });
    
    await saveUsers();
    await savePredictions();
    
    const updatedCurrentUser = users.find(u => u.id === currentUser.id);
    if (updatedCurrentUser) {
        currentUser = updatedCurrentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('userCoins').textContent = currentUser.coins;
    }
    
    loadMatches();
    
    alert(`Results processed!\n\nPredictions: ${processedCount}\nTotal payout: ${totalPayout} coins`);
}
```

### 5.7 Data Persistence Module

```javascript
// Save Users
async function saveUsers() {
    if (useFirebase) {
        for (const user of users) {
            await FirebaseDB.saveUser(user);
        }
    } else {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Save Pools
async function savePools() {
    if (useFirebase) {
        for (const pool of pools) {
            await FirebaseDB.savePool(pool);
        }
    } else {
        localStorage.setItem('pools', JSON.stringify(pools));
    }
}

// Save Predictions
async function savePredictions() {
    if (useFirebase) {
        for (const prediction of predictions) {
            await FirebaseDB.savePrediction(prediction);
        }
    } else {
        localStorage.setItem('predictions', JSON.stringify(predictions));
    }
}

// Save Matches
async function saveMatches() {
    if (useFirebase) {
        await FirebaseDB.saveAllMatches(matches);
    } else {
        localStorage.setItem('matches', JSON.stringify(matches));
    }
}
```

---

## 6. Firebase Integration

### 6.1 Configuration File (firebase-config.js)

```javascript
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyATsmrz6NlM1bgootQFhIrZAmT-vui_chI",
    authDomain: "football-prediction-game-ca155.firebaseapp.com",
    databaseURL: "https://football-prediction-game-ca155-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "football-prediction-game-ca155",
    storageBucket: "football-prediction-game-ca155.firebasestorage.app",
    messagingSenderId: "266847662424",
    appId: "1:266847662424:web:fc24bb439d3015e02cf52d"
};

// Initialize Firebase
let database;
let isFirebaseInitialized = false;

function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded');
            return false;
        }
        
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseInitialized = true;
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}
```

### 6.2 Helper Functions

```javascript
const FirebaseDB = {
    // Users
    async saveUser(user) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('users/' + user.id).set(user);
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    },
    
    async getUsers() {
        if (!isFirebaseInitialized) return [];
        try {
            const snapshot = await database.ref('users').once('value');
            const usersObj = snapshot.val() || {};
            return Object.values(usersObj);
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    },
    
    // Similar functions for pools, predictions, matches, notifications
};
```

---

## 7. Code Examples

### 7.1 Creating a Match Card

```javascript
function createMatchCard(match, userPrediction) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.onclick = () => openPredictionModal(match);
    
    const kickoffDate = new Date(match.kickoff);
    const formattedDate = kickoffDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    matchCard.innerHTML = `
        <div class="match-header">
            <span class="match-time">${formattedDate}</span>
            <span class="match-status">${match.status.toUpperCase()}</span>
        </div>
        <div class="match-teams">
            <span class="team">${match.homeTeam}</span>
            <span class="vs">VS</span>
            <span class="team">${match.awayTeam}</span>
        </div>
        ${userPrediction ? `
            <div class="match-prediction">
                <span>Your prediction: ${userPrediction.homeScore} - ${userPrediction.awayScore}</span>
                <span>${userPrediction.betAmount} 🪙</span>
            </div>
        ` : ''}
    `;
    
    return matchCard;
}
```

### 7.2 Calculating Leaderboard

```javascript
function calculateLeaderboard(poolId) {
    let poolUsers;
    
    if (poolId === 'global') {
        poolUsers = users;
    } else {
        const pool = pools.find(p => p.id === parseInt(poolId));
        if (!pool) return [];
        poolUsers = users.filter(u => pool.members.includes(u.id));
    }
    
    return poolUsers
        .map(user => ({
            ...user,
            accuracy: user.totalPredictions > 0 
                ? ((user.correctPredictions / user.totalPredictions) * 100).toFixed(1)
                : 0
        }))
        .sort((a, b) => b.coins - a.coins);
}
```

### 7.3 Form Validation

```javascript
function validatePredictionForm() {
    const homeScore = parseInt(document.getElementById('homeScore').value);
    const awayScore = parseInt(document.getElementById('awayScore').value);
    const betAmount = parseInt(document.getElementById('betAmount').value);
    
    const errors = [];
    
    if (isNaN(homeScore) || homeScore < 0) {
        errors.push('Invalid home score');
    }
    
    if (isNaN(awayScore) || awayScore < 0) {
        errors.push('Invalid away score');
    }
    
    if (isNaN(betAmount) || betAmount < 10) {
        errors.push('Bet must be at least 10 coins');
    }
    
    if (betAmount > currentUser.coins) {
        errors.push('Insufficient coins');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}
```

---

## 8. Best Practices

### 8.1 Code Organization
- Modular functions (single responsibility)
- Clear naming conventions
- Consistent indentation (4 spaces)
- Comments for complex logic
- Separation of concerns (HTML/CSS/JS)

### 8.2 Error Handling
```javascript
try {
    await FirebaseDB.saveUser(user);
} catch (error) {
    console.error('Error saving user:', error);
    // Fallback to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}
```

### 8.3 Async/Await Pattern
```javascript
// Good
async function loadData() {
    const users = await FirebaseDB.getUsers();
    const pools = await FirebaseDB.getPools();
    return { users, pools };
}

// Avoid
function loadData() {
    FirebaseDB.getUsers().then(users => {
        FirebaseDB.getPools().then(pools => {
            // Callback hell
        });
    });
}
```

### 8.4 Performance Optimization
- Minimize DOM manipulations
- Use document fragments for bulk inserts
- Cache frequently accessed elements
- Debounce input handlers
- Lazy load data when needed

### 8.5 Security Considerations
- Validate all user inputs
- Sanitize data before display
- Use Firebase security rules
- No sensitive data in client code
- Implement rate limiting for API calls

---

**Document Version:** 1.0  
**Created:** June 2026  
**Author:** IBM Bob AI Assistant  
**Lines of Code:** ~2,500 total  
**Last Updated:** June 2026