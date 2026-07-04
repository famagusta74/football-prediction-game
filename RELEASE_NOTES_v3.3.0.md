# Release Notes — v3.3.0
**Date:** July 2026  
**Built by:** IBM Bob AI Assistant

---

## What's New

### 8 Round of 16 Fixtures Added (ids 89–96)
All times are **Cyprus / Greece local time (EEST = UTC+3)**.  
All matches support the full 3-stage knockout prediction system (90 min / Extra Time / Penalties).

| ID | Date | Time (CY/EEST) | Home | Away | Venue |
|----|------|----------------|------|------|-------|
| 89 | Sat 04 Jul | 20:00 | Canada | Morocco | Houston Stadium (Houston) |
| 90 | Sun 05 Jul | 00:00 | Paraguay | France | Philadelphia Stadium (Philadelphia) |
| 91 | Sun 05 Jul | 23:00 | Brazil | Norway | New York/New Jersey Stadium (New Jersey) |
| 92 | Mon 06 Jul | 03:00 | Mexico | England | Mexico City Stadium (Mexico City) |
| 93 | Mon 06 Jul | 22:00 | Portugal | Spain | Dallas Stadium (Dallas) |
| 94 | Tue 07 Jul | 03:00 | USA | Belgium | Seattle Stadium (Seattle) |
| 95 | Tue 07 Jul | 19:00 | Argentina | Egypt | Atlanta Stadium (Atlanta) |
| 96 | Tue 07 Jul | 23:00 | Switzerland | Colombia | BC Place Vancouver (Vancouver) |

---

## Notes
- All existing matches (ids 1–88) are **unchanged**
- New matches are automatically merged into Firebase on next load via version-based merge logic
- All users will see the new Round of 16 matches immediately after this version deploys
- No data migration or manual Firebase update required
- The 3-stage knockout prediction UI (90 min / ET / Penalties) already supports these matches — no UI changes needed

---

## Files Changed

| File | Change |
|------|--------|
| `app.js` | Version → v3.3.0; 8 Round of 16 matches added (ids 89–96) |
| `index.html` | Version strings → v3.3.0 (5 places) |
| `README.md` | Version → v3.3.0 |
| `docs/index.html` | Version badge → v3.3.0 |
| `docs/APPLICATION_DEFINITION.md` | Version → v3.3.0 |
| `docs/TECHNICAL_SPECIFICATION.md` | Version → v3.3.0 |
| `docs/SOURCE_CODE_DOCUMENTATION.md` | Version → v3.3.0; v3.3.0 section added |
| `docs/GAME_SUMMARY.md` | Latest update summary updated |

---

## How to Push

1. Open **GitHub Desktop**
2. You will see all modified files listed
3. Enter commit message: `v3.3.0 — Round of 16 matches added (04–07 Jul 2026, ids 89–96)`
4. Click **Commit to main**
5. Click **Push origin**

All connected users will receive the update automatically on their next page load (Firebase + version-based match sync).
