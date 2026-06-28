# Release Notes — v3.2.0

**Date:** June 2026
**Built by:** IBM Bob AI Assistant

---

## What's New

### 🥅 Knockout 3-Stage Prediction System

For every **Round of 32** (and future knockout) match, predictions now have three separate stages accessible via a tabbed form:

| Tab | Stage | When it matters |
|---|---|---|
| ⚽ 90 min | Normal time score | Always |
| ⏱ Extra Time | ET score | Only if 90-min is a draw |
| 🥅 Penalties | Who wins the shootout | Only if ET is also a draw |

### 🤖 Bob AI Covers All 3 Stages

- Bob's suggestion panel shows a score for 90 min, ET prediction, and a penalty winner
- **"🤖 Adopt Bob's Prediction"** button fills all tabs in one tap
- Tab states are dynamic — ET/Penalty tabs grey out with an explanatory note when not relevant

### 🎁 Knockout Bonus Payouts

- ET exact score: **+5× bet**
- ET correct result (home/draw/away): **+2× bet**
- Penalty winner correct: **+3× bet**
- Standard 90-min payout unchanged

### 🛠 Admin Improvements

- **Enter Result** for knockout matches automatically prompts for ET score and penalty winner if 90-min ends in a draw
- **Edit Result** pre-fills existing ET/penalty values and supports full correction
- Admin match list shows a **KO** badge next to knockout matches
- Finished knockout matches display `90 min: X-Y | ET: X-Y | Pen: Team` in admin list

---

## Files Changed

| File | Change |
|---|---|
| `app.js` | Version → v3.2.0; `enterMatchResult()`, `editMatchResult()`, `loadAdminMatches()` extended for knockout |
| `index.html` | Version strings → v3.2.0 (5 places) |
| `styles.css` | Added knockout CSS: `.knockout-explainer`, `.ko-tabs`, `.ko-tab`, `.ko-panel`, `.ko-panel-hint`, `.ko-panel-note`, `.ko-select`, `.adopt-bob-btn`, `.knockout-bob-grid`, `.knockout-bob-cell` |
| `README.md` | Updated to v3.2.0 |
| `docs/index.html` | Version badge → v3.2.0 |
| `docs/APPLICATION_DEFINITION.md` | Version → v3.2.0 |
| `docs/TECHNICAL_SPECIFICATION.md` | Version → v3.2.0 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version → v3.2.0, feature list updated |

---

## How to Push

1. Open **GitHub Desktop**
2. You will see all modified files listed
3. Enter commit message: `v3.2.0 — Knockout 3-stage predictions (ET + Penalties) + Admin result entry`
4. Click **Commit to main**
5. Click **Push origin**

All connected users will receive the update automatically on their next page load (Firebase + version-based match sync).
