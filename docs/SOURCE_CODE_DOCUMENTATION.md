# Football Prediction Game - Source Code Documentation

**Version:** 4.1.4
**Last Updated:** July 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Total Lines of Code:** ~5,460

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
**Version:** 4.1.4
**Built by:** IBM Bob AI Assistant
**Technology:** Vanilla JavaScript, HTML5, CSS3, Firebase, EmailJS
**Lines of Code:** ~3,610 (JavaScript), ~2,040 (CSS), ~460 (HTML)

**v4.1.4 — Bronze final & Final Matches Added:**
- 2 final-stage fixtures added (ids 103–104), completing the FIFA World Cup 2026 schedule
- ID 103: France vs England — Sat 18 Jul, 23:00, Miami Stadium (Bronze final / 3rd-place play-off)
- ID 104: Spain vs Argentina — Sun 19 Jul, 21:00, New York/New Jersey Stadium (Final)
- `isKnockout()` extended to also match `'Bronze final'` so both matches show the full 3-tab prediction form (90 min / ET / Penalties)
- All users auto-updated via Firebase version-based merge on next page load

**v4.1.3 — Chat Badge on Login (correct behaviour):**
- Badge now appears immediately on login if messages arrived since the user's last session
- Two-phase logic in `startChatUnreadWatcher()`:
  - **Phase 1 (on-login check):** fetch latest message per channel via `once('value')`; compare its timestamp against the stored `chatLastSeen` value for that channel; if newer → `markChatUnread()` fires immediately
  - **Phase 2 (live watcher):** attach `child_added` listener using `nowTs` (login moment) as threshold; only genuinely new messages arriving after login trigger further badge updates
- `chatLastSeen` per channel is written to `localStorage` when the user opens/reads a channel — persists across sessions and page reloads
- First-time users (no `chatLastSeen` stored) always see badge if any message exists

**v4.1.2 — Chat Unread Badge Fix:**
- Desktop badge shows pulsing red **NEW** pill; mobile dot 11px pulsing glow
- `@keyframes badge-pulse` added for both indicators

**v4.1.1 — Mobile Chat Overlay:**
- Full-screen chat overlay opens from the 💬 Chat button in the mobile bottom nav
- No tab switch needed — overlay floats above the current screen and can be dismissed with ✕
- Header shows current channel; horizontally scrollable sub-tabs for Global + each pool
- Message window fills all available height; input bar is always pinned to the bottom (stays above keyboard)
- Sending works with Enter or the round send button; Firebase real-time subscription active while overlay is open
- Unread dot on the mobile Chat nav button still works — clears when overlay opens
- Email verification notice shown inside overlay for unverified users

**v4.1.0 — Chat Unread Badge & User Activity Columns:**
- Chat tab (desktop) shows a red dot badge when there are unread messages in Global or any pool chat
- Mobile nav Chat button shows a red dot overlay when unread messages are waiting
- Badge clears automatically when the user opens the Chat tab (or a specific channel)
- Unread state survives page reload (stored in localStorage per channel)
- Admin Users table gains two new columns: **Last Login** (date + time) and **Last Prediction** (date + time)
- `lastPrediction` written to user record whenever a standard or knockout prediction is saved
- `lastLogin` was already tracked on login — now also displayed in the table

**v4.0.3 — Fix Chat: Firebase Rules + Message Rendering:**
- Root cause: `globalChat` and `poolChat` paths were missing from Firebase Realtime Database rules — all reads and writes were silently denied
- Fix: `FIREBASE_SETUP.md` updated with complete rules including `globalChat`, `poolChat`, and `matches`
- Fix: `loadGlobalChat()` and `loadPoolChat()` now clear the rendered-IDs set and the message window on each fresh subscription, so messages always appear correctly on tab re-open
- Admin must update Firebase rules manually (one-time step — see RELEASE_NOTES_v4.0.3.md)

