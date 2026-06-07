# Football Prediction Game - Technical Specification Document

**Version:** 1.7.1
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

**Flow:**
```text
User Input → Validation → Firebase/localStorage Check →
Session Creation → Dashboard Display
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

## 4. Firebase Integration

### 4.1 Configuration

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

### 4.2 Database Structure

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
│   └── {poolId}/
│       ├── id
│       ├── name
│       ├── description
│       ├── code
│       ├── adminId
│       ├── members[]
│       └── createdAt
├── predictions/
│   └── {predictionId}/
│       ├── id
│       ├── userId
│       ├── matchId
│       ├── homeScore
│       ├── awayScore
│       ├── betAmount
│       ├── createdAt
│       ├── modifiedAt
│       ├── processed
│       └── payout
├── matches/
│   └── {matchId}/
│       ├── id
│       ├── homeTeam
│       ├── awayTeam
│       ├── kickoff
│       ├── status
│       ├── league
│       ├── stage
│       ├── venue
│       └── finalScore/
│           ├── home
│           └── away
└── adminNotifications/
    └── {notificationId}/
        ├── type
        ├── user/
        ├── timestamp
        └── read
```

### 4.3 Database Operations

**Read Operations:**
```javascript
const users = await FirebaseDB.getUsers();
const pools = await FirebaseDB.getPools();
const predictions = await FirebaseDB.getPredictions();
const matches = await FirebaseDB.getMatches();
```

**Write Operations:**
```javascript
await FirebaseDB.saveUser(userObject);
await FirebaseDB.savePool(poolObject);
await FirebaseDB.savePrediction(predictionObject);
await FirebaseDB.saveAllMatches(matchesArray);
```

### 4.4 Data Migration

**One-time Migration from localStorage to Firebase:**
```javascript
async function migrateLocalStorageToFirebase() {
    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const localPools = JSON.parse(localStorage.getItem('pools')) || [];
    const localPredictions = JSON.parse(localStorage.getItem('predictions')) || [];
    const localNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];

    for (const user of localUsers) {
        await FirebaseDB.saveUser(user);
    }
    for (const pool of localPools) {
        await FirebaseDB.savePool(pool);
    }
    for (const prediction of localPredictions) {
        await FirebaseDB.savePrediction(prediction);
    }
    for (const notification of localNotifications) {
        await FirebaseDB.saveNotification(notification);
    }

    localStorage.setItem('firebaseMigrationDone', 'true');
}
```

---

## 5. Data Flow Diagrams

### 5.1 User Registration Flow

```text
Create Account → Validate Input → Create User Object →
Save User → Notify Admin → Redirect to Login
```

### 5.2 Prediction Submission Flow

```text
Open Match → Validate Scores and Bet → Check Match Lock →
Create or Edit Prediction → Deduct Coins if Needed →
Add Activity Entry → Save Prediction → Refresh HTML Views
```

### 5.3 Admin Result Processing Flow

```text
Enter Final Result → Save Match → Process Results →
Calculate Payouts → Update Coins and Stats →
Add Activity Entries → Save Changes → Refresh Displays
```

---

## 6. API Reference

### 6.1 Firebase Helper Functions

**[`FirebaseDB.saveUser(user)`](../firebase-config.js)**
- Purpose: Save or update user in Firebase
- Returns: Promise<boolean>

**[`FirebaseDB.getUsers()`](../firebase-config.js)**
- Purpose: Retrieve all users from Firebase
- Returns: Promise<Array<User>>

**[`FirebaseDB.savePool(pool)`](../firebase-config.js)**
- Purpose: Save or update pool in Firebase
- Returns: Promise<boolean>

**[`FirebaseDB.getPools()`](../firebase-config.js)**
- Purpose: Retrieve all pools from Firebase
- Returns: Promise<Array<Pool>>

**[`FirebaseDB.savePrediction(prediction)`](../firebase-config.js)**
- Purpose: Save prediction in Firebase
- Returns: Promise<boolean>

**[`FirebaseDB.getPredictions()`](../firebase-config.js)**
- Purpose: Retrieve all predictions from Firebase
- Returns: Promise<Array<Prediction>>

**[`FirebaseDB.saveAllMatches(matches)`](../firebase-config.js)**
- Purpose: Save all matches in Firebase
- Returns: Promise<boolean>

**[`FirebaseDB.getMatches()`](../firebase-config.js)**
- Purpose: Retrieve all matches from Firebase
- Returns: Promise<Array<Match>>

### 6.2 Core Application Functions

**[`login()`](../app.js)**
- Purpose: Authenticate user
- Async: Yes
- Side Effects: Sets current user, applies daily bonus when eligible, records activity

**[`register()`](../app.js)**
- Purpose: Create new user account
- Async: Yes
- Side Effects: Adds user to database, notifies admin

**[`submitPrediction()`](../app.js)**
- Purpose: Save or edit user's match prediction
- Validation: Valid scores, sufficient coins, unlocked match
- Side Effects: Deducts coins when needed, records activity, refreshes activity views

**[`processFinishedMatches()`](../app.js)**
- Purpose: Process payouts for finished matches
- Side Effects: Updates balances, stats, and activity logs

**[`showUserActivity()`](../app.js)**
- Purpose: Open selected user's activity in the admin HTML area
- Side Effects: Selects user and renders activity viewer

---

## 7. Operational Rules

### 7.1 Versioning
Every change should update:
- [`APP_VERSION`](../app.js)
- Visible version labels in [`index.html`](../index.html)
- Documentation portal version in [`docs/index.html`](index.html)
- Relevant documentation files in [`docs/`](.)

### 7.2 Coin Rules
- Starting balance: 1000
- Daily bonus: 100
- Maximum balance: 2000
- Prediction bet range: 10 to 500
- All coin mutations should be logged in activity history

### 7.3 Match Rules
- Predictions allowed only before kickoff
- Started matches are locked automatically
- Locked matches remain frozen until admin enters result
- Finished matches require admin processing for payouts

---

## 8. Maintenance Notes

- Keep documentation synchronized with behavior changes
- Preserve Menicos as the protected primary admin
- Prefer HTML-based activity rendering over popup-based history views
- Refresh user-facing activity after prediction, payout, and admin changes
- Commit releases with explicit version numbers in commit messages

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