# Release Notes — v3.0.0
**Date:** June 2026  
**Title:** Mobile-First Redesign

---

## What's New

### 1. Mobile Bottom Navigation
- A fixed bottom navigation bar appears on all screens ≤ 600 px wide
- Five quick-access tabs: ⚽ Predict | 🏆 Leaderboard | 👥 Pools | 📜 History | 🪙 Coins
- Active tab is highlighted in blue; safe-area inset respected for notched devices
- Desktop tabs are unchanged and remain visible on wider screens

### 2. Auto-Login After Registration
- After a player creates an account they are **automatically logged in**
- A welcome banner appears showing their nickname and starting coins (1,000 🪙)
- The banner includes a **"Start Predicting →"** button and auto-dismisses after 6 seconds
- No extra login step required

### 3. Smart Prediction List View
- The list now opens at the **next upcoming match** (sorted chronologically, earliest first)
- Today's matches are still highlighted at the very top if present
- All locked/past matches are grouped in a collapsible **📜 Match History (N)** section at the bottom — click to expand
- This keeps the screen focused on what the player needs to act on now

### 4. Slim Mobile UI
- Compact header on mobile: version badge, coins pill, and logout button only
- Match cards use tighter padding and smaller fonts on small screens
- Prediction modal slides up as a bottom-sheet on mobile
- Score input fields are larger touch targets
- View-toggle buttons scroll horizontally on very narrow screens
- Admin-only buttons (Process Results, Backup, Docs) are hidden on mobile (available on desktop)

### 5. Login Screen Mobile Optimisation
- Marketing copy columns are hidden on mobile to make the login form immediately visible
- Hero banner rescales gracefully to 26 px headline on small screens
- Auth form gets full-width layout

---

## Version
- `app.js`: `APP_VERSION = "v3.0.0"`
- `index.html`: all version badges updated to v3.0.0
- `README.md`, `docs/APPLICATION_DEFINITION.md`, `docs/SOURCE_CODE_DOCUMENTATION.md` updated

---

## Upgrade Notes
- All Firebase data is preserved — no migration required
- The version key change will trigger a standard match-merge check on next load (matches already in Firebase are preserved)
- All existing users, pools, predictions, and coin balances are unaffected
