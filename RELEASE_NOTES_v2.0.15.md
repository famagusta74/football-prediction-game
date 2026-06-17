# Release Notes - v2.0.15

## 🕐 All Match Kickoff Times Corrected

### Date
June 17, 2026

### Overview
Fixed incorrect kickoff times for all 12 newly added matches (IDs 61-72) by verifying against FIFA official schedule and converting from Greek timezone (UTC+3) to UTC.

### Changes Made

#### Match Time Corrections (All times converted from Greek UTC+3 to UTC)

1. **Match 61 - Mexico vs Korea Republic**
   - Old: `2026-06-19T04:00:00` (4:00 AM UTC)
   - New: `2026-06-19T01:00:00` (1:00 AM UTC)
   - FIFA Time: June 19, 04:00 Greek time

2. **Match 62 - Bosnia and Herzegovina vs Qatar**
   - Old: `2026-06-19T07:00:00` (Wrong date and time)
   - New: `2026-06-24T19:00:00` (7:00 PM UTC)
   - FIFA Time: June 24, 22:00 Greek time
   - Venue corrected: Seattle Stadium

3. **Match 63 - USA vs Australia**
   - Old: `2026-06-20T22:00:00` (Wrong date)
   - New: `2026-06-19T19:00:00` (7:00 PM UTC)
   - FIFA Time: June 19, 22:00 Greek time

4. **Match 64 - Germany vs Côte d'Ivoire**
   - Old: `2026-06-21T22:00:00` (Wrong date)
   - New: `2026-06-20T20:00:00` (8:00 PM UTC)
   - FIFA Time: June 20, 23:00 Greek time
   - Venue corrected: Toronto Stadium

5. **Match 65 - Egypt vs New Zealand**
   - Old: `2026-06-22T05:00:00` (5:00 AM UTC)
   - New: `2026-06-22T01:00:00` (1:00 AM UTC)
   - FIFA Time: June 22, 04:00 Greek time

6. **Match 66 - Cabo Verde vs Uruguay**
   - Old: `2026-06-22T22:00:00` (Wrong date)
   - New: `2026-06-21T22:00:00` (10:00 PM UTC)
   - FIFA Time: June 22, 01:00 Greek time
   - Venue corrected: Miami Stadium

7. **Match 67 - Iraq vs Norway**
   - Old: `2026-06-23T20:00:00` (8:00 PM UTC)
   - New: `2026-06-22T21:00:00` (9:00 PM UTC)
   - FIFA Time: June 23, 00:00 Greek time
   - Venue corrected: Philadelphia Stadium

8. **Match 68 - Algeria vs Jordan**
   - Old: `2026-06-24T20:00:00` (Wrong date and time)
   - New: `2026-06-23T03:00:00` (3:00 AM UTC)
   - FIFA Time: June 23, 06:00 Greek time
   - Venue corrected: San Francisco Bay Area Stadium

9. **Match 69 - Argentina vs Algeria**
   - Already fixed in v2.0.14
   - Current: `2026-06-17T07:00:00` (Correct)
   - Match already completed: Argentina 3-0 Algeria

10. **Match 70 - Portugal vs Uzbekistan**
    - Old: `2026-06-24T23:00:00` (Wrong date and time)
    - New: `2026-06-23T17:00:00` (5:00 PM UTC)
    - FIFA Time: June 23, 20:00 Greek time
    - Venue corrected: Houston Stadium

11. **Match 71 - Uzbekistan vs Colombia**
    - Old: `2026-06-18T05:00:00` (5:00 AM UTC)
    - New: `2026-06-18T02:00:00` (2:00 AM UTC)
    - FIFA Time: June 18, 05:00 Greek time

12. **Match 72 - Ghana vs Panama**
    - Old: `2026-06-18T02:00:00` (Wrong date)
    - New: `2026-06-17T23:00:00` (11:00 PM UTC)
    - FIFA Time: June 18, 02:00 Greek time

### Technical Details

- **Version Update**: APP_VERSION changed from "v2.0.14" to "v2.0.15"
- **Data Source**: FIFA official schedule (Greek timezone UTC+3)
- **Conversion Method**: Subtracted 3 hours from Greek time to get UTC
- **Files Modified**:
  - [`app.js`](app.js:2) - Updated APP_VERSION and all 12 match kickoff times
  - [`index.html`](index.html:21) - Updated version header and badge

### Impact

- ✅ All 72 First Stage matches now have correct kickoff times
- ✅ Dates corrected for matches that were showing wrong day
- ✅ Venues corrected where FIFA data showed different stadiums
- ✅ Users will see accurate match schedules in all views
- ✅ Calendar view will display matches on correct dates
- ✅ Teams Flag view will show matches at correct times

### Testing Recommendations

1. Clear browser cache and refresh application
2. Verify all 12 matches show correct times in Calendar view
3. Check Teams Flag view for affected teams
4. Confirm upcoming matches display in correct chronological order
5. Verify Match 69 (Argentina vs Algeria) still shows as completed

### Version Control

- **Commit**: Ready to commit
- **Branch**: main
- **Previous Version**: v2.0.14
- **Current Version**: v2.0.15

### Notes

- This fix completes the data restoration process started in v2.0.10
- All match data now verified against FIFA official schedule
- Historic match results (17 completed matches) preserved
- Auto-update mechanism will apply changes on next app load