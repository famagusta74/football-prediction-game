# Release Notes — v3.4.2

## Semi-final Matches Added

**Release date:** 12 July 2026

---

### What's new

Added the 2 FIFA World Cup 2026 Semi-final fixtures (IDs 101–102) to the match schedule.

| ID | Home | Away | Date | Time (local) | Venue |
|----|------|------|------|------|-------|
| 101 | France | Spain | Tue 14 Jul 2026 | 22:00 | Dallas Stadium (Dallas) |
| 102 | England | Argentina | Wed 15 Jul 2026 | 22:00 | Atlanta Stadium (Atlanta) |

Both matches are knockout fixtures: the full **3-tab prediction form** (90 min / Extra Time / Penalties) is shown for all players.

---

### Technical details

- App version bumped: **v3.4.1 → v3.4.2**
- Stage label used: `"Semi-final"`
- Both matches set to `status: "upcoming"`
- `isKnockout()` already covered `Semi-final` from v3.4.1 — no logic change needed
- Matches are automatically synced to **all users** via the Firebase version-based merge on next page load
- Backup created: `backups/backup_v3.4.1_20260712_074431/`

---

### Auto-update for all users

On their next page load each user will receive the new matches automatically:

```
🔄 Merging new matches for v3.4.2...
Current: 100 matches, New: 102 matches
✅ Matches merged: 102 total (preserved existing data)
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

Existing matches, predictions, results, coins, and pool data are unaffected.
Version bumped: **v3.4.1 → v3.4.2**
