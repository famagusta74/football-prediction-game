# GitHub Desktop Push Instructions — v4.0.2

## Fix: EmailJS "Recipients address is corrupted"

---

### Files changed

| File | Change |
|------|--------|
| `app.js` | v4.0.2; send both `email`+`to_email` and `name`+`to_name` fields |
| `index.html` | Version → v4.0.2; setup banner ref updated to v4.0.2 |
| `docs/index.html` | Version → v4.0.2 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version + v4.0.2 changelog |
| `README.md` | Version → v4.0.2 |
| `RELEASE_NOTES_v4.0.2.md` | New |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v4.0.2.md` | This file |
| `COMMIT_MESSAGE_v4.0.2.txt` | Commit message |
| `backups/backup_v4.0.1_20260712_090609/` | Backup of v4.0.1 |

---

### Steps

1. Open **GitHub Desktop** → repository **football-prediction-game** → branch **main**
2. Paste commit message from `COMMIT_MESSAGE_v4.0.2.txt` into Summary
3. Click **"Commit to main"**
4. Click **"Push origin"**

---

### After pushing — also check your EmailJS template

Go to **emailjs.com → Email Templates → your template** and make sure the **To email** field is set to `{{email}}` (or `{{to_email}}`). See `RELEASE_NOTES_v4.0.2.md` for the recommended template setup.
