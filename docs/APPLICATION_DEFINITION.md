# Football Prediction Game - Application Definition Document

## 1. Executive Summary

The Football Prediction Game is a web-based application that allows users to predict match outcomes for the FIFA World Cup 2026 and compete with friends in private pools. Users earn coins based on prediction accuracy and can track their performance on leaderboards.

**Version:** 1.6.2
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
- Track performance through leaderboards and statistics

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

3. **Reward System**
   - 5x payout for exact score predictions
   - 2x payout for correct result (win/draw/loss)
   - Daily coin replenishment (500 coins, max 2000)
   - Starting balance: 1000 coins

4. **Private Pools**
   - Create custom prediction pools
   - Invite friends via shareable links
   - Pool-specific leaderboards
   - Global leaderboard for all users

5. **Admin Features** (User: "Menicos")
   - Match result management
   - User management dashboard
   - Result processing and payout distribution
   - New user notifications

---

## 3. User Roles

### 3.1 Regular User
**Capabilities:**
- Create account and login
- Make match predictions
- Create and join pools
- View leaderboards
- Track personal statistics

**Limitations:**
- Cannot enter match results
- Cannot view other users' details
- Cannot process payouts

### 3.2 Admin User (Menicos)
**Additional Capabilities:**
- Access "Matches" tab to enter/edit results
- Access "Users" tab to view all users
- Process match results and distribute payouts
- View all pools (not just joined ones)
- Receive notifications for new user registrations

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
3. Clicks on a match
4. Enters predicted home and away scores
5. Sets bet amount (minimum 10 coins)
6. Views potential payouts (5x exact, 2x result)
7. Submits prediction
8. Coins deducted from balance

### 4.3 Creating a Pool
1. User clicks "Create New Pool"
2. Enters pool name and description
3. System generates unique pool code
4. Shareable invite link created
5. User can copy and share link
6. Friends join using code or link

### 4.4 Admin Processing Results
1. Admin logs in as "Menicos"
2. Navigates to "Matches" tab
3. Clicks "Enter Result" for completed match
4. Enters final scores
5. Result saved to Firebase
6. Clicks "Process Results" button in header
7. System calculates all payouts
8. Coins distributed to users
9. Statistics updated
10. Predictions marked as processed

---

## 5. Business Rules

### 5.1 Prediction Rules
- Predictions must be made before match kickoff time
- Minimum bet: 10 coins
- Maximum bet: User's current coin balance
- Predictions cannot be edited after submission
- One prediction per match per user

### 5.2 Payout Rules
- **Exact Score Match:** Bet amount × 5
- **Correct Result Only:** Bet amount × 2
- **Incorrect Prediction:** Lose bet amount
- Payouts processed only by admin
- Each prediction processed only once

### 5.3 Coin Management
- Starting balance: 1000 coins
- Daily bonus: 500 coins (if logged in after 24 hours)
- Maximum balance: 2000 coins
- Coins are virtual (no real money value)

### 5.4 Pool Rules
- Pool creator becomes pool admin
- Unlimited members per pool
- Members can leave pools
- Pool codes are unique and permanent
- Pools cannot be deleted (only abandoned)

---

## 6. Data Model

### 6.1 User Object
```javascript
{
  id: Number,              // Unique identifier
  nickname: String,        // Display name
  email: String,          // Contact email
  pin: String,            // 4-digit authentication
  coins: Number,          // Current balance
  totalPredictions: Number,
  correctPredictions: Number,
  exactScores: Number,
  winStreak: Number,
  createdAt: String,      // ISO timestamp
  lastLogin: String       // ISO timestamp
}
```

### 6.2 Match Object
```javascript
{
  id: Number,
  homeTeam: String,
  awayTeam: String,
  kickoff: String,        // ISO timestamp
  status: String,         // "upcoming" | "finished"
  league: String,
  stage: String,
  venue: String,
  finalScore: {           // Only when finished
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
  timestamp: String,
  processed: Boolean,
  payout: Number          // Set after processing
}
```

### 6.4 Pool Object
```javascript
{
  id: Number,
  name: String,
  description: String,
  code: String,           // 6-character unique code
  adminId: Number,
  members: Array<Number>, // User IDs
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
- Admin operations validated server-side
- No sensitive data stored

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
- Admin User: Menicos
- Built by: IBM Bob AI Assistant
- GitHub: [Repository URL]
- Documentation: Available in-app

---

## 11. Glossary

**Coins:** Virtual currency used for betting  
**Pool:** Private group for competing with friends  
**Payout:** Coins earned from correct predictions  
**Exact Score:** Predicting both team scores correctly  
**Correct Result:** Predicting winner/draw correctly  
**Admin:** User with special privileges (Menicos)  
**Firebase:** Cloud database for data synchronization  
**PIN:** 4-digit Personal Identification Number  

---

**Document Version:** 1.6.2
**Created:** June 2026
**Author:** IBM Bob AI Assistant (https://bob.ibm.com/)
**Status:** Active
**Latest Features:**
- Admin Matches tab for result management
- Comprehensive documentation portal
- IBM Bob branding with clickable links
- Cross-device Firebase synchronization
</content>
<line_count>322</line_count>