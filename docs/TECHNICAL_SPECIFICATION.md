# Football Prediction Game - Technical Specification Document

## 1. System Architecture

### 1.1 Overview
The application follows a client-side architecture with cloud database synchronization:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML5      │  │    CSS3      │  │  JavaScript  │      │
│  │  (Structure) │  │   (Styling)  │  │   (Logic)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│                  ┌──────────────────┐                        │
│                  │  localStorage    │                        │
│                  │  (Fallback)      │                        │
│                  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Realtime Database                      │
│                  (Cloud Storage)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Pools   │  │Predictions│  │ Matches  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
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

```
football-prediction-game/
├── index.html              # Main HTML file
├── app.js                  # Application logic
├── styles.css              # Styling
├── firebase-config.js      # Firebase configuration
├── README.md              # Project overview
├── FIREBASE_SETUP.md      # Firebase setup guide
└── docs/
    ├── APPLICATION_DEFINITION.md
    ├── TECHNICAL_SPECIFICATION.md
    └── SOURCE_CODE_DOCUMENTATION.md
```

---

## 3. Core Modules

### 3.1 Authentication Module

**File:** `app.js` (Lines 399-503)

**Functions:**
- `login()` - Authenticates user with nickname and PIN
- `register()` - Creates new user account
- `logout()` - Clears session and returns to login
- `showLogin()` - Displays login screen
- `showRegister()` - Displays registration screen

**Flow:**
```javascript
User Input → Validation → Firebase/localStorage Check → 
Session Creation → Dashboard Display
```

**Security:**
- 4-digit PIN validation
- Case-insensitive nickname matching
- Duplicate email/nickname prevention
- Session stored in localStorage

### 3.2 Prediction Module

**File:** `app.js` (Lines 592-780)

**Functions:**
- `loadMatches()` - Displays match list
- `openPredictionModal()` - Opens prediction form
- `submitPrediction()` - Saves user prediction
- `calculatePayout()` - Computes winnings

**Validation Rules:**
```javascript
- Bet amount >= 10 coins
- Bet amount <= user's balance
- Scores must be non-negative integers
- Prediction before kickoff time
```

**Payout Calculation:**
```javascript
if (predicted.home === actual.home && predicted.away === actual.away) {
    return betAmount * 5; // Exact score
} else if (predictedResult === actualResult) {
    return betAmount * 2; // Correct result
} else {
    return 0; // Incorrect
}
```

### 3.3 Pool Management Module

**File:** `app.js` (Lines 781-1000)

**Functions:**
- `createPool()` - Creates new pool with unique code
- `joinPool()` - Adds user to existing pool
- `leavePool()` - Removes user from pool
- `generatePoolCode()` - Creates 6-character code
- `loadPools()` - Displays user's pools

**Pool Code Generation:**
```javascript
function generatePoolCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
```

### 3.4 Leaderboard Module

**File:** `app.js` (Lines 1001-1060)

**Functions:**
- `updateLeaderboard()` - Calculates and displays rankings
- `calculateAccuracy()` - Computes prediction accuracy
- `sortByCoins()` - Ranks users by coin balance

**Ranking Algorithm:**
```javascript
1. Filter users by pool membership (or all for global)
2. Calculate accuracy = (correctPredictions / totalPredictions) * 100
3. Sort by coins (descending)
4. Display top users with stats
```

### 3.5 Admin Module

**File:** `app.js` (Lines 1240-1371)

**Functions:**
- `loadAdminMatches()` - Lists all matches for admin
- `enterMatchResult()` - Records match final score
- `editMatchResult()` - Modifies existing result
- `processFinishedMatches()` - Distributes payouts
- `loadUsersTab()` - Displays all users

**Admin Check:**
```javascript
function isAdmin() {
    return currentUser && currentUser.nickname === "Menicos";
}
```

---

## 4. Firebase Integration

### 4.1 Configuration

**File:** `firebase-config.js`

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

```
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
│       └── lastLogin
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
│       ├── timestamp
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
// Get all users
const users = await FirebaseDB.getUsers();

// Get all pools
const pools = await FirebaseDB.getPools();

// Get all predictions
const predictions = await FirebaseDB.getPredictions();

// Get all matches
const matches = await FirebaseDB.getMatches();
```

**Write Operations:**
```javascript
// Save user
await FirebaseDB.saveUser(userObject);

// Save pool
await FirebaseDB.savePool(poolObject);

// Save prediction
await FirebaseDB.savePrediction(predictionObject);

// Save match
await FirebaseDB.saveMatch(matchObject);

// Save all matches
await FirebaseDB.saveAllMatches(matchesArray);
```

