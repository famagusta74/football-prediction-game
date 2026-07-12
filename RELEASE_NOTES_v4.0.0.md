# Release Notes — v4.0.0

## Chat System & Email Service

**Release date:** 12 July 2026

---

### What's new

#### 💬 Chat

| Feature | Details |
|---------|---------|
| **Global Chat** | A shared chat room visible to all logged-in players. Messages appear in real-time for everyone using Firebase live subscriptions. |
| **Pool Chat** | Each pool gets its own private chat room. Only members of that pool can read and write in it. |
| **Chat tab** | New "💬 Chat" tab added to the desktop nav and to the mobile bottom nav (replaces History on mobile; History still accessible from desktop). |
| **Chat UI** | WhatsApp-style bubbles — your messages are right-aligned (navy), others are left-aligned (white). Includes sender name, timestamp, and auto-scroll to latest message. |
| **Enter to send** | Pressing Enter sends a message as well as clicking the Send button. |
| **Real-time** | Firebase Realtime Database `child_added` subscription — no page refresh needed to see new messages. |
| **Fallback** | If Firebase is unavailable, chat is stored in localStorage (single-device only). |

#### 📧 Email Service

| Feature | Details |
|---------|---------|
| **Admin email panel** | In the **Users** tab (admin only), a new panel lets the admin send emails to all players at once or to a single player. |
| **Email fields** | To (all / individual), Subject, Message body. |
| **Email verification** | New users and existing users without a verified email see a yellow notice in the Chat tab: "Your email is unverified". A "Send verification email →" button sends a link to their inbox. Clicking that link marks their account as verified in Firebase. |
| **Existing users** | Not forced to do anything — the notice is informational only. |
| **New users** | `emailVerified: false` is set on the user object at registration. |

---

### ⚙️ EmailJS Setup (Required before email features work)

EmailJS is a **free** browser-side email service (200 emails/month free). No server needed.

**Steps:**

1. Go to **[https://www.emailjs.com](https://www.emailjs.com)** and create a free account.
2. Click **"Add New Service"** → choose Gmail (or your preferred provider) → connect your email account → note the **Service ID**.
3. Click **"Email Templates"** → **"Create New Template"** → set up the template with these variables:
   ```
   To:      {{to_email}}
   Subject: {{subject}}
   Body:
   Hi {{to_name}},

   {{message}}
   ```
   Note the **Template ID**.
4. Click your account name (top right) → **"API Keys"** → copy the **Public Key**.
5. Open **`app.js`** and replace the three placeholder values near the bottom of the file:
   ```js
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
   ```
6. Save, commit, and push via GitHub Desktop.

Until these values are replaced, the email buttons show a clear "not yet configured" alert so nothing breaks.

---

### Firebase paths added

| Path | Purpose |
|------|---------|
| `globalChat/{msgId}` | Global chat messages |
| `poolChat/{poolId}/{msgId}` | Pool-specific chat messages |

No existing data paths were modified.

---

### Technical details

- App version bumped: **v3.4.2 → v4.0.0**
- New functions in `app.js`: `initChatTab`, `switchChatTab`, `loadGlobalChat`, `sendGlobalChat`, `loadPoolChat`, `sendPoolChat`, `appendChatBubble`, `escapeHtml`, `showEmailVerifyNotice`, `sendVerificationEmail`, `checkVerifyToken`, `populateEmailRecipientDropdown`, `adminSendEmail`
- New Firebase methods in `firebase-config.js`: `sendGlobalChatMessage`, `getGlobalChatMessages`, `subscribeGlobalChat`, `sendPoolChatMessage`, `getPoolChatMessages`, `subscribePoolChat`, `unsubscribeRef`
- `emailVerified: false` added to new user objects at registration
- `checkVerifyToken()` hooked into `init()` — handles email verification link clicks automatically
- `showEmailVerifyNotice()` called in `showDashboard()` and `initChatTab()`
- Backup created: `backups/backup_v3.4.2_20260712_080111/`

---

### No breaking changes

All existing matches, predictions, users, pools, coins, and activity logs are unaffected.
Version bumped: **v3.4.2 → v4.0.0**
