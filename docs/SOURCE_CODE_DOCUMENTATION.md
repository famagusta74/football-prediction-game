# Football Prediction Game - Source Code Documentation

**Version:** 1.7.1
**Last Updated:** June 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Total Lines of Code:** ~2,700

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
**Version:** 1.7.1  
**Built by:** IBM Bob AI Assistant  
**Technology:** Vanilla JavaScript, HTML5, CSS3, Firebase  
**Lines of Code:** ~1,800 (JavaScript), ~800 (CSS), ~300 (HTML)

---

## 2. File Structure

```text
football-prediction-game/
│
├── index.html                 # Main HTML file
│   ├── Login Screen
│   ├── Registration Screen
│   ├── Dashboard Screen
│   ├── Prediction Modal
│   ├── Pool Modals
│   ├── Activity Tab
│   └── Documentation Link
│
├── styles.css                 # Styling
│   ├── Global Styles
│   ├── Screen Layouts
│   ├── Component Styles
│   ├── Animations
│   └── Responsive Design
│
├── app.js                     # Application Logic
│   ├── Constants & Variables
│   ├── Initialization
│   ├── Authentication
│   ├── Predictions
│   ├── Activity History
│   ├── Pools
│   ├── Leaderboard
│   ├── Admin Functions
│   └── Utility Functions
│
├── firebase-config.js         # Firebase Setup
│   ├── Configuration
│   ├── Initialization
│   └── Helper Functions
│
├── README.md                  # Project Overview
├── FIREBASE_SETUP.md          # Setup Instructions
│
└── docs/
    ├── APPLICATION_DEFINITION.md
    ├── GAME_SUMMARY.md
    ├── TECHNICAL_SPECIFICATION.md
    ├── SOURCE_CODE_DOCUMENTATION.md
    └── index.html
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

    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
    <script src="firebase-config.js"></script>
</head>
```

### 3.2 Login Screen
```html
<div id="loginScreen" class="screen active">
    <div class="container">
        <div class="version-header">v1.7.1 - HTML Activity History Screens</div>
        <div class="logo">⚽</div>
        <h1>Football Prediction Game</h1>
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
    <div class="header">
        <div class="user-info">
            <span id="userNickname">Player</span>
            <div class="coins">
                <span class="coin-icon">🪙</span>
                <span id="userCoins">1000</span>
            </div>
            <div class="version-badge">v1.7.1</div>
        </div>
        <button onclick="logout()" class="btn-logout">Logout</button>
    </div>

    <div class="tabs">
        <button class="tab active" onclick="showTab('predictions')">Predictions</button>
        <button class="tab" onclick="showTab('pools')">My Pools</button>
        <button class="tab" onclick="showTab('leaderboard')">Leaderboard</button>
        <button class="tab" onclick="showTab('activity')">Activity</button>
        <button class="tab" onclick="showTab('matches')" style="display: none;">⚙️ Matches</button>
        <button class="tab" onclick="showTab('users')" style="display: none;">Users</button>
    </div>
</div>
```

### 3.4 Activity Screens
```html
<div id="activityTab" class="tab-content">
    <div class="container">
        <h2>My Activity</h2>
        <div id="myActivitySummary"></div>
        <div id="myActivityList"></div>
    </div>
</div>

<div id="usersTab" class="tab-content">
    <div class="container">
        <h2>👑 Admin: User Management</h2>
        <div id="usersList"></div>
        <div id="adminActivityViewer"></div>
    </div>
</div>
```

### 3.5 Prediction Modal
```html
<div id="predictionModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closePredictionModal()">&times;</span>
        <h3 id="modalMatchTitle">Match Prediction</h3>
        <div class="prediction-form">
            <div class="score-inputs">
                <div class="team-score">
                    <label id="homeTeamLabel">Home</label>
                    <input type="number" id="homeScore" min="0" max="20" value="0">
                </div>
                <span class="vs">VS</span>
                <div class="team-score">
                    <label id="awayTeamLabel">Away</label>
                    <input type="number" id="awayScore" min="0" max="20" value="0">
                </div>
            </div>
            <div class="bet-amount">
                <label>Bet Amount:</label>
                <input type="number" id="betAmount" min="10" max="500" value="50" step="10">
            </div>
            <button onclick="submitPrediction()" class="btn-primary">Submit Prediction</button>
        </div>
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
.screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.matches-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
```