**v4.0.2 — Fix EmailJS "Recipients address is corrupted":**
- Send both `email`+`to_email` and `name`+`to_name` fields so template works regardless of which variable name is used in EmailJS
- `reply_to` on verification email fixed (was hardcoded noreply, now uses real admin email)

**v4.0.1 — EmailJS Setup Banner & Error Diagnostics:**
- Setup banner now shown in admin email panel whenever EmailJS is not yet configured
- `adminSendEmail()` checks for missing SDK (`typeof emailjs === 'undefined'`) and shows a clear red error message instead of silently doing nothing
- Progress counter shown while sending ("⏳ Sent 2 / 5…")
- Detailed error message on failure (shows EmailJS error text, not generic message)
- `isEmailJSConfigured()` helper centralises all configuration checks
- `showEmailSetupBanner()` called automatically when the Users tab loads

**v4.0.0 — Chat & Email Service:**
- Real-time Global Chat: all logged-in players can send/receive messages in a shared chat room, powered by Firebase Realtime Database live subscriptions
- Pool Chat: each pool has its own private chat room, only visible to pool members
- Chat UI: message bubbles (your messages right-aligned navy, others left-aligned white), sender name, timestamp, auto-scroll to latest
- Mobile friendly: Chat tab in mobile bottom nav (💬)
- Admin Email Panel: admin can send emails to all players or individual users from the Users tab (requires EmailJS setup)
- Email Verification: new users get an "Unverified" notice in the Chat tab with a "Send verification email →" button; clicking a verification link in the email marks the account as verified
- Existing users: shown an "Unverified" notice; no forced re-registration needed
- emailVerified field added to user objects (false for new/existing, true after verification)
- EmailJS integration: free browser-side email service — see RELEASE_NOTES_v4.0.0.md for setup steps
- Firebase paths added: globalChat/, poolChat/{poolId}/
- All changes automatically propagate to all users via Firebase real-time sync

**v3.4.2 — Semi-final Matches Added:**
- 2 Semi-final fixtures added (ids 101–102), covering 14–15 Jul 2026
- SF1: France vs Spain — Tue 14 Jul, 22:00, Dallas Stadium (Dallas)
- SF2: England vs Argentina — Wed 15 Jul, 22:00, Atlanta Stadium (Atlanta)
- Both matches use the full 3-tab knockout prediction form (90 min / ET / Penalties)
- Matches automatically sync to all users via Firebase version-based merge on next load

**v3.4.1 — Knockout Form for Quarter-finals, Semi-finals & Final:**
- `isKnockout()` extended to return `true` for `Quarter-final`, `Semi-final`, and `Final` stages
- All 4 Quarter-final matches (ids 97–100) now show the full 3-tab knockout prediction form (90 min / ET / Penalties)
- Semi-final and Final stages are also future-proofed with this change
- No match data or scoring logic changed

**v3.4.0 — Quarter-final Matches Added:**
- 4 Quarter-final fixtures added (ids 97–100), covering 09–12 Jul 2026
- QF1: France vs Morocco — Thu 9 Jul, 23:00, Boston Stadium
- QF2: Spain vs Belgium — Fri 10 Jul, 22:00, Los Angeles Stadium
- QF3: Norway vs England — Sun 12 Jul, 00:00, Miami Stadium
- QF4: Argentina vs Switzerland — Sun 12 Jul, 04:00, Kansas City Stadium
- Matches automatically sync to all users via Firebase version-based merge on next load

**v3.3.1 — Modal Scroll Fix:**
- Prediction modal on desktop now has `max-height: 90vh` and `overflow-y: auto`
- Submit Knockout Prediction button is always visible and reachable on all screen sizes
- No logic or data changes

**v3.3.0 — Round of 16 Matches Added:**
- 8 Round of 16 fixtures added (ids 89–96), covering 04–07 Jul 2026
- All matches support the full 3-stage knockout prediction (90 min / ET / Penalties)
- Times stored in EEST (Cyprus/Greece, UTC+3) as per all previous knockout rounds
- Matches automatically sync to all users via Firebase version-based merge on next load

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