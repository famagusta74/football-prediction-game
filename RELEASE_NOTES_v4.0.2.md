# Release Notes — v4.0.2

## Fix: EmailJS "Recipients address is corrupted" Error

**Release date:** 12 July 2026

---

### What was wrong

When sending an email via the admin panel, EmailJS returned:

> **"The recipients address is corrupted"**

**Root cause:** EmailJS requires the **"To email"** field in your template to be mapped to a template variable. When the game sent `to_email: user.email`, EmailJS looked for `{{to_email}}` in the template's **To** header. If the template's To field was set to the EmailJS default variable name `{{email}}` instead, EmailJS couldn't resolve who to deliver to — hence "corrupted address".

---

### What's fixed in v4.0.2

The send call now passes **both** the `email` and `to_email` field names (and both `name` and `to_name`) so it works regardless of which variable name your EmailJS template uses:

```js
// Before (v4.0.1) — only sent to_email
await emailjs.send(..., {
    to_email: user.email,
    to_name:  user.nickname,
    ...
});

// After (v4.0.2) — sends both names, template picks whichever it uses
await emailjs.send(..., {
    email:    user.email,      // ← EmailJS default template variable
    to_email: user.email,      // ← custom template variable (also accepted)
    name:     user.nickname,   // ← EmailJS default
    to_name:  user.nickname,   // ← custom name
    ...
});
```

---

### EmailJS Template — Recommended Setup

To make sure your template works, go to **emailjs.com → Email Templates → your template** and confirm the **To email** field is set to one of:

```
{{email}}
```
or
```
{{to_email}}
```

Both will now work with v4.0.2. The simplest setup uses `{{email}}` (EmailJS default).

**Recommended template fields:**

| Field | Value |
|-------|-------|
| To email | `{{email}}` |
| To name | `{{name}}` |
| Subject | `{{subject}}` |
| Content | `Hi {{name}},`<br><br>`{{message}}` |
| Reply To | `{{reply_to}}` |

---

### No breaking changes

All chat, predictions, matches, users, pools, and coins are unaffected.
Version bumped: **v4.0.1 → v4.0.2**
