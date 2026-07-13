# Release Notes — v4.1.1

## Mobile Chat Overlay

**Release date:** 13 July 2026

---

### What's new

Tapping **💬 Chat** in the mobile bottom navigation now opens a **full-screen chat overlay** instead of switching away from the current tab. Close it any time with the **✕** button to return to exactly where you were.

#### Mobile chat overlay layout

```
┌──────────────────────────────┐
│  💬 Chat              ✕      │  ← dark header bar
├──────────────────────────────┤
│ 🌍 Global  🏆 Pool A  …      │  ← scrollable channel tabs
├──────────────────────────────┤
│                              │
│   [message bubbles]          │  ← fills all available height
│                              │     scrolls independently
│                              │
├──────────────────────────────┤
│  ┌─────────────────────┐  ➤  │  ← input + send, stays above
│  │ Type a message…     │     │    keyboard at all times
└──┴─────────────────────┴─────┘
```

#### Features

| Feature | Detail |
|---------|--------|
| Instant open | Tap Chat → overlay opens over any tab, no navigation away |
| Channel tabs | Horizontal scrollable row — 🌍 Global + one tab per pool you belong to |
| Real-time | Firebase live listener active while overlay is open |
| Keyboard-safe | Input bar always visible above the iOS/Android keyboard |
| Unread dot | Red dot on the Chat nav button clears as soon as the overlay opens |
| Close | Tap ✕ to dismiss; nav bar restores the previously active tab highlight |
| Verification notice | Shown inside the overlay if email is unverified (compact) |

---

### Technical details

**[`app.js`](app.js)**
- `openMobileChat()` — builds pool sub-tabs, shows overlay, starts Firebase listener, focuses input
- `closeMobileChat()` — hides overlay, unsubscribes listener, restores body scroll + nav state
- `switchMobileChat(target)` — switches channel, clears unread, resets message container, subscribes new listener
- `sendMobileChat()` — sends to Firebase or localStorage (fallback) on the active channel

**[`index.html`](index.html)**
- `#mobileChatOverlay` — full-screen flex container (fixed, z-index 2000)
- `#mobileChatSubtabs` — dynamically populated with pool tabs
- `#mobileChatMessages` — message area (fills all space between subtabs and input)
- `#mobileChatInput` / `.mobile-chat-send-btn` — input + round send button

**[`styles.css`](styles.css)**
- `.mobile-chat-overlay` — fixed full-screen, flex-column, safe-area-inset-bottom
- `.mobile-chat-header` — dark header bar with title + close button
- `.mobile-chat-subtabs` — horizontally scrollable, no scrollbar shown
- `.mobile-chat-messages-wrap` + `.mobile-chat-messages` — flex:1 + absolute-fill for true fill height
- `.mobile-chat-input-bar` — flex-shrink:0 pinned to bottom, keyboard-aware

---

### No breaking changes

Desktop chat tab is unchanged. All existing messages, pools, and user data are unaffected.
Version bumped: **v4.1.0 → v4.1.1**
