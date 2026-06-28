# Football Prediction Game - Source Code Documentation

**Version:** 3.2.4
**Last Updated:** June 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Total Lines of Code:** ~4,480

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
**Version:** 3.2.4
**Built by:** IBM Bob AI Assistant
**Technology:** Vanilla JavaScript, HTML5, CSS3, Firebase
**Lines of Code:** ~2,800 (JavaScript), ~1,600 (CSS), ~380 (HTML)

**v3.2.4 — Live Lock & Auto-Refresh:**
- Match cards show LIVE badge (pulsing red) once kickoff passes
- Cards in progress show "🔴 Match in progress — predictions are closed" banner
- Locked cards no longer clickable (cursor: default, no hover lift)
- Match list auto-refreshes every 60 seconds while Predictions tab is open
- Status label computed from kickoff time (not just DB status field)

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
├── styles.css                 # Styling (~1,200 lines)
│   ├── Global Styles
│   ├── Screen Layouts
│   ├── Component Styles
│   ├── Match Card States
│   ├── Animations
│   ├── Responsive Design
│   └── NEW: Calendar & Team Flags Views (v2.0.0)
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
        <div class="version-header">v1.10.1 - Bob Blue Palette Refresh</div>
        <div class="hero-banner">
            <div class="hero-content">
                <div class="logo">⚽</div>
                <div class="hero-copy">
                    <div class="hero-kicker">FIFA World Cup 2026 Experience</div>
                    <h1>Football Prediction Game</h1>
                    <p class="subtitle">Predict. Compete. Win the tournament vibe.</p>
                </div>
            </div>
        </div>
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
            <div class="version-badge">v1.10.1</div>
        </div>
        <button onclick="logout()" class="btn-logout">Logout</button>
    </div>

    <div class="tabs">
        <button class="tab active" onclick="showTab('predictions')">Predictions</button>
        <button class="tab" onclick="showTab('history')">History</button>
        <button class="tab" onclick="showTab('pools')">My Pools</button>
        <button class="tab" onclick="showTab('leaderboard')">Leaderboard</button>
        <button class="tab" onclick="showTab('activity')">Activity</button>
        <button class="tab" onclick="showTab('matches')" style="display: none;">⚙️ Matches</button>
        <button class="tab" onclick="showTab('users')" style="display: none;">Users</button>
    </div>
</div>
```

### 3.4 Predictions Screen Messaging
```html
<div id="predictionsTab" class="tab-content active">
    <div class="container">
        <h2>Upcoming Matches</h2>
        <p>Login every day to win coins</p>
        <p>✅ Green cards already have your saved prediction. Blue-grey cards are still open for a new pick, and daily login always awards 100 coins.</p>
        <div id="matchesList" class="matches-list"></div>
    </div>
</div>
```

### 3.5 Activity Screens
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

### 3.6 Prediction Modal
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

### 4.1 Layout System
```css
.screen {
    display: none;
    min-height: 100vh;
    padding: 20px;
}

.matches-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}
```

### 4.2 Match Card States
```css
.match-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 2px solid #ddd;
    transition: all 0.3s;
    cursor: pointer;
}

