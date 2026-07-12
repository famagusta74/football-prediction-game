# GitHub Desktop Push Instructions — v4.0.3

## Fix: Chat Messages Not Visible to Other Users

---

### Files changed

| File | Change |
|------|--------|
| `app.js` | v4.0.3; `loadGlobalChat` and `loadPoolChat` clear rendered-IDs set on re-subscribe |
| `index.html` | Version → v4.0.3 |
| `docs/index.html` | Version → v4.0.3 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version + v4.0.3 changelog |
| `README.md` | Version → v4.0.3 |
| `FIREBASE_SETUP.md` | Complete rules including globalChat, poolChat, matches |
| `RELEASE_NOTES_v4.0.3.md` | New |
| `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v4.0.3.md` | This file |
| `COMMIT_MESSAGE_v4.0.3.txt` | Commit message |
| `backups/backup_v4.0.2_20260712_091619/` | Backup of v4.0.2 |

---

### Steps

1. Open **GitHub Desktop** → **football-prediction-game** → branch **main**
2. Paste commit message from `COMMIT_MESSAGE_v4.0.3.txt` into Summary
3. Click **"Commit to main"** then **"Push origin"**

---

### ⚠️ ALSO REQUIRED — Update Firebase Rules (2 minutes)

**Pushing the code alone does NOT fix the chat. You must also update the Firebase rules:**

1. Go to **[console.firebase.google.com](https://console.firebase.google.com/)**
2. Select project **football-prediction-game-ca155**
3. Click **Realtime Database** → **Rules** tab
4. Replace all rules with the JSON from `RELEASE_NOTES_v4.0.3.md`
5. Click **Publish**

Chat works immediately after publishing — no app reload needed.
