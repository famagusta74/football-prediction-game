# GitHub Desktop Push Instructions - v2.0.15

## Overview
This guide provides step-by-step instructions for committing and pushing v2.0.15 changes using GitHub Desktop.

## Changes Summary
- **Version**: v2.0.15 - All Match Times Corrected
- **Files Modified**: 3 files
- **Files Created**: 2 files
- **Total Changes**: 5 files

## Modified Files
1. [`app.js`](app.js) - Updated APP_VERSION and corrected all 12 match kickoff times (61-72)
2. [`index.html`](index.html) - Updated version header and badge to v2.0.15

## New Files
3. [`RELEASE_NOTES_v2.0.15.md`](RELEASE_NOTES_v2.0.15.md) - Detailed release notes
4. [`COMMIT_MESSAGE_v2.0.15.txt`](COMMIT_MESSAGE_v2.0.15.txt) - Commit message template
5. [`GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v2.0.15.md`](GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v2.0.15.md) - This file

## Step-by-Step Instructions

### Step 1: Open GitHub Desktop
1. Launch GitHub Desktop application
2. Ensure you're in the `football-prediction-game` repository
3. Verify you're on the `main` branch (top left)

### Step 2: Review Changes
1. You should see 5 changed files in the left sidebar:
   - ✏️ `app.js` (modified)
   - ✏️ `index.html` (modified)
   - ➕ `RELEASE_NOTES_v2.0.15.md` (new)
   - ➕ `COMMIT_MESSAGE_v2.0.15.txt` (new)
   - ➕ `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v2.0.15.md` (new)

2. Click on each file to review the changes:
   - **app.js**: Check that APP_VERSION is "v2.0.15" and all 12 match times are updated
   - **index.html**: Verify version header shows "v2.0.15 - All Match Times Corrected"

### Step 3: Stage All Changes
1. Ensure all 5 files have checkmarks (✓) next to them
2. If any file is unchecked, click the checkbox to stage it

### Step 4: Create Commit
1. In the bottom-left "Summary" field, enter:
   ```
   fix: Correct all 12 new match kickoff times (v2.0.15)
   ```

2. In the "Description" field, copy and paste from [`COMMIT_MESSAGE_v2.0.15.txt`](COMMIT_MESSAGE_v2.0.15.txt):
   ```
   Fixed incorrect kickoff times for matches 61-72 by verifying against FIFA official schedule.
   All times converted from Greek timezone (UTC+3) to UTC.

   Changes:
   - Match 61 (Mexico vs Korea Republic): 04:00 → 01:00 UTC (June 19)
   - Match 62 (Bosnia vs Qatar): Wrong date/time → 19:00 UTC (June 24)
   - Match 63 (USA vs Australia): Wrong date → 19:00 UTC (June 19)
   - Match 64 (Germany vs Côte d'Ivoire): Wrong date → 20:00 UTC (June 20)
   - Match 65 (Egypt vs New Zealand): 05:00 → 01:00 UTC (June 22)
   - Match 66 (Cabo Verde vs Uruguay): Wrong date → 22:00 UTC (June 21)
   - Match 67 (Iraq vs Norway): 20:00 → 21:00 UTC (June 22)
   - Match 68 (Algeria vs Jordan): Wrong date/time → 03:00 UTC (June 23)
   - Match 69 (Argentina vs Algeria): Already fixed in v2.0.14 ✓
   - Match 70 (Portugal vs Uzbekistan): Wrong date/time → 17:00 UTC (June 23)
   - Match 71 (Uzbekistan vs Colombia): 05:00 → 02:00 UTC (June 18)
   - Match 72 (Ghana vs Panama): Wrong date → 23:00 UTC (June 17)

   Also corrected venues for matches 62, 64, 66, 67, 68, 70 to match FIFA data.

   Files modified:
   - app.js: Updated APP_VERSION to v2.0.15 and corrected all 12 match times
   - index.html: Updated version display to v2.0.15
   - RELEASE_NOTES_v2.0.15.md: Detailed documentation of all changes

   Impact:
   ✅ All 72 First Stage matches now have accurate kickoff times
   ✅ Calendar view will display matches on correct dates
   ✅ Teams Flag view shows correct match schedules
   ✅ Historic data (17 completed matches) preserved
   ```

3. Click the blue **"Commit to main"** button

### Step 5: Push to GitHub
1. After committing, click the blue **"Push origin"** button at the top
2. Wait for the push to complete (you'll see a success message)

### Step 6: Verify on GitHub
1. Open your browser and go to: https://github.com/YOUR_USERNAME/football-prediction-game
2. Verify the commit appears in the commit history
3. Check that all 5 files are updated

### Step 7: Test the Application
1. Open your deployed application URL
2. **Hard refresh** the page (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
3. Verify the version shows "v2.0.15 - All Match Times Corrected"
4. Check Calendar view to confirm matches appear on correct dates
5. Check Teams Flag view for affected teams (Mexico, Bosnia, USA, Germany, Egypt, etc.)
6. Verify Match 69 (Argentina vs Algeria) still shows as completed with correct result

## Verification Checklist

After pushing, verify:
- ✅ Version badge shows "v2.0.15"
- ✅ Version header shows "v2.0.15 - All Match Times Corrected"
- ✅ All 12 matches (61-72) show correct kickoff times
- ✅ Calendar view displays matches on correct dates
- ✅ Teams Flag view shows accurate schedules
- ✅ Historic match results preserved (17 completed matches)
- ✅ No console errors in browser developer tools

## Troubleshooting

### If changes don't appear after refresh:
1. Clear browser cache completely
2. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try opening in incognito/private window
4. Check browser console for errors

### If GitHub Desktop shows merge conflicts:
1. Don't panic - this shouldn't happen on main branch
2. Contact support or resolve conflicts manually
3. Ensure you're on the correct branch

### If push fails:
1. Check your internet connection
2. Verify you're logged into GitHub Desktop
3. Try "Fetch origin" first, then push again
4. Check if you have write permissions to the repository

## Important Notes

- ⚠️ **Data Preservation**: This update uses the merge-based auto-update logic from v2.0.13, so existing match results and predictions will be preserved
- ⚠️ **Version-based Update**: Users will automatically get the corrected times on next app load
- ⚠️ **No Manual Intervention**: Users don't need to do anything - the app will auto-update
- ✅ **Historic Data Safe**: All 17 manually restored match results remain intact

## Next Steps After Push

1. Monitor for any user reports of issues
2. Verify all match times are correct in production
3. Check that Calendar view shows matches on correct dates
4. Confirm Teams Flag view displays accurate schedules
5. Ensure History tab still shows completed matches correctly

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review [`RELEASE_NOTES_v2.0.15.md`](RELEASE_NOTES_v2.0.15.md) for details
3. Verify all files were committed and pushed correctly
4. Test in different browsers if needed

---

**Version**: v2.0.15  
**Date**: June 17, 2026  
**Status**: Ready to Push ✅