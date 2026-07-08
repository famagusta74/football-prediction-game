# Release Notes — v3.4.1

## Knockout Form Enabled for Quarter-finals, Semi-finals & Final

**Release date:** 8 July 2026

---

### What's new

The `isKnockout()` function in [`app.js`](app.js) has been extended so that the full 3-tab prediction form (90 min / Extra Time / Penalties) is shown for **all knockout stages beyond the Round of 16**.

Previously `isKnockout()` only matched stages starting with `"Round of"`. Now it also covers:

| Stage | Was knockout? | Now |
|-------|--------------|-----|
| Round of 32 | ✅ | ✅ |
| Round of 16 | ✅ | ✅ |
| **Quarter-final** | ❌ | ✅ |
| **Semi-final** | ❌ | ✅ |
| **Final** | ❌ | ✅ |

### Impact

- All 4 Quarter-final matches (IDs 97–100) now present the full ET + penalty prediction tabs
- Bob's knockout suggestion (90 min, ET nudge, penalty call) is shown for these matches
- "Adopt Bob's prediction" button appears on Quarter-final match cards
- Semi-finals and Final are future-proofed at no extra cost

---

### Technical change

**[`app.js`](app.js) — [`isKnockout()`](app.js:3291):**
```js
// Before
function isKnockout(match) {
    return match && match.stage && match.stage.startsWith('Round of');
}

// After
function isKnockout(match) {
    if (!match || !match.stage) return false;
    return match.stage.startsWith('Round of') ||
           match.stage === 'Quarter-final' ||
           match.stage === 'Semi-final' ||
           match.stage === 'Final';
}
```

---

### No breaking changes

Existing predictions, results, coins, and pool data are unaffected.
Version bumped: **v3.4.0 → v3.4.1**
