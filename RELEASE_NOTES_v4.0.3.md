# Release Notes — v4.0.3

## Fix: Chat Messages Not Visible to Other Users

**Release date:** 12 July 2026

---

### What was wrong

A user could type a message and see it appear for themselves, but **other users could not see it**. The message appeared to send but never reached anyone else.

**Root cause — missing Firebase Database Rules:**

The Firebase Realtime Database security rules only covered `users`, `pools`, `predictions`, and `adminNotifications`. The `globalChat` and `poolChat` paths had **no rules at all**, which means Firebase defaults them to **denied** — all reads and writes were silently blocked.

When a second user subscribed to `globalChat`, Firebase rejected the subscription with a permission error. Because the error was caught silently in the SDK, the listener never received any messages.

---

### What's fixed in v4.0.3

**1. Firebase rules updated** — `FIREBASE_SETUP.md` now contains the complete rules:

```json
{
  "rules": {
    "users":              { ".read": true, ".write": true },
    "pools":              { ".read": true, ".write": true },
    "predictions":        { ".read": true, ".write": true },
    "matches":            { ".read": true, ".write": true },
    "adminNotifications": { ".read": true, ".write": true },
    "globalChat":         { ".read": true, ".write": true },
    "poolChat":           { ".read": true, ".write": true }
  }
}
```

**2. Message rendering bug fixed** — `loadGlobalChat()` and `loadPoolChat()` now clear the rendered-ID set and the message window on every fresh subscription. Previously, if a user navigated away and came back to the Chat tab, old message timestamps were still in the set and blocked the messages from re-rendering (blank chat).

---

### ⚠️ ACTION REQUIRED — Update Firebase Rules (one-time, 2 minutes)

**This must be done manually in the Firebase Console. Pushing the code alone is not enough.**

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Select project **football-prediction-game-ca155**
3. Click **"Realtime Database"** in the left menu
4. Click the **"Rules"** tab
5. Replace the entire rules JSON with:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true,
      "$userId": {
        ".validate": "newData.hasChildren(['id', 'nickname', 'email', 'pin', 'coins'])"
      }
    },
    "pools": {
      ".read": true,
      ".write": true
    },
    "predictions": {
      ".read": true,
      ".write": true
    },
    "matches": {
      ".read": true,
      ".write": true
    },
    "adminNotifications": {
      ".read": true,
      ".write": true
    },
    "globalChat": {
      ".read": true,
      ".write": true
    },
    "poolChat": {
      ".read": true,
      ".write": true
    }
  }
}
```

6. Click **"Publish"**
7. Done — chat will work immediately for all users (no app reload needed)

---

### No breaking changes

All existing matches, predictions, users, pools, emails, and activity logs are unaffected.
Version bumped: **v4.0.2 → v4.0.3**
