# 🚀 Restore Your Historic Data - Step by Step

## Your Firebase is Already Configured! ✅

Your Firebase project: **football-prediction-game-ca155**  
Database: **europe-west1**

## Quick Steps to Restore Your Data

### Option 1: Check if Data is Already in Firebase (1 minute)

1. **Open this file in your browser:**
   ```
   firebase-data-checker.html
   ```
   (Double-click the file)

2. **Click "🔄 Refresh Data"**

3. **Check the results:**
   - ✅ If you see matches with results → **Your data is safe in Firebase!**
   - ❌ If no matches or empty → Continue to Option 2

### Option 2: Check Browser Cache (2 minutes)

1. **Open this file in your browser:**
   ```
   restore-historic-data.html
   ```

2. **Click "🔎 Check Browser Cache"**

3. **If matches are found:**
   - Click **"📤 Migrate to Firebase"**
   - Wait for confirmation
   - Reload `index.html`
   - ✅ **Done! Your data is restored!**

### Option 3: Restore from Firebase Console (5 minutes)

If data exists in Firebase but not showing in the app:

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/football-prediction-game-ca155/database
   ```

2. **Check the "matches" node:**
   - Click on "matches" in the database tree
   - Look for match data with results

3. **If data exists there:**
   - Open `restore-historic-data.html`
   - Click "🔍 Check Current Data"
   - Click "💾 Restore to localStorage" (if available)
   - Reload `index.html`

### Option 4: Manual Export from Firebase (10 minutes)

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/football-prediction-game-ca155/database
   ```

2. **Export your data:**
   - Click the ⋮ menu next to your database name
   - Select "Export JSON"
   - Save the file

3. **Restore using the tool:**
   - Open `restore-historic-data.html`
   - Paste the JSON in Step 3
   - Click "💾 Restore from Backup"
   - Reload `index.html`

## Verify Your Data is Restored

After restoration, check:

1. ✅ Open `index.html`
2. ✅ Go to "Predictions" tab
3. ✅ Check if match results are showing
4. ✅ Check if Bob's predictions appear
5. ✅ Verify you can make new predictions

## If Data is Completely Lost

If no data exists anywhere:

### Check Firebase Database Directly:

1. **Go to:**
   ```
   https://console.firebase.google.com/project/football-prediction-game-ca155/database/football-prediction-game-ca155-default-rtdb/data
   ```

2. **Look for these nodes:**
   - `matches` - Should contain match data
   - `users` - Should contain user accounts
   - `predictions` - Should contain user predictions
   - `pools` - Should contain pool data

3. **If nodes are empty:**
   - The data was lost during migration
   - You'll need to manually re-enter match results
   - Use `manual-data-entry.html` as admin

### Manual Re-entry Process:

1. Open `index.html`
2. Log in as admin (nickname: "Menicos")
3. Go to "Matches" tab
4. Click "Edit" on each match
5. Enter the correct scores
6. Save each match

## Understanding What Happened

**The Bug:**
- Versions v2.0.0 through v2.0.6 had a migration bug
- Match data (results and Bob's predictions) wasn't migrated to Firebase
- When localStorage was cleared, this data was lost

**The Fix:**
- Version v2.0.7 fixes this permanently
- Matches are now included in the migration
- Future upgrades will preserve all data

## Database Rules Check

Your Firebase database rules should allow read/write access. To verify:

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/football-prediction-game-ca155/database/football-prediction-game-ca155-default-rtdb/rules
   ```

2. **Ensure rules include:**
   ```json
   {
     "rules": {
       "matches": {
         ".read": true,
         ".write": true
       },
       "users": {
         ".read": true,
         ".write": true
       },
       "predictions": {
         ".read": true,
         ".write": true
       },
       "pools": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

3. **Click "Publish" if you made changes**

## Quick Diagnostic Commands

Open browser console (F12) on `index.html` and run:

```javascript
// Check Firebase connection
console.log('Firebase initialized?', typeof firebase !== 'undefined' && firebase.apps.length > 0);

// Check localStorage
console.log('Migration done?', localStorage.getItem('firebaseMigrationDone'));
console.log('Matches in localStorage?', localStorage.getItem('matches') ? 'YES' : 'NO');

// Check Firebase data
firebase.database().ref('matches').once('value').then(s => {
    const matches = s.val() || [];
    console.log('Matches in Firebase:', Object.keys(matches).length);
});
```

## Need Help?

1. **Check browser console** (F12) for error messages
2. **Check Firebase Console** for data
3. **Try all options** in order (1 → 2 → 3 → 4)
4. **Export current data** before making changes

## Tools Available

| Tool | Purpose |
|------|---------|
| `restore-historic-data.html` | Main restoration tool |
| `firebase-data-checker.html` | View Firebase data |
| `data-recovery.html` | Check localStorage |
| `manual-data-entry.html` | Manual re-entry |

---

**Your Firebase Project:** football-prediction-game-ca155  
**Database Region:** europe-west1  
**Status:** ✅ Configured and Ready

**Start Here:** Open `restore-historic-data.html` in your browser!

---

Built with ❤️ by Bob AI Assistant