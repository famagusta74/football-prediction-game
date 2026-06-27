# GitHub Desktop Push Instructions — v3.0.0

## Files Changed
- `app.js` — Version bump to v3.0.0, auto-login after register, smart list view
- `index.html` — Version badges, mobile bottom nav HTML
- `styles.css` — Full mobile-first v3.0.0 CSS block appended
- `README.md` — v3.0.0 feature documentation
- `docs/APPLICATION_DEFINITION.md` — Version bump
- `docs/SOURCE_CODE_DOCUMENTATION.md` — Version bump & feature list

## New Files
- `RELEASE_NOTES_v3.0.0.md`
- `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v3.0.0.md`

---

## Steps in GitHub Desktop

1. **Open GitHub Desktop**
2. In the left panel you will see all changed files listed under "Changes"
3. Verify the files listed above appear in the changed files list
4. In the **Summary** box (bottom-left) enter:
   ```
   v3.0.0 - Mobile-First Redesign, Auto-Login, Smart List View
   ```
5. In the **Description** box enter:
   ```
   - Mobile bottom navigation bar (⚽ Predict / 🏆 Leaderboard / 👥 Pools / 📜 History / 🪙 Coins)
   - Auto-login after registration with welcome banner, redirects to predictions
   - Smart Prediction List View: starts from next upcoming match; past matches in collapsible history
   - Slim, touch-friendly match cards and bottom-sheet modals on mobile
   - Login screen optimised for small screens
   ```
6. Click **Commit to main**
7. Click **Push origin**
8. The live site will update automatically via GitHub Pages

---

## Verify After Push

1. Open the game URL on your phone browser
2. You should see version **v3.0.0** in the header
3. The bottom navigation bar should appear
4. Register a new test account — you should be auto-logged in and land on predictions
5. The Predictions tab should start from the next upcoming match (not match #1)
