# Release Notes — v4.0.1

## EmailJS Setup Banner & Email Diagnostics

**Release date:** 12 July 2026

---

### What was wrong in v4.0.0

When you pressed **Send Email** as admin, nothing happened — no error, no alert, no feedback. The root cause was that **EmailJS had not been configured yet** (the three placeholder values in `app.js` were still `'YOUR_SERVICE_ID'` / `'YOUR_TEMPLATE_ID'` / `'YOUR_PUBLIC_KEY'`). In v4.0.0 the guard check ran but the `emailjs` SDK object wasn't available, so the function exited silently before showing the alert.

---

### What's fixed in v4.0.1

| Fix | Detail |
|-----|--------|
| **Setup banner** | A yellow warning banner now appears at the top of the email panel whenever EmailJS is not configured. It explains exactly what to do and links to emailjs.com. |
| **SDK missing check** | `adminSendEmail()` now checks `typeof emailjs === 'undefined'` first and shows a red error in the status bar immediately. |
| **Placeholder check** | A new `isEmailJSConfigured()` helper checks all three constants before attempting any send. |
| **Progress counter** | While sending to multiple players the status bar shows "⏳ Sent 2 / 5…" so you can see it's working. |
| **Detailed errors** | On failure the status bar shows the actual EmailJS error text, not a generic message. |

---

### ⚙️ EmailJS Setup — Complete Step-by-Step Guide

EmailJS is the **email sender**. It uses your own Gmail or Outlook account to deliver emails. It is completely free for up to 200 emails/month.

**Who sends the email?**
→ **Your own Gmail or Outlook address** (whichever you connect in step 2). Recipients see it as coming from you, not from a server.

---

#### Step 1 — Create a free EmailJS account
1. Go to **[https://www.emailjs.com](https://www.emailjs.com)**
2. Click **Sign Up** and create a free account.

#### Step 2 — Add an Email Service (connect your email)
1. In the EmailJS dashboard click **"Email Services"** → **"Add New Service"**
2. Choose **Gmail** (or Outlook / Yahoo etc.)
3. Click **"Connect Account"** and sign in with your Google account
4. Give it a name (e.g. `football_game`) → click **"Create Service"**
5. Note the **Service ID** (looks like `service_xxxxxxx`)

#### Step 3 — Create an Email Template
1. Click **"Email Templates"** → **"Create New Template"**
2. Set it up like this:

   | Field | Value |
   |-------|-------|
   | To email | `{{to_email}}` |
   | To name | `{{to_name}}` |
   | Subject | `{{subject}}` |
   | Content | `Hi {{to_name}},`<br><br>`{{message}}` |
   | Reply To | `{{reply_to}}` |

3. Click **"Save"**
4. Note the **Template ID** (looks like `template_xxxxxxx`)

#### Step 4 — Get your Public Key
1. Click your account name (top right) → **"Account"**
2. Under **"API Keys"** copy the **Public Key** (looks like `xxxxxxxxxxxxxxxxxxxx`)

#### Step 5 — Add the credentials to app.js
Open **`app.js`** and find these three lines near the bottom of the file (search for `YOUR_SERVICE_ID`):

```js
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace this
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace this
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace this
```

Replace with your actual values, for example:
```js
const EMAILJS_SERVICE_ID  = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY  = 'AbCdEfGhIjKlMnOpQrSt';
```

#### Step 6 — Commit and push
Save `app.js`, then use GitHub Desktop to commit and push. The yellow setup banner will disappear automatically and emails will work immediately for all users.

---

### No breaking changes

All chat, predictions, matches, users, pools, and coins are unaffected.
Version bumped: **v4.0.0 → v4.0.1**
