# GitHub Desktop Push Instructions — v3.4.2

## Semi-final Matches Added

---

### Files changed in this release

| File | Change |
|------|--------|
| `app.js` | Version bumped to v3.4.2; 2 Semi-final matches (IDs 101–102) added to `sampleMatches` |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version header and v3.4.2 changelog entry added |
| `RELEASE_NOTES_v3.4.2.md` | New file — release notes for this version |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v3.4.2.md` | This file |
| `COMMIT_MESSAGE_v3.4.2.txt` | Commit message for this release |
| `backups/backup_v3.4.1_20260712_074431/` | Backup of previous version (app.js, index.html, styles.css, firebase-config.js) |

---

### Steps to push via GitHub Desktop (Mac)

1. **Open GitHub Desktop** on your Mac.
2. Confirm the repository is **football-prediction-game** and the branch is **main**.
3. In the **Changes** panel on the left you should see all files listed above ticked.
4. In the **Summary** field (bottom-left) paste the commit message from `COMMIT_MESSAGE_v3.4.2.txt`:
   ```
   v3.4.2: Add Semi-final matches (France vs Spain & England vs Argentina)
   ```
5. In the **Description** field add:
   ```
   - ID 101: France vs Spain, Tue 14 Jul 22:00, Dallas Stadium
   - ID 102: England vs Argentina, Wed 15 Jul 22:00, Atlanta Stadium
   - Both matches use the 3-tab knockout form (90 min / ET / Penalties)
   - All users auto-updated via Firebase version-based merge on next load
   - Backup: backups/backup_v3.4.1_20260712_074431/
   ```
6. Click **"Commit to main"**.
7. Click **"Push origin"** (top toolbar).
8. Verify the push succeeded — the button should revert to "Fetch origin".

---

### Verification

After pushing, any player who refreshes their browser will automatically receive the 2 new Semi-final matches. No manual steps are needed on their side.
