# GitHub Desktop Push Instructions — v4.1.4

## Bronze final & Final Matches Added

---

### Files changed in this release

| File | Change |
|------|--------|
| `app.js` | Version bumped to v4.1.4; 2 final-stage matches (IDs 103–104) added; `isKnockout()` extended for `'Bronze final'` |
| `index.html` | Version strings updated to v4.1.4 (header, login footer, dashboard badge) |
| `docs/index.html` | Version badge updated to v4.1.4 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version header and v4.1.4 changelog entry added |
| `README.md` | Version and description updated to v4.1.4 |
| `RELEASE_NOTES_v4.1.4.md` | New file — release notes for this version |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v4.1.4.md` | This file |
| `COMMIT_MESSAGE_v4.1.4.txt` | Commit message for this release |
| `backups/backup_v4.1.3_20260716_122742/` | Backup of previous version (app.js, index.html, styles.css, firebase-config.js) |

---

### Steps to push via GitHub Desktop (Mac)

1. **Open GitHub Desktop** on your Mac.
2. Confirm the repository is **football-prediction-game** and the branch is **main**.
3. In the **Changes** panel on the left you should see all files listed above ticked.
4. In the **Summary** field (bottom-left) paste the commit message from `COMMIT_MESSAGE_v4.1.4.txt`:
   ```
   v4.1.4: Add Bronze final (France vs England) & Final (Spain vs Argentina)
   ```
5. In the **Description** field add:
   ```
   - ID 103: France vs England, Sat 18 Jul 23:00, Miami Stadium (Bronze final)
   - ID 104: Spain vs Argentina, Sun 19 Jul 21:00, New York/New Jersey Stadium (Final)
   - Both matches use the full 3-tab knockout form (90 min / ET / Penalties)
   - isKnockout() extended to cover 'Bronze final'
   - All users auto-updated via Firebase version-based merge on next load
   - Backup: backups/backup_v4.1.3_20260716_122742/
   ```
6. Click **"Commit to main"**.
7. Click **"Push origin"** (top toolbar).
8. Verify the push succeeded — the button should revert to "Fetch origin".

---

### Verification

After pushing, any player who refreshes their browser will automatically receive both final-stage matches.
