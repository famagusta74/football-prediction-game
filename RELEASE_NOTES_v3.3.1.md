# Release Notes — v3.3.1
**Date:** July 2026  
**Built by:** IBM Bob AI Assistant

---

## Bug Fix

### Desktop Prediction Modal — Submit Button Cut Off
The knockout prediction popup was taller than the screen on desktop, making the **Submit Knockout Prediction** button unreachable without scrolling the entire page.

**Fix:** Added `max-height: 90vh` and `overflow-y: auto` to `.modal-content` in `styles.css`. The modal now caps at 90% of the viewport height and scrolls internally, so the submit button is always visible and reachable on all screen sizes.

---

## Files Changed

| File | Change |
|------|--------|
| `styles.css` | `.modal-content` — added `max-height: 90vh; overflow-y: auto` |
| `app.js` | Version → v3.3.1 |
| `index.html` | Version strings → v3.3.1 (5 places) |
| `README.md` | Version → v3.3.1 |
| `docs/index.html` | Version badge → v3.3.1 |
| `docs/APPLICATION_DEFINITION.md` | Version → v3.3.1 |
| `docs/TECHNICAL_SPECIFICATION.md` | Version → v3.3.1 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version → v3.3.1; v3.3.1 section added |
| `docs/GAME_SUMMARY.md` | Latest update summary updated |

---

## No Data Changes
- No match data was modified
- No Firebase schema changes
- No user data affected
