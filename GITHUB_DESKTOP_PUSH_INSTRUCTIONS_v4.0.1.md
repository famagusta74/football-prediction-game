# GitHub Desktop Push Instructions — v4.0.1

## EmailJS Setup Banner & Email Diagnostics

---

### Files changed

| File | Change |
|------|--------|
| `app.js` | v4.0.1; `isEmailJSConfigured()` helper; `showEmailSetupBanner()`; `adminSendEmail()` SDK check + progress + detailed errors; `sendVerificationEmail()` guard updated |
| `index.html` | Setup banner HTML added to admin email panel; version → v4.0.1 |
| `styles.css` | `.email-setup-banner` styles added |
| `docs/index.html` | Version → v4.0.1 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version + v4.0.1 changelog |
| `README.md` | Version → v4.0.1 |
| `RELEASE_NOTES_v4.0.1.md` | New — full EmailJS setup guide |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v4.0.1.md` | This file |
| `COMMIT_MESSAGE_v4.0.1.txt` | Commit message |
| `backups/backup_v4.0.0_20260712_081142/` | Backup of v4.0.0 |

---

### Steps to push via GitHub Desktop (Mac)

1. Open **GitHub Desktop** on your Mac
2. Confirm repository = **football-prediction-game**, branch = **main**
3. All files above should be ticked in the **Changes** panel
4. Paste the commit message from `COMMIT_MESSAGE_v4.0.1.txt` into the **Summary** field
5. Click **"Commit to main"**
6. Click **"Push origin"**

---

### After pushing — activate email sending

Follow the **5-step EmailJS setup guide** in `RELEASE_NOTES_v4.0.1.md`.
Once done, come back and make a second commit to push `app.js` with your credentials.
