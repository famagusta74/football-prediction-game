# Football Prediction Game - Technical Specification Document

**Version:** 2.0.6
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
Reload Persisted User → Dashboard Display → Optional Browser Notification
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
- Match cards are visually marked by checking the current user's saved predictions before rendering
- Predicted cards use a stronger green palette and unpredicted cards use a blue-grey palette


### 3.2.1 Calendar & Team Flags Views (v2.0.0)

**File:** [`app.js`](../app.js)

**New Functions:**
- [`switchPredictionView(view)`](../app.js) - Switch between list, calendar, and team flags views
- [`renderCalendar()`](../app.js) - Render interactive calendar grid
- [`navigateCalendar(direction)`](../app.js) - Navigate between months
- [`selectCalendarDate(date)`](../app.js) - Select a date and display its matches
- [`getMatchesForDate(date)`](../app.js) - Filter matches by date
- [`displayCalendarMatches(date)`](../app.js) - Display matches for selected date
- [`renderTeamsGrid()`](../app.js) - Render team flags grid
- [`selectTeam(team)`](../app.js) - Select a team and display its matches
- [`displayTeamMatches(team)`](../app.js) - Display matches for selected team
- [`filterTeams()`](../app.js) - Filter teams by search input
- [`createMatchCard(match)`](../app.js) - Create reusable match card for all views

**View Types:**
1. **List View** (Default)
   - Traditional chronological match listing
   - Quick guide cards for new users
   - Bob suggestion KPI tracking

2. **Calendar View**
   - Interactive calendar grid (7x6 layout)
   - Day headers (Sun-Sat)
   - Visual indicators for dates with matches
   - Today's date highlighted
   - Month navigation (previous/next)
   - Click on date to see matches
   - Match count badge on dates with matches
   - Historical matches displayed as read-only

3. **Team Flags View**
   - Grid of all participating teams with flags
   - Country flag emoji for each team
   - Match count for each team
   - Search functionality to filter teams
   - Click on team to see all their matches
   - Responsive grid layout (auto-fill)
   - Historical matches displayed as read-only

**Team Flag Mapping:**
```javascript
const teamFlags = {
    "Mexico": "🇲🇽", "South Africa": "🇿🇦", "Korea Republic": "🇰🇷",
    "Czechia": "🇨🇿", "Canada": "🇨🇦", "Bosnia and Herzegovina": "🇧🇦",
    "USA": "🇺🇸", "Paraguay": "🇵🇾", "Qatar": "🇶🇦",
    "Switzerland": "🇨🇭", "Brazil": "🇧🇷", "Morocco": "🇲🇦",
    // ... 48 total teams with flags
};
```

**Historical Match Handling:**
- Matches with `status === 'finished'` are read-only
- Matches past kickoff time are locked for predictions
- Historical predictions are preserved and displayed
- "View Only" badge shown on historical predictions
- Prediction buttons hidden for locked/finished matches
- Final scores displayed for finished matches

**CSS Classes (v2.0.0):**
- `.view-toggle` - Container for view toggle buttons
- `.view-toggle-btn` - Individual view toggle button
- `.prediction-view` - Container for each view type
- `.calendar-grid` - Calendar grid layout
- `.calendar-day` - Individual calendar day cell
- `.calendar-day.has-matches` - Day with matches
- `.calendar-day.selected` - Selected day
- `.calendar-day.today` - Current day
- `.teams-grid` - Team flags grid layout
- `.team-card` - Individual team card
- `.team-card.selected` - Selected team
- `.team-flag` - Team flag emoji display

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
- Activity entries can store an explicit `balanceAfter` override so the rendered history reflects the true post-update balance
- After login, the refreshed persisted user record is used so normal users immediately see the new daily bonus entry

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
- [`getPredictionEarnedCoins()`](../app.js:1404)
- [`updateLeaderboard()`](../app.js:1414)
- [`getUserNickname()`](../app.js)

**Ranking Algorithm:**
```text
1. Filter users by pool membership or global scope
2. Calculate total coins won from positive prediction payout activity only
3. Sort users by prediction-earned coins descending
4. Use accuracy and correct predictions as tie-breakers
5. Aggregate pool totals from member prediction winnings
6. Sort pools by total prediction winnings descending, then by member count
7. Render both user and pool rankings with supporting stats
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
- Daily bonus awards always add 100 coins on each eligible new day without a balance cap
- After saving a login-side bonus, the app reloads the persisted user list before rendering the dashboard

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
- Predicted cards use a stronger green palette
- Unpredicted cards use a blue-grey palette
- Hover styling remains active for both states
- Prediction state is assigned dynamically in [`loadMatches()`](../app.js) from the current user's saved predictions

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

## 8. Version 1.14.0 Technical Notes

Version 1.14.0 introduces:
- Persistent Bob suggestions stored on each match through [`ensureMatchSuggestion()`](../app.js:1142)
- Suggestion evaluation against final scores through [`evaluateBobSuggestion()`](../app.js:1188)
- A reusable KPI aggregation layer through [`getBobSuggestionKpi()`](../app.js:1237) and [`renderBobSuggestionKpi()`](../app.js:1252)
- Finished-match suggestion outcome messaging rendered in [`loadMatches()`](../app.js:909)
- A new Predictions-page KPI panel in [`index.html`](../index.html) with supporting styles in [`styles.css`](../styles.css)
- No gameplay logic changes to user prediction scoring, payout calculation, leaderboard aggregation, or pool behavior in [`app.js`](../app.js)

This document reflects the version 1.14.0 implementation baseline.