### 4.4 Data Migration

**One-time Migration from localStorage to Firebase:**

```javascript
async function migrateLocalStorageToFirebase() {
    // Get data from localStorage
    const localUsers = JSON.parse(localStorage.getItem('users')) || [];
    const localPools = JSON.parse(localStorage.getItem('pools')) || [];
    const localPredictions = JSON.parse(localStorage.getItem('predictions')) || [];
    
    // Migrate to Firebase
    for (const user of localUsers) {
        await FirebaseDB.saveUser(user);
    }
    for (const pool of localPools) {
        await FirebaseDB.savePool(pool);
    }
    for (const prediction of localPredictions) {
        await FirebaseDB.savePrediction(prediction);
    }
    
    // Mark migration complete
    localStorage.setItem('firebaseMigrationDone', 'true');
    
    // Clear old data
    localStorage.clear();
    localStorage.setItem('firebaseMigrationDone', 'true');
}
```

---

## 5. Data Flow Diagrams

### 5.1 User Registration Flow

```
┌─────────────┐
│ User clicks │
│"Create      │
│ Account"    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Enter nickname, │
│ email, PIN      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│ Validate input  │─────▶│ Show error   │
│ - Unique nick   │      │ if invalid   │
│ - Unique email  │      └──────────────┘
│ - PIN format    │
└──────┬──────────┘
       │ Valid
       ▼
┌─────────────────┐
│ Create user     │
│ object with     │
│ 1000 coins      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save to         │
│ Firebase        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Notify admin    │
│ (if Firebase)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Show success    │
│ & redirect to   │
│ login           │
└─────────────────┘
```

### 5.2 Prediction Submission Flow

```
┌─────────────┐
│ User clicks │
│ on match    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Open prediction │
│ modal           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Enter scores &  │
│ bet amount      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│ Validate:       │─────▶│ Show error   │
│ - Bet >= 10     │      │ if invalid   │
│ - Bet <= balance│      └──────────────┘
│ - Before kickoff│
└──────┬──────────┘
       │ Valid
       ▼
┌─────────────────┐
│ Deduct coins    │
│ from balance    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Create          │
│ prediction      │
│ object          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save to         │
│ Firebase        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Update user     │
│ coins in        │
│ Firebase        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Close modal &   │
│ refresh display │
└─────────────────┘
```

### 5.3 Admin Result Processing Flow

```
┌─────────────┐
│ Admin enters│
│ match result│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Update match    │
│ status &        │
│ finalScore      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save match to   │
│ Firebase        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Admin clicks    │
│"Process Results"│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ For each        │
│ finished match: │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Find all        │
│ predictions     │
│ for match       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ For each        │
│ prediction:     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Calculate       │
│ payout based    │
│ on accuracy     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Add payout to   │
│ user's coins    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Update user     │
│ statistics      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Mark prediction │
│ as processed    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save all        │
│ changes to      │
│ Firebase        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Show summary    │
│ message         │
└─────────────────┘
```

---

## 6. API Reference

### 6.1 Firebase Helper Functions

**FirebaseDB.saveUser(user)**
- **Purpose:** Save or update user in Firebase
- **Parameters:** user object
- **Returns:** Promise<boolean>
- **Example:**
```javascript
const user = {
    id: 123456,
    nickname: "Player1",
    email: "player@example.com",
    pin: "1234",
    coins: 1000
};
await FirebaseDB.saveUser(user);
```

**FirebaseDB.getUsers()**
- **Purpose:** Retrieve all users from Firebase
- **Parameters:** None
- **Returns:** Promise<Array<User>>
- **Example:**
```javascript
const users = await FirebaseDB.getUsers();
console.log(`Total users: ${users.length}`);
```

**FirebaseDB.savePool(pool)**
- **Purpose:** Save or update pool in Firebase
- **Parameters:** pool object
- **Returns:** Promise<boolean>

**FirebaseDB.getPools()**
- **Purpose:** Retrieve all pools from Firebase
- **Parameters:** None
- **Returns:** Promise<Array<Pool>>

**FirebaseDB.savePrediction(prediction)**
- **Purpose:** Save prediction in Firebase
- **Parameters:** prediction object
- **Returns:** Promise<boolean>

**FirebaseDB.getPredictions()**
- **Purpose:** Retrieve all predictions from Firebase
- **Parameters:** None
- **Returns:** Promise<Array<Prediction>>

**FirebaseDB.saveMatch(match)**
- **Purpose:** Save single match in Firebase
- **Parameters:** match object
- **Returns:** Promise<boolean>

