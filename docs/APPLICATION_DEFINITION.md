# Football Prediction Game - Application Definition Document

## 1. Executive Summary

The Football Prediction Game is a web-based application that allows users to predict match outcomes for the FIFA World Cup 2026 and compete with friends in private pools. Users earn coins based on prediction accuracy, track their activity history, and compare performance on leaderboards.

**Version:** 1.7.1
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

3. **Reward System**
   - 5x payout for exact score predictions
   - 2x payout for correct result (win/draw/loss)
   - Daily coin replenishment (100 coins, max 2000)
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
3. Clicks on a match before kickoff
4. Enters predicted home and away scores
5. Sets bet amount (minimum 10 coins)
6. Views potential payouts (5x exact, 2x result)
7. Submits prediction
8. Coins deducted from balance
9. Activity history records the deduction

### 4.3 Editing a Prediction
1. User opens a match that already has a prediction
2. System shows the existing prediction
3. User can modify the prediction before kickoff
4. Activity history records the edit
5. Match remains locked after kickoff

### 4.4 Creating a Pool
1. User clicks "Create New Pool"
2. Enters pool name and description
3. System generates unique pool code
4. Shareable invite link created
5. User can copy and share link
6. Friends join using code or link

### 4.5 Admin Processing Results
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

### 4.6 Viewing Activity History
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

### 5.2 Payout Rules
- **Exact Score Match:** Bet amount × 5
- **Correct Result Only:** Bet amount × 2
- **Incorrect Prediction:** Lose bet amount
- Payouts processed only by admin
- Each prediction processed only once unless admin edits the final result and resets processing

### 5.3 Coin Management
- Starting balance: 1000 coins
- Daily bonus: 100 coins (if logged in after 24 hours)
- Maximum balance: 2000 coins
- Coins are virtual (no real money value)
- Coin changes are recorded in activity history

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
      details: Object
    }
  ]
}
```

### 6.2 Match Object
```javascript
{
  id: Number,
  homeTeam: String,
  awayTeam: String,
  kickoff: String,
  status: String,
  league: String,
  stage: String,
  venue: String,
  finalScore: {
    home: Number,
    away: Number
  }
}
```

### 6.3 Prediction Object
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
  processed: Boolean,
  payout: Number
}
```

### 6.4 Pool Object
```javascript
{
  id: Number,
  name: String,
  description: String,
  code: String,
  adminId: Number,
  members: Array<Number>,
  createdAt: String
}
```

---

## 7. Technical Requirements

### 7.1 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 7.2 Internet Connection
- Required for Firebase synchronization
- Fallback to localStorage when offline
- Automatic sync when connection restored

### 7.3 Device Support
- Desktop computers
- Tablets
- Smartphones
- Responsive design (320px - 2560px width)

### 7.4 Performance
- Page load: < 2 seconds
- Prediction submission: < 1 second
- Firebase sync: < 3 seconds
- Supports 1000+ concurrent users

---

## 8. Security & Privacy

### 8.1 Authentication
- 4-digit PIN (not encrypted - suitable for casual use)
- No password recovery (by design)
- Session stored in localStorage
- No third-party authentication

### 8.2 Data Privacy
- Email addresses stored but not displayed publicly
- Nicknames are public within pools
- No personal data collection beyond registration
- No analytics or tracking

### 8.3 Firebase Security
- Database rules restrict write access
- Read access for authenticated users
- Admin operations validated in application logic
- No real-money financial data stored

---

## 9. Future Enhancements

### 9.1 Planned Features
- Email notifications for match results
- Push notifications for upcoming matches
- Achievement badges and trophies
- Historical statistics and graphs
- Export predictions to CSV
- Mobile app (iOS/Android)

### 9.2 Potential Improvements
- Password recovery system
- Two-factor authentication
- Real-time match updates
- Live chat in pools
- Prediction insights and tips
- Integration with sports APIs

---

## 10. Support & Maintenance

### 10.1 Known Limitations
- No password recovery mechanism
- Manual match result entry required
- No automated match data updates
- Limited to FIFA World Cup 2026 matches

### 10.2 Troubleshooting
- Clear browser cache if login issues occur
- Check internet connection for Firebase sync
- Contact admin for account issues
- Refresh page if data doesn't update

### 10.3 Contact
- Primary Admin: Menicos
- Built by: IBM Bob AI Assistant
- GitHub: [Repository URL]
- Documentation: Available in-app

---

## 11. Glossary

**Coins:** Virtual currency used for predictions  
**Pool:** Private group for competing with friends  
**Payout:** Coins earned from correct predictions  
**Exact Score:** Predicting both team scores correctly  
**Correct Result:** Predicting winner/draw correctly  
**Admin:** User with special privileges  
**Primary Admin:** Protected first admin account (Menicos)  
**Activity History:** Coin transaction log for users and admins  
**Firebase:** Cloud database for data synchronization  
**PIN:** 4-digit Personal Identification Number  

---

**Document Version:** 1.7.1
**Created:** June 2026
**Author:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Status:** Active
**Latest Features:**
- HTML activity history for users and admins
- Match locking after kickoff
- Multi-admin support with protected primary admin
- Daily bonus reduced to 100 coins
- Cross-device Firebase synchronization