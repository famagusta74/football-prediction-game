# Football Prediction Game - Technical Specification Document

**Version:** 1.9.0
**Last Updated:** June 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)

## 1. System Architecture

### 1.1 Overview
The application follows a client-side architecture with cloud database synchronization:

```text
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML5      │  │    CSS3      │  │  JavaScript  │      │
│  │  (Structure) │  │   (Styling)  │  │   (Logic)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                            ▼                                │
│                  ┌──────────────────┐                       │
│                  │  localStorage    │                       │
│                  │  (Fallback)      │                       │
│                  └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Realtime Database                     │
│                  (Cloud Storage)                            │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │  Users   │  │  Pools   │  │ Predictions│  │ Matches  │  │
│  └──────────┘  └──────────┘  └────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- HTML5 (Semantic markup)
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- No frameworks or libraries (except Firebase SDK)

**Backend/Database:**
- Firebase Realtime Database (NoSQL)
- Firebase SDK v9.22.0 (Compat mode)
- Hosted on GitHub Pages

**Development Tools:**
- Git for version control
- VS Code as IDE
- IBM Bob AI Assistant for development

---

## 2. File Structure

```text
football-prediction-game/
├── index.html
├── app.js
├── styles.css
├── firebase-config.js
├── README.md
├── FIREBASE_SETUP.md
└── docs/
    ├── APPLICATION_DEFINITION.md
    ├── GAME_SUMMARY.md
    ├── TECHNICAL_SPECIFICATION.md
    ├── SOURCE_CODE_DOCUMENTATION.md
    └── index.html
```

---

## 3. Core Modules

### 3.1 Authentication Module

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
Dashboard Display → Optional Browser Notification
```

**Security:**
- 4-digit PIN validation
- Case-insensitive nickname matching
- Duplicate email/nickname prevention
- Session stored in localStorage

### 3.2 Prediction Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`loadMatches()`](../app.js)
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
- Match cards are visually marked as predicted or unpredicted

### 3.3 Activity History Module

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
- Daily bonus entries support an `activityKey` for same-day deduplication

### 3.4 Pool Management Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`createPool()`](../app.js)
- [`joinPool()`](../app.js)
- [`leavePool()`](../app.js)
- [`generatePoolCode()`](../app.js)
- [`loadPools()`](../app.js)

### 3.5 Leaderboard Module

**File:** [`app.js`](../app.js)

**Functions:**
- [`updateLeaderboard()`](../app.js)
- [`getUserNickname()`](../app.js)

**Ranking Algorithm:**
```text
1. Filter users by pool membership or global scope
2. Calculate accuracy from correct predictions and total predictions
3. Sort by coins descending
4. Render rankings and stats
```

### 3.6 Admin Module

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

## 4. Data Persistence

### 4.1 User Persistence

**Functions:**
- [`saveUsers()`](../app.js)
- [`loadDataFromFirebase()`](../app.js)

**Behavior:**
- Users are stored in Firebase when available
- localStorage is used as fallback
- Activity history is persisted as part of the user object
- Daily bonus activity keys are stored inside activity entry details

### 4.2 Prediction Persistence

**Functions:**
- [`savePredictions()`](../app.js)
- [`FirebaseDB.savePrediction()`](../firebase-config.js)

**Behavior:**
- Predictions are stored separately from users
- Each prediction is linked by `userId` and `matchId`
- Processed state prevents duplicate payout handling

### 4.3 Notification Persistence

**Functions:**
- [`notifyAdminNewUser()`](../app.js)
- [`FirebaseDB.saveNotification()`](../firebase-config.js)
- [`FirebaseDB.getNotifications()`](../firebase-config.js)

**Behavior:**
- Admin registration notifications are stored in Firebase or localStorage
- Daily bonus user notifications are browser-side only and are not persisted as admin notifications

---

## 5. UI and Styling Rules

### 5.1 Match Card Styling

**File:** [`styles.css`](../styles.css)

**States:**
- Default card
- Predicted card
- Unpredicted card
- Locked card
- Hover states

**Behavior:**
- Predicted cards use a green palette
- Unpredicted cards use a blue-grey palette
- Hover styling remains active for both states
- Prediction state is assigned dynamically in [`loadMatches()`](../app.js)

### 5.2 Version Labels

**Files:**
- [`app.js:2`](../app.js:2)
- [`index.html:21`](../index.html:21)
- [`index.html:114`](../index.html:114)
- [`index.html:132`](../index.html:132)
- [`index.html:146`](../index.html:146)
- [`docs/index.html:190`](index.html:190)

**Rule:**
Every release must update all visible version labels and the internal version constant together.

---

## 6. Database Structure

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

## 7. Release Procedure

For every code change:
1. Update the version constant in [`app.js:2`](../app.js:2)
2. Update all visible version labels in [`index.html`](../index.html) and [`docs/index.html`](index.html)
3. Update the documentation set in [`docs/GAME_SUMMARY.md`](GAME_SUMMARY.md), [`docs/APPLICATION_DEFINITION.md`](APPLICATION_DEFINITION.md), [`docs/SOURCE_CODE_DOCUMENTATION.md`](SOURCE_CODE_DOCUMENTATION.md), and [`docs/TECHNICAL_SPECIFICATION.md`](TECHNICAL_SPECIFICATION.md)
4. Create a local git commit for the Mac GitHub Desktop workflow
5. Push from GitHub Desktop and verify deployment

---

## 8. Version 1.9.0 Technical Notes

Version 1.9.0 introduces:
- Predicted versus unpredicted match card styling in [`styles.css`](../styles.css) and [`loadMatches()`](../app.js)
- Daily login thank-you notifications through [`showDailyBonusNotification()`](../app.js)
- Same-day daily bonus activity deduplication using `activityKey` values in [`addUserActivity()`](../app.js)
- Updated UI messaging in [`index.html`](../index.html) to explain match card colors

This document reflects the version 1.9.0 implementation baseline.