# Release Notes — v4.1.0

## Chat Unread Badge & User Activity Columns

**Release date:** 13 July 2026

---

### What's new

#### 1. Chat Unread Badge

When a user is logged in and a new message arrives in either the **Global Chat** or any **Pool Chat** they belong to, a red indicator appears — without the user needing to open the Chat tab.

| Location | Indicator |
|----------|-----------|
| Desktop — **💬 Chat** tab button | Red dot badge (`•`) appears next to the label |
| Mobile — **💬 Chat** bottom-nav button | Small red dot overlaid on the icon |

**Behaviour:**
- The badge appears as soon as a new message arrives from another user
- It clears immediately when the user opens the Chat tab
- Unread state is stored in `localStorage` — it survives a page reload
- Your own messages never trigger the badge

#### 2. Last Login & Last Prediction columns (Admin Users tab)

The admin **Users** table now has two new columns:

| Column | Source |
|--------|--------|
| **Last Login** | `user.lastLogin` — written on every successful login (was already tracked, now shown) |
| **Last Prediction** | `user.lastPrediction` — written when a standard or knockout prediction is saved |

Both columns display date + short time (e.g. `13/07/2026, 08:45`). Users with no prediction yet show `—`.

---

### Technical details

**[`app.js`](app.js)**
- `startChatUnreadWatcher()` — subscribes Firebase `limitToLast(1)` listeners on `globalChat` and each user pool on dashboard load; fires `markChatUnread()` when a new foreign message arrives
- `stopChatUnreadWatcher()` — cleans up listeners on logout / re-init
- `markChatUnread(channel)` / `clearChatUnread(channel)` — manage `chatUnreadChannels` list in `localStorage`
- `updateChatBadge()` — toggles `#chatUnreadBadge` (desktop) and `#chatMobileUnreadDot` (mobile)
- `setChatLastSeen(channel, ts)` — records when the user last viewed each channel
- `showTab('chat')` now calls `localStorage.removeItem('chatUnreadChannels')` + `updateChatBadge()` to clear all unread on tab open
- `switchChatTab(target)` calls `clearChatUnread()` + `setChatLastSeen()` when switching to a specific channel
- Standard prediction and knockout prediction both set `currentUser.lastPrediction = new Date().toISOString()`
- `loadUsersTab()` renders two new `<th>` / `<td>` columns: **Last Login** and **Last Prediction**

**[`index.html`](index.html)**
- `#chatMobileUnreadDot` span added inside the mobile Chat nav icon

**[`styles.css`](styles.css)**
- `.chat-mobile-unread-dot` — 8×8 px red circle, overlaid top-right of the chat emoji

---

### Version bumped

**v4.0.3 → v4.1.0** — updated in `app.js`, `index.html`, `docs/index.html`, `README.md`, `docs/SOURCE_CODE_DOCUMENTATION.md`

---

### No breaking changes

All existing predictions, users, pools, chat messages, and email settings are unaffected.
Existing users will show `—` for Last Prediction until they place their next prediction.
