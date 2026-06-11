# Football Prediction Game - Application Definition Document

## 1. Executive Summary

The Football Prediction Game is a web-based application that allows users to predict match outcomes for the FIFA World Cup 2026 and compete with friends in private pools. Users earn coins based on prediction accuracy, track their activity history, and compare performance on leaderboards.

**Version:** 1.15.1
**Last Updated:** June 2026
**Built by:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Platform:** Web Application (HTML5, CSS3, JavaScript)
**Database:** Firebase Realtime Database

---

## 2. Application Overview

### 2.1 Purpose
Enable football fans to:
- Predict match scores for FIFA World Cup 2026
- Compete with friends in private prediction pools
- Earn virtual coins based on prediction accuracy
- Track performance through leaderboards, statistics, and activity history

### 2.2 Target Audience
- Football enthusiasts
- FIFA World Cup fans
- Social groups wanting friendly competition
- Users aged 13+ with internet access

### 2.3 Key Features
1. **User Management**
   - Account creation with nickname, email, and 4-digit PIN
   - Secure login system
   - Cross-device synchronization via Firebase

2. **Match Predictions**
   - Predict exact scores for upcoming matches
   - Place coin bets on predictions
   - View prediction history and results
   - Automatic prediction locking after kickoff
   - Visual distinction between predicted and unpredicted match cards based on saved user predictions

3. **Reward System**
   - 5x payout for exact score predictions
   - 2x payout for correct result (win/draw/loss)
   - Daily coin replenishment of 100 coins once per calendar day (first login of the day)
   - No maximum balance cap on daily bonus allocation
   - Daily thank-you notification when bonus coins are awarded
   - Starting balance: 1000 coins

4. **Private Pools**
   - Create custom prediction pools
   - Invite friends via shareable links
   - Pool-specific leaderboards
   - Global leaderboard for all users

5. **Activity History**
   - Users can view their own coin activity in the Activity tab
   - Admins can inspect any user's full coin history in HTML
   - Activity includes prediction deductions, edits, payouts, daily bonuses, and admin changes
   - Daily bonus entries are keyed per day to avoid duplicate records while preserving valid history
   - Daily bonus entries store the correct post-award balance for clearer audit visibility
   - Login refreshes the saved user record before rendering the dashboard so normal users immediately see the bonus entry

6. **Admin Features**
   - Match result management
   - User management dashboard
   - Result processing and payout distribution
   - New user notifications
   - Multi-admin support with Menicos as primary admin

---

## 3. User Roles

### 3.1 Regular User
**Capabilities:**
- Create account and login
- Make match predictions before kickoff
- Create and join pools
- View leaderboards
- Track personal statistics
- View personal activity history
- Receive a daily bonus notification when eligible

**Limitations:**
- Cannot enter match results
- Cannot view other users' details
- Cannot process payouts
- Cannot predict after kickoff

### 3.2 Admin User
**Additional Capabilities:**
- Access [`Matches`](../index.html) tab to enter/edit results
- Access [`Users`](../index.html) tab to view all users
- Process match results and distribute payouts
- View all pools
- Receive notifications for new user registrations
- View all user activity histories in HTML
- Remove admin access from other users

### 3.3 Primary Admin
The original primary admin remains Menicos.

**Additional Controls:**
- Protected permanent admin account
- Can promote regular users to admin
- Retains all standard admin capabilities

---

## 4. Core Workflows

### 4.1 New User Registration
1. User visits application
2. Clicks "Create Account"
3. Enters nickname, email, and 4-digit PIN
4. Confirms PIN
5. Account created with 1000 starting coins
6. Admin receives notification
7. User redirected to login

### 4.2 Making a Prediction
1. User logs in
2. Views upcoming matches
3. Uses match card colors to identify predicted versus still-open matches
4. System checks the current user's saved predictions before rendering each card
5. Clicks on a match before kickoff
6. Enters predicted home and away scores
7. Sets bet amount (minimum 10 coins)
8. Views potential payouts (5x exact, 2x result)
9. Submits prediction
10. Coins deducted from balance
11. Activity history records the deduction

### 4.3 Editing a Prediction
1. User opens a match that already has a prediction
2. System shows the existing prediction
3. User can modify the prediction before kickoff
4. Activity history records the edit
5. Match remains locked after kickoff

### 4.4 Daily Login Bonus
1. User logs in on a new calendar day
2. System awards 100 coins for the first login of that day
3. No maximum balance cap blocks the daily allocation
4. A daily bonus activity entry is recorded once for that calendar day
5. The activity entry stores the correct balance after the award
6. The saved user record is reloaded before the dashboard is rendered
7. The user receives a thank-you notification showing the awarded amount

### 4.5 Creating a Pool
1. User clicks "Create New Pool"
2. Enters pool name and description
3. System generates unique pool code
4. Shareable invite link created
5. User can copy and share link
6. Friends join using code or link

### 4.6 Admin Processing Results
1. Admin logs in
2. Navigates to "Matches" tab
3. Clicks "Enter Result" for completed match
4. Enters final scores
5. Result saved to Firebase
6. Clicks "Process Results" button in header
7. System calculates all payouts
8. Coins distributed to users
9. Statistics updated
10. Predictions marked as processed
11. Activity history records payouts

### 4.7 Viewing Activity History
1. User opens the "Activity" tab
2. System shows balance summary and transaction history
3. Entries include timestamps, amounts, balances, and match context when available

For admins:
1. Admin opens the "Users" tab
2. Clicks "View Activity" for a selected user
3. Full HTML activity history appears inside the admin area

---

## 5. Business Rules

