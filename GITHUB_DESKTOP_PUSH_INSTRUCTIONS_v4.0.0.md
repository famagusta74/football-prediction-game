# GitHub Desktop Push Instructions — v4.0.0

## Chat System & Email Service

---

### Files changed in this release

| File | Change |
|------|--------|
| `app.js` | Version → v4.0.0; Chat + Email functions added; emailVerified field; checkVerifyToken hooked into init |
| `firebase-config.js` | Chat Firebase methods added (globalChat, poolChat) |
| `index.html` | EmailJS SDK; Chat tab in desktop + mobile nav; Chat tab content; Admin email panel; version → v4.0.0 |
| `styles.css` | Chat, email-verify notice, admin email panel, verified/unverified badge styles |
| `docs/index.html` | Version → v4.0.0 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version + v4.0.0 changelog |
| `README.md` | Version + description → v4.0.0 |
| `RELEASE_NOTES_v4.0.0.md` | New file |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v4.0.0.md` | This file |
| `COMMIT_MESSAGE_v4.0.0.txt` | Commit message |
| `backups/backup_v3.4.2_20260712_080111/` | Backup of previous version |

---

### Steps to push via GitHub Desktop (Mac)

1. **Open GitHub Desktop** on your Mac.
2. Confirm repository is **football-prediction-game**, branch is **main**.
3. All files above should appear ticked in the **Changes** panel.
4. In the **Summary** field paste the commit message from `COMMIT_MESSAGE_v4.0.0.txt`:
   ```
   v4.0.0: Add Chat system (global + pool) and Email service
   ```
5. In the **Description** field add:
   ```
   - Real-time Global Chat for all players (Firebase live subscription)
   - Pool Chat: private chat per pool (members only)
   - Chat tab added to desktop nav and mobile bottom nav
   - Admin email panel in Users tab (EmailJS integration)
   - Email verification: new users flagged unverified, can self-verify via email link
   - emailVerified field added to user objects
   - Firebase paths: globalChat/, poolChat/{poolId}/
   - EmailJS setup required — see RELEASE_NOTES_v4.0.0.md
   - Backup: backups/backup_v3.4.2_20260712_080111/
   ```
6. Click **"Commit to main"**.
7. Click **"Push origin"** (top toolbar).

---

### Next step after pushing

Follow the **EmailJS Setup** section in `RELEASE_NOTES_v4.0.0.md` to configure the email service (free, ~10 minutes). Until then, all chat features work normally — only the email buttons show a "not yet configured" notice.