### 4.3 Component Styles
```css
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
```

### 4.4 Animations
```css
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
```

### 4.5 Responsive Design
```css
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
```

---

## 5. JavaScript Modules

### 5.1 Constants and Global Variables
```javascript
const APP_VERSION = "v1.7.1";

let currentUser = null;
let users = [];
let pools = [];
let predictions = [];
let matches = [];
let currentMatchId = null;
let useFirebase = false;
let selectedUserActivityId = null;
let activeTabName = 'predictions';

const ADMIN_NICKNAME = "Menicos";
const DEFAULT_ADMIN_NICKNAMES = [ADMIN_NICKNAME];
```

### 5.2 Initialization Module
```javascript
async function initializeApp() {
    console.log(`Football Prediction Game ${APP_VERSION}`);
    useFirebase = initializeFirebase();

    if (useFirebase) {
        await loadDataFromFirebase();
        if (matches.length === 0) {
            matches = [...sampleMatches];
            await FirebaseDB.saveAllMatches(matches);
        }
    } else {
        users = JSON.parse(localStorage.getItem('users')) || [];
        pools = JSON.parse(localStorage.getItem('pools')) || [];
        predictions = JSON.parse(localStorage.getItem('predictions')) || [];
    }
}
```

### 5.3 Authentication Module
```javascript
async function login() {
    const nickname = document.getElementById('nickname').value.trim();
    const pin = document.getElementById('pin').value;

    if (!nickname || !pin) {
        alert('Please enter both nickname and PIN');
        return;
    }

    const user = users.find(u =>
        u.nickname.toLowerCase() === nickname.toLowerCase() &&
        u.pin === pin
    );

    if (user) {
        const lastLogin = new Date(user.lastLogin || 0);
        const now = new Date();
        const hoursSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60);

        if (hoursSinceLastLogin >= 24) {
            const previousCoins = user.coins;
            user.coins = Math.min(user.coins + 100, 2000);
            const bonusAwarded = user.coins - previousCoins;

            if (bonusAwarded > 0) {
                addUserActivity(user.id, 'daily_bonus', bonusAwarded, {
                    reason: 'Daily login bonus applied'
                });
            }
        }
    }
}
```

### 5.4 Prediction Module
```javascript
function hasMatchStarted(match) {
    return new Date(match.kickoff) <= new Date();
}

function isMatchLocked(match) {
    return hasMatchStarted(match) || match.status === 'finished';
}

function submitPrediction() {
    const match = matches.find(m => m.id === currentMatchId);

    if (isMatchLocked(match)) {
        alert('This match is locked. Predictions cannot be created or changed after kickoff.');
        return;
    }

    addUserActivity(currentUser.id, 'prediction_bet', -betAmount, {
        reason: 'Coins deducted for new prediction',
        matchId: currentMatchId,
        predictionScore: `${homeScore} - ${awayScore}`
    });

    renderCurrentUserActivity();
}
```

### 5.5 Activity History Module
```javascript
function ensureUserActivityLog(user) {
    if (!Array.isArray(user.activityLog)) {
        user.activityLog = [];
    }
    return user.activityLog;
}

function addUserActivity(userId, type, amount, details = {}) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const activityLog = ensureUserActivityLog(user);
    activityLog.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type,
        amount,
        balanceAfter: user.coins,
        timestamp: new Date().toISOString(),
        details
    });
}

function renderCurrentUserActivity() {
    const summaryContainer = document.getElementById('myActivitySummary');
    const listContainer = document.getElementById('myActivityList');
    if (!summaryContainer || !listContainer || !currentUser) return;
}
```