### 5.1 Prediction Rules
- Predictions must be made before match kickoff time
- Minimum bet: 10 coins
- Maximum bet: 500 coins per prediction
- Predictions are locked automatically once kickoff passes
- Locked matches remain frozen until admin enters the final result
- Users can edit predictions only before kickoff
- One active prediction record per match per user, with controlled edit behavior
- Match card color state is derived from whether the current user already has a saved prediction for that match

### 5.2 Payout Rules
- **Exact Score Match:** Bet amount × 5
- **Correct Result Only:** Bet amount × 2
- **Incorrect Prediction:** Lose bet amount
- Payouts processed only by admin
- Each prediction processed only once unless admin edits the final result and resets processing
- Leaderboard ranking is based on coins won from prediction payouts only, not starting coins or daily login bonuses

### 5.3 Coin Management
- Starting balance: 1000 coins
- Daily bonus: 100 coins on each eligible new day
- No maximum balance cap applies to the daily bonus
- Coins are virtual (no real money value)
- Coin changes are recorded in activity history
- Daily bonus activity uses a per-day key to prevent duplicate entries
- Daily bonus awards can trigger a browser notification or fallback alert
- Activity entries can store an explicit `balanceAfter` value for accurate audit rendering
- After saving the daily bonus, the app reloads the persisted user record so normal users see the updated balance and activity immediately

### 5.4 Pool Rules
- Pool creator becomes pool admin
- Maximum 40 members per pool
- Members can leave pools
- Pool codes are unique and permanent
- Pools cannot be deleted (only abandoned)

### 5.5 Admin Rules
- Menicos is the protected primary admin
- Only Menicos can promote a regular user to admin
- Admins can remove admin access from other users
- The primary admin cannot be demoted or deleted

---

## 6. Data Model

### 6.1 User Object
```javascript
{
  id: Number,
  nickname: String,
  email: String,
  pin: String,
  coins: Number,
  totalPredictions: Number,
  correctPredictions: Number,
  exactScores: Number,
  winStreak: Number,
  createdAt: String,
  lastLogin: String,
  isAdmin: Boolean,
  activityLog: [
    {
      id: Number,
      type: String,
      amount: Number,
      balanceAfter: Number,
      timestamp: String,
      details: {
        reason: String,
        matchId: Number,
        predictionScore: String,
        previousPredictionScore: String,
        previousBetAmount: Number,
        updatedBetAmount: Number,
        finalScore: String,
        changedBy: String,
        activityKey: String,
        balanceAfter: Number
      }
    }
  ]
}
```

### 6.2 Prediction Object
```javascript
{
  id: Number,
  userId: Number,
  matchId: Number,
  homeScore: Number,
  awayScore: Number,
  betAmount: Number,
  createdAt: String,
  modifiedAt: String,
  processed: Boolean
}
```

### 6.3 Match Object
```javascript
{
  id: Number,
  homeTeam: String,
  awayTeam: String,
  kickoff: String,
  venue: String,
  stage: String,
  status: String,
  finalScore: {
    home: Number,
    away: Number
  }
}
```

---

## 7. User Interface Summary

### 7.1 Main Screens
- Login screen
- Registration screen
- Dashboard
- Predictions tab
- History tab
- Pools tab
- Leaderboard tab
- Activity tab
- Admin Matches tab
- Admin Users tab

### 7.2 Prediction Screen Behavior
- A "Today's Games" section appears at the top when there are matches scheduled for the current day
- Today's matches are highlighted with special styling for easy identification
- All upcoming matches are shown as cards below the Today's Games section
- The login experience now uses a prediction-first football hero banner with World Cup styling and participating-country flags
- The onboarding copy explains exact score rewards, correct-result winnings, and player-versus-pool competition before login
- The overall palette follows a Bob-inspired blue visual direction
- Predicted matches use a stronger blue-highlighted palette
- Unpredicted matches use a lighter blue-grey palette
- Match cards display country flags beside team names for a more tournament-focused presentation
- Each match card now includes an optional Bob suggestion with a recommended score, likely result, and short rationale
- Locked matches remain unavailable after kickoff
- Existing predictions display score and bet details directly on the card
- The prediction modal includes the same optional Bob suggestion so users can review it before submitting
- The predictions tab includes a quick guide that explains how to choose matches, bet coins, and help both player and pool rankings
- The leaderboard ranks users by coins won from prediction payouts, with current balance shown as a secondary reference
- The leaderboard screen includes clearer explanation cards for both player and pool ranking rules
- A pool leaderboard also ranks pools by the total prediction winnings earned by all members in each pool

### 7.3 Activity Screen Behavior
- Users see a personal summary of balance, total in, total out, and entry count
- Users see detailed transaction history in HTML
- Admins can inspect the same style of history for any user

### 7.3 History Tab Behavior
- Shows all finished matches with final scores
- Displays user's predictions alongside actual results
- Clearly indicates wins (green) and losses (red) with coin amounts
- Matches are sorted by date (most recent first)
- Shows an empty state message when no matches have been completed yet
- Provides a complete record of past performance for review

- Daily bonus entries show the awarded amount and the correct resulting balance
- Normal users see the daily bonus entry immediately after login when a new eligible-day bonus is awarded

---

## 8. Release Management Rule

Every change to the application must follow this release process:
1. Update the version number everywhere it appears in the application and documentation
2. Update the documentation set to reflect the new behavior
3. Create a local git commit so the Mac GitHub Desktop workflow can push the release

For version 1.15.1, this rule has been applied to the application UI, documentation portal, and supporting documents.

---

## 9. Conclusion

The Football Prediction Game is a lightweight but feature-rich social prediction platform. Version 1.15.1 fixes the daily bonus logic to award coins once per calendar day (on first login of the day) rather than requiring a 24-hour interval between logins.