**FirebaseDB.saveAllMatches(matches)**
- **Purpose:** Save all matches in Firebase
- **Parameters:** array of match objects
- **Returns:** Promise<boolean>

**FirebaseDB.getMatches()**
- **Purpose:** Retrieve all matches from Firebase
- **Parameters:** None
- **Returns:** Promise<Array<Match>>

### 6.2 Core Application Functions

**login()**
- **Purpose:** Authenticate user
- **Async:** Yes
- **Validation:** Nickname and PIN required
- **Side Effects:** Sets currentUser, updates localStorage

**register()**
- **Purpose:** Create new user account
- **Async:** Yes
- **Validation:** Unique nickname/email, valid PIN
- **Side Effects:** Adds user to database, notifies admin

**submitPrediction()**
- **Purpose:** Save user's match prediction
- **Async:** Yes
- **Validation:** Valid scores, sufficient coins
- **Side Effects:** Deducts coins, saves prediction

**processFinishedMatches()**
- **Purpose:** Calculate and distribute payouts
- **Async:** Yes
- **Admin Only:** Yes
- **Side Effects:** Updates user coins and stats

**createPool()**
- **Purpose:** Create new prediction pool
- **Async:** Yes
- **Returns:** Pool code and invite link
- **Side Effects:** Saves pool to database

---

## 7. Performance Optimization

### 7.1 Loading Strategy
- Lazy load match data
- Cache user session in localStorage
- Minimize Firebase reads with local state
- Batch Firebase writes when possible

### 7.2 Rendering Optimization
- Use document fragments for list rendering
- Minimize DOM manipulations
- CSS animations over JavaScript
- Debounce input handlers

### 7.3 Network Optimization
- Firebase SDK uses WebSocket for real-time updates
- Automatic retry on connection failure
- Offline support with localStorage fallback
- Compressed data transfer

---

## 8. Error Handling

### 8.1 Firebase Errors
```javascript
try {
    await FirebaseDB.saveUser(user);
} catch (error) {
    console.error('Firebase error:', error);
    // Fallback to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}
```

### 8.2 Validation Errors
```javascript
if (!nickname || !pin) {
    alert('Please enter both nickname and PIN');
    return;
}

if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    alert('PIN must be exactly 4 digits');
    return;
}
```

### 8.3 Network Errors
- Automatic fallback to localStorage
- User notification of offline mode
- Retry mechanism for failed operations
- Queue operations for when online

---

## 9. Testing Strategy

### 9.1 Manual Testing Checklist
- [ ] User registration with valid/invalid data
- [ ] Login with correct/incorrect credentials
- [ ] Make predictions before/after kickoff
- [ ] Create and join pools
- [ ] Admin enter/edit match results
- [ ] Process results and verify payouts
- [ ] Cross-device synchronization
- [ ] Offline mode functionality

### 9.2 Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### 9.3 Performance Testing
- [ ] Page load time < 2 seconds
- [ ] Prediction submission < 1 second
- [ ] Firebase sync < 3 seconds
- [ ] Smooth animations (60fps)

---

## 10. Deployment

### 10.1 GitHub Pages Setup
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Access via: `https://username.github.io/repository-name/`

### 10.2 Firebase Setup
1. Create Firebase project
2. Enable Realtime Database
3. Configure database rules
4. Copy configuration to firebase-config.js
5. Deploy and test

### 10.3 Environment Variables
- Firebase API key (public, safe to expose)
- Database URL
- Project ID
- No sensitive data in client code

---

## 11. Maintenance

### 11.1 Regular Tasks
- Monitor Firebase usage
- Review user feedback
- Update match data for new tournaments
- Backup database periodically
- Update documentation

### 11.2 Version Control
- Semantic versioning (MAJOR.MINOR.PATCH)
- Git tags for releases
- Changelog in commits
- Feature branches for development

### 11.3 Monitoring
- Firebase console for database metrics
- Browser console for client errors
- User reports for bugs
- Performance metrics

---

## 12. Security Considerations

### 12.1 Client-Side Security
- No sensitive data in client code
- PIN validation (not encryption)
- XSS prevention through input sanitization
- CSRF not applicable (no server-side sessions)

### 12.2 Firebase Security Rules
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 12.3 Data Validation
- Client-side validation for UX
- Server-side validation in Firebase rules
- Type checking for all inputs
- Range validation for numeric values

---

**Document Version:** 1.0  
**Created:** June 2026  
**Author:** IBM Bob AI Assistant  
**Last Updated:** June 2026