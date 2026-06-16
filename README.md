# ⚽ Football Prediction Game - FIFA World Cup 2026

A social football prediction game where friends compete by predicting FIFA World Cup 2026 match results using virtual coins, now with a clearer prediction-first interface, optional Bob match suggestions, a Bob-inspired blue palette, and stronger player-versus-pool competition messaging.

## 🎮 Features

### MVP Features Implemented:
- ✅ **User Authentication** - Nickname + 4-digit PIN login system
- ✅ **Virtual Coins Economy** - Start with 1000 coins, daily replenishment
- ✅ **Match Predictions** - Predict exact scores for FIFA World Cup 2026 matches
- ✅ **Private Pools** - Create and join private prediction pools with friends
- ✅ **Leaderboard** - Track player and pool rankings by prediction winnings
- ✅ **Scoring System**:
  - Exact score prediction: 5x payout
  - Correct result (winner/draw): 2x payout
  - Incorrect prediction: 0x payout

### 🆕 v2.0.0 New Features - Calendar & Team Flags Views:
- ✅ **Calendar View** - Browse matches by date with an interactive calendar
  - Click on any date to see all matches scheduled for that day
  - Visual indicators show which dates have matches
  - Today's date is highlighted for easy reference
  - Navigate between months to explore the full tournament schedule
  - Historical matches are displayed as read-only with predictions preserved
- ✅ **Team Flags View** - Browse matches by team with country flags
  - All participating teams displayed with their national flags
  - Click on any team to see all their matches
  - Search functionality to quickly find specific teams
  - Match count displayed for each team
  - Historical matches shown as read-only with predictions intact
- ✅ **Multiple View Options** - Switch between List, Calendar, and Team Flags views
  - List View: Traditional chronological match listing
  - Calendar View: Date-based match browsing
  - Team Flags View: Team-based match filtering
  - Seamless switching between views with preserved state

### FIFA World Cup 2026 Matches:
- **60 First Stage Matches** covering June 11-28, 2026
- All 12 groups (A through L) with complete fixtures
- Real matches from the upcoming tournament
- Includes teams like Mexico, USA, Canada, England, Brazil, Germany, Argentina, France, Spain, and more
- Group stage matches with venue information
- Country flag presentation on match cards for a stronger tournament feel

### Prediction Suggestions & Guided UX
- Bob-inspired blue visual palette influenced by [`bob.ibm.com`](https://bob.ibm.com/)
- New onboarding hero that explains exact score rewards, correct-result winnings, and pool competition
- Optional Bob suggestion shown on every match card and inside the prediction modal
- Suggestions provide a recommended score, likely result, and short rationale while leaving the final choice to the user
- Improved leaderboard and modal guidance without changing the underlying game logic

## 🚀 Quick Start

### Option 1: Open Locally
1. Simply open `index.html` in any modern web browser
2. No installation or setup required!

### Option 2: Deploy to GitHub Pages (Recommended for Sharing)

#### Step 1: Initialize Git Repository
```bash
cd football-prediction-game
git init
git add .
git commit -m "Initial commit: Football Prediction Game MVP"
```

#### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "+" → "New repository"
3. Name it: `football-prediction-game`
4. **Do NOT** initialize with README
5. Click "Create repository"

#### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/football-prediction-game.git
git branch -M main
git push -u origin main
```

#### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes for deployment

#### Step 5: Access Your Live App
Your app will be available at:
```
https://YOUR-USERNAME.github.io/football-prediction-game/
```

## 📱 How to Use

### 1. Create an Account
- Click "Create Account"
- Choose a unique nickname
- Enter your email
- Create a 4-digit PIN
- You start with 1000 coins!

### 2. Make Predictions
- Go to "Predictions" tab
- Click on any upcoming match
- Enter your predicted score
- Choose your bet amount (10-500 coins)
- Submit prediction

### 3. Create or Join Pools
- Go to "My Pools" tab
- **Create Pool**: Make a new pool and share the code with friends
- **Join Pool**: Enter a pool code to join an existing pool
- Compete with up to 40 friends per pool

### 4. Check Leaderboard
- Go to "Leaderboard" tab
- View global rankings or filter by pool
- See player winnings, pool winnings, and supporting stats

## 🎯 Game Rules

### Coins System
- Starting balance: 1000 coins
- Daily bonus: 500 coins (max 2000 total)
- Minimum bet: 10 coins
- Maximum bet: 500 coins
- You can run out of coins!

### Scoring
- **Exact Score** (e.g., predict 2-1, result is 2-1): Win 5x your bet
- **Correct Result** (e.g., predict 2-1, result is 3-2): Win 2x your bet
- **Wrong Prediction**: Lose your bet

### Predictions
- Must be submitted before kickoff
- Can be updated before kickoff
- Locked once match starts

## 📁 Project Structure

```
football-prediction-game/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── app.js             # Game logic and functionality
└── README.md          # This file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Styling with animations
- **Vanilla JavaScript** - Game logic
- **LocalStorage** - Data persistence

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with JavaScript enabled

### Data Storage
All data is stored locally in your browser using LocalStorage:
- User accounts
- Predictions
- Pools
- Leaderboard data

**Note**: Data is browser-specific. Clearing browser data will reset the game.

## 🎨 Features Breakdown

### Authentication System
- Unique nicknames (case-insensitive)
- 4-digit PIN security
- Email verification (stored locally)
- Session persistence

### Pool Management
- Create unlimited pools
- Join multiple pools
- 6-character pool codes
- Up to 40 members per pool
- Pool-specific leaderboards

### Match Data
- FIFA World Cup 2026 matches
- Real teams and venues
- Group stage information
- Match status tracking

## 🔮 Future Enhancements (Not in MVP)

- Backend API for real-time updates
- Live match scores integration
- Push notifications
- Mobile app (React Native)
- Real match results and automatic scoring
- Winning streaks bonuses
- Achievement system
- Social sharing features

## 📝 Notes

- This is a **social entertainment platform** with virtual currency only
- No real money involved
- No withdrawals possible
- For fun and friendly competition only

## 🤝 Contributing

This is an MVP (Minimum Viable Product). Feel free to fork and enhance!

## 📄 License

Free to use for personal and educational purposes.

---

**Enjoy predicting and may the best predictor win!** ⚽🏆

_Current release theme: v2.0.5 - Improved Past Matches Readability_