### 5.6 Admin Module
```javascript
function isAdminUser(user) {
    return !!(user && user.isAdmin);
}

function isAdmin() {
    return isAdminUser(currentUser);
}

async function toggleAdminStatus(userId) {
    const currentUserIsPrimaryAdmin = currentUser && currentUser.nickname === ADMIN_NICKNAME;
    const willBecomeAdmin = !user.isAdmin;

    if (willBecomeAdmin && !currentUserIsPrimaryAdmin) {
        alert('Only Menicos can promote users to admin.');
        return;
    }
}

function showUserActivity(userId) {
    selectedUserActivityId = userId;

    if (activeTabName !== 'users') {
        showTab('users');
    } else {
        renderAdminActivityViewer();
    }
}
```

### 5.7 Leaderboard Module
```javascript
function updateLeaderboard() {
    const poolSelect = document.getElementById('poolSelect');
    const poolId = poolSelect.value;
    const leaderboardList = document.getElementById('leaderboardList');

    let usersToRank = poolId === 'global'
        ? users
        : users.filter(u => {
            const pool = pools.find(p => p.id === parseInt(poolId));
            return pool && pool.members.includes(u.id);
        });

    usersToRank.sort((a, b) => b.coins - a.coins);
}
```

---

## 6. Firebase Integration

### 6.1 Configuration
```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
```

### 6.2 Database Structure
```text
firebase-database/
├── users/
│   └── {userId}/
│       ├── id
│       ├── nickname
│       ├── email
│       ├── pin
│       ├── coins
│       ├── totalPredictions
│       ├── correctPredictions
│       ├── exactScores
│       ├── winStreak
│       ├── createdAt
│       ├── lastLogin
│       ├── isAdmin
│       └── activityLog[]
├── pools/
├── predictions/
├── matches/
└── adminNotifications/
```

### 6.3 Database Operations
```javascript
const users = await FirebaseDB.getUsers();
const pools = await FirebaseDB.getPools();
const predictions = await FirebaseDB.getPredictions();
const matches = await FirebaseDB.getMatches();

await FirebaseDB.saveUser(userObject);
await FirebaseDB.savePool(poolObject);
await FirebaseDB.savePrediction(predictionObject);
await FirebaseDB.saveAllMatches(matchesArray);
```

---

## 7. Code Examples

### 7.1 Activity Entry Example
```javascript
addUserActivity(currentUser.id, 'prediction_bet', -betAmount, {
    reason: 'Coins deducted for new prediction',
    matchId: currentMatchId,
    predictionScore: `${homeScore} - ${awayScore}`
});
```

### 7.2 Admin Activity Rendering Example
```javascript
function renderAdminActivityViewer() {
    const container = document.getElementById('adminActivityViewer');
    if (!container || !isAdmin()) return;

    const user = users.find(u => String(u.id) === String(selectedUserActivityId));
    if (!user) return;

    container.innerHTML = `
        <div>
            <h3>Coin Activity: ${user.nickname}</h3>
            ${buildActivitySummary(user)}
            ${buildActivityEntriesHtml(user, 'No activity recorded yet.')}
        </div>
    `;
}
```

### 7.3 Match Locking Example
```javascript
if (isMatchLocked(match)) {
    alert('This match is locked. Predictions cannot be created or changed after kickoff.');
    closePredictionModal();
    loadMatches();
    return;
}
```

---

## 8. Best Practices

- Keep all visible version labels synchronized with [`APP_VERSION`](../app.js)
- Update documentation whenever behavior changes
- Record coin mutations through [`addUserActivity()`](../app.js)
- Keep admin-only actions protected through [`isAdmin()`](../app.js)
- Refresh HTML activity views after prediction, payout, or admin changes
- Preserve Menicos as the protected primary admin
- Commit each release with the version number in the commit message

---

**Document Version:** 1.7.1
**Created:** June 2026
**Author:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Status:** Active
**Latest Features:**
- HTML activity history screens for users and admins
- Match locking after kickoff
- Multi-admin support with protected primary admin
- Daily bonus reduced to 100 coins
- Activity logging for predictions, payouts, bonuses, and admin actions