# Data Recovery Instructions - v2.0.7

## Issue Description
In versions v2.0.0 through v2.0.6, the Firebase migration process had a critical bug where **match data** (including match results and Bob's predictions) was not migrated from localStorage to Firebase. When the migration cleared localStorage, this data was lost.

## What Was Lost
- Match results (scores for finished matches)
- Bob's predictions for matches
- Any custom match data that was stored

## What Was NOT Lost
- User accounts and profiles
- User predictions
- Pools
- Coin balances and activity logs
- Admin notifications

## Recovery Options

### Option 1: Restore from Browser Cache (If Available)
If you haven't cleared your browser cache, there may be a backup:

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check localStorage for any backup keys
4. Look for keys like `matches_backup` or similar

### Option 2: Manual Data Re-entry
If you have records of match results:

1. Log in as admin
2. Go to the Matches tab
3. Manually enter the results for completed matches
4. Bob's predictions will need to be re-entered if you have records

### Option 3: Contact Admin
If you're not the admin, contact your game administrator to restore match data from their records.

## Prevention (v2.0.7 Fix)
Version v2.0.7 fixes this issue by:
- Adding matches to the migration process
- Preserving all match data including results and predictions
- Ensuring no data loss during future migrations

## For Developers
The fix adds this code to `migrateLocalStorageToFirebase()`:

```javascript
// Migrate matches (preserve results and Bob predictions)
if (localMatches.length > 0) {
    await FirebaseDB.saveAllMatches(localMatches);
    console.log(`Migrated ${localMatches.length} matches with results`);
}
```

## Important Notes
- If you haven't run the app since the data loss, your localStorage may still contain the data
- DO NOT clear your browser cache until you've verified your data is safe
- The migration only runs once (when `firebaseMigrationDone` flag is not set)
- If you've already migrated, you'll need to manually restore the data

## Verification Steps
After updating to v2.0.7:

1. Open browser console (F12)
2. Check for migration logs
3. Verify match data is present in Firebase
4. Check that match results are displaying correctly

## Support
If you need help recovering your data, please:
1. Check the browser console for error messages
2. Export your Firebase data if possible
3. Contact the development team with details

---
**Version:** v2.0.7  
**Date:** 2026-06-16  
**Priority:** CRITICAL