# Release Notes — v4.1.4

## Bronze final & Final Matches Added

**Release date:** 16 July 2026

---

### What's new

Added the 2 final-stage FIFA World Cup 2026 fixtures (IDs 103–104) to the match schedule.

| ID | Home | Away | Date | Time (local) | Stage | Venue |
|----|------|------|------|------|-------|-------|
| 103 | France | England | Sat 18 Jul 2026 | 23:00 | Bronze final | Miami Stadium (Miami) |
| 104 | Spain | Argentina | Sun 19 Jul 2026 | 21:00 | Final | New York/New Jersey Stadium (New Jersey) |

Both matches use the full **3-tab knockout prediction form** (90 min / Extra Time / Penalties).

---

### Technical details

- App version bumped: **v4.1.3 → v4.1.4**
- Stage labels used: `"Bronze final"` and `"Final"`
- Both matches set to `status: "upcoming"`
- `isKnockout()` extended to also match `'Bronze final'` — previously only `'Final'` was covered
- `'Final'` was already handled since v3.4.1 — no change needed for the Final itself
- Matches automatically synced to **all users** via Firebase version-based merge on next page load
- Backup created: `backups/backup_v4.1.3_20260716_122742/`

---

### Auto-update for all users

On their next page load each player will receive the new matches automatically:

```
🔄 Merging new matches for v4.1.4...
Current: 102 matches, New: 104 matches
✅ Matches merged: 104 total (preserved existing data)
```

No manual action is needed by any player.

---

### Scoring (as per all knockout rounds)

| Prediction element | Points |
|--------------------|--------|
| 90-min result (correct) | 3 pts |
| Extra-time result (correct) | +2 pts |
| Penalty shootout winner (correct) | +1 pt |

---

### No breaking changes

Existing matches, predictions, results, coins, chat, and pool data are unaffected.
Version bumped: **v4.1.3 → v4.1.4**