.match-card.unpredicted {
    background: linear-gradient(135deg, #f8f9fa 0%, #eef3f8 100%);
    border-color: #d6dde6;
}

.match-card.predicted {
    background: linear-gradient(135deg, #dff8e7 0%, #c8f0d5 100%);
    border-color: #1f8a39;
    box-shadow: 0 10px 24px rgba(31, 138, 57, 0.18);
}
```

### 4.3 Buttons and Interaction
```css
.btn-primary {
    background: #1e3c72;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.match-card:hover {
    border-color: #1e3c72;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
```

---

## 5. JavaScript Modules

### 5.1 Authentication Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`login()`](../app.js)
- [`register()`](../app.js)
- [`logout()`](../app.js)
- [`showLogin()`](../app.js)
- [`showRegister()`](../app.js)
- [`requestNotificationPermission()`](../app.js)
- [`showDailyBonusNotification()`](../app.js)

**Flow:**
```text
User Input → Validation → Firebase/localStorage Check →
Daily Bonus Evaluation → Activity Logging → Save User State →
Reload Persisted User → Dashboard Display → Optional Notification
```

**Security and Session Rules:**
- 4-digit PIN validation
- Case-insensitive nickname matching
- Duplicate email/nickname prevention
- Session stored in localStorage

### 5.2 Prediction Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`loadMatches()`](../app.js) - Loads upcoming matches with Today's Games section
- [`loadHistory()`](../app.js) - Loads finished matches for History tab
- [`renderMatchCard()`](../app.js) - Helper function to render match cards
- [`openPredictionModal()`](../app.js)
- [`submitPrediction()`](../app.js)
- [`calculatePayout()`](../app.js)
- [`hasMatchStarted()`](../app.js)
- [`isMatchLocked()`](../app.js)

**Validation Rules:**
```text
- Bet amount >= 10 coins
- Bet amount <= 500 coins
- Scores must be non-negative integers
- Prediction before kickoff
- Prediction locked after kickoff
```

**Behavior:**
- Matches become unavailable for prediction once kickoff passes
- Locked matches remain frozen until admin enters the final result
- Users can edit predictions only before kickoff
- Prediction deductions and edits are recorded in activity history
- Match cards are derived from the current user's saved prediction list before rendering
- Predicted and unpredicted cards use different visual states

### 5.3 Activity History Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`ensureUserActivityLog()`](../app.js)
- [`addUserActivity()`](../app.js)
- [`buildActivitySummary()`](../app.js)
- [`buildActivityEntriesHtml()`](../app.js)
- [`renderCurrentUserActivity()`](../app.js)
- [`renderAdminActivityViewer()`](../app.js)
- [`showUserActivity()`](../app.js)

**Tracked Activity Types:**
```text
- daily_bonus
- prediction_bet
- prediction_edit
- payout
- admin_reset
- admin_grant
- admin_remove
```

**Behavior:**
- Users can view their own activity in the HTML [`Activity`](../index.html) tab
- Admins can inspect any user's activity in the HTML users area
- Each entry stores amount, timestamp, balance after change, and optional match/admin context
- Daily bonus entries can include an `activityKey` to prevent duplicate same-day records
- Activity entries can override `balanceAfter` explicitly for accurate rendering after coin mutations
- After login, the refreshed persisted user record is used so normal users immediately see the new daily bonus entry

### 5.4 Pool Management Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`createPool()`](../app.js)
- [`joinPool()`](../app.js)
- [`leavePool()`](../app.js)
- [`generatePoolCode()`](../app.js)
- [`loadPools()`](../app.js)

### 5.5 Leaderboard Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`getPredictionEarnedCoins()`](../app.js)
- [`updateLeaderboard()`](../app.js)
- [`getUserNickname()`](../app.js)

**Ranking Algorithm:**
```text
1. Filter users by pool membership or global scope
2. Calculate accuracy from correct predictions and total predictions
3. Sort by coins descending
4. Render rankings and stats
```

### 5.6 Admin Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`loadAdminMatches()`](../app.js)
- [`enterMatchResult()`](../app.js)
- [`editMatchResult()`](../app.js)
- [`processFinishedMatches()`](../app.js)
- [`loadUsersTab()`](../app.js)
- [`toggleAdminStatus()`](../app.js)
- [`resetUserCoins()`](../app.js)
- [`deleteUser()`](../app.js)

**Admin Model:**
```javascript
const ADMIN_NICKNAME = "Menicos";
const DEFAULT_ADMIN_NICKNAMES = [ADMIN_NICKNAME];

function isAdminUser(user) {
    return !!(user && user.isAdmin);
}

function isAdmin() {
    return isAdminUser(currentUser);
}
```

**Rules:**
- Menicos remains the protected primary admin
- Only Menicos can promote regular users to admin
- Admins can remove admin access from other users
- Primary admin cannot be demoted or deleted

---

## 6. Firebase Integration

### 6.1 Configuration

**File:** [`firebase-config.js`](../firebase-config.js)

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyATsmrz6NlM1bgootQFhIrZAmT-vui_chI",
    authDomain: "football-prediction-game-ca155.firebaseapp.com",
    databaseURL: "https://football-prediction-game-ca155-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "football-prediction-game-ca155",
    storageBucket: "football-prediction-game-ca155.firebasestorage.app",
    messagingSenderId: "266847662424",
    appId: "1:266847662424:web:fc24bb439d3015e02cf52d"
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

---

## 7. Code Examples

### 7.1 Version Constant
```javascript
const APP_VERSION = "v1.10.1";
```

### 7.2 Predicted Match Detection
```javascript
const currentUserPredictions = predictions.filter(p => p.userId === currentUser.id);

matches.forEach(match => {
    const userPrediction = currentUserPredictions.find(p => p.matchId === match.id);
});
```

### 7.3 Daily Bonus Activity Logging
```javascript
if (!hasDailyBonusEntry) {
    user.coins += 100;
    addUserActivity(user.id, 'daily_bonus', 100, {
        reason: 'Daily login bonus applied',
        activityKey,
        balanceAfter: user.coins
    });
}
```

### 7.4 Reload Persisted User After Bonus Save
```javascript
await saveUsers();

if (useFirebase) {
    users = await FirebaseDB.getUsers();
} else {
    users = JSON.parse(localStorage.getItem('users')) || [];
}

currentUser = users.find(u => u.id === user.id) || user;
```

---

## 8. Best Practices

- Keep version labels synchronized across [`app.js`](../app.js), [`index.html`](../index.html), and [`docs/index.html`](index.html)
- Update all documentation files for every release
- Prefer HTML-rendered activity history over popup-only diagnostics
- Preserve admin protections for the Menicos account
- Keep prediction locking tied to kickoff time
- Use activity keys for idempotent daily bonus logging
- Store explicit `balanceAfter` values when an activity entry must reflect a post-update balance exactly
- Reload the persisted user record after login-side bonus writes so the UI reflects the saved state immediately
- Create a local git commit for each release so GitHub Desktop can push it

This documentation reflects the version 1.14.0 codebase and release workflow.