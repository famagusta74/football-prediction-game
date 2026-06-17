# Clear Firebase Cache - Force Data Reload

## The Problem
You're seeing v2.0.11 but not the new matches because:
1. ✅ Code is updated locally and on GitHub
2. ✅ Version shows v2.0.11
3. ❌ **Firebase has cached the OLD match data (60 matches)**
4. ❌ The app loads matches from Firebase, not from the code

## The Solution
Force the app to reload matches from the code by clearing Firebase data.

## Method 1: Use Browser Developer Tools (Recommended)

### Step 1: Open Developer Tools
- Press `F12` or right-click → Inspect

### Step 2: Go to Application Tab
- Click the "Application" tab (or "Storage" in Firefox)

### Step 3: Clear IndexedDB
1. Expand "IndexedDB" in the left sidebar
2. Right-click on your database
3. Select "Delete database"

### Step 4: Clear Local Storage
1. Expand "Local Storage" in the left sidebar
2. Click on your domain
3. Right-click → "Clear"

### Step 5: Clear Session Storage
1. Expand "Session Storage"
2. Click on your domain  
3. Right-click → "Clear"

### Step 6: Refresh
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- The app will reload matches from code (72 matches)

## Method 2: Run This in Console

Open browser console (F12 → Console tab) and run:

```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Clear IndexedDB
indexedDB.databases().then(dbs => {
    dbs.forEach(db => {
        console.log('Deleting database:', db.name);
        indexedDB.deleteDatabase(db.name);
    });
});

// Reload page
setTimeout(() => {
    location.reload(true);
}, 1000);
```

## Method 3: Use the Clear Cache HTML Tool

1. Open `clear-cache.html` in your browser
2. Click "Clear All Data"
3. Refresh the main app

## Method 4: Incognito/Private Mode (Testing)

1. Open a new Incognito/Private window
2. Open your app
3. Check if Argentina vs Algeria appears
4. If yes, the issue is cached data in normal mode

## Verification After Clearing

Run this in the console to verify:

```javascript
console.log('App Version:', APP_VERSION);
console.log('Total Matches:', matches.length);
console.log('Expected: v2.0.11 with 72 matches');

// Check for Argentina vs Algeria
const argAlg = matches.find(m => 
    (m.homeTeam === 'Argentina' && m.awayTeam === 'Algeria') ||
    (m.homeTeam === 'Algeria' && m.awayTeam === 'Argentina')
);
console.log('Argentina vs Algeria:', argAlg ? 'FOUND ✅' : 'MISSING ❌');
if (argAlg) {
    console.log('Match ID:', argAlg.id);
    console.log('Date:', argAlg.kickoff);
    console.log('Venue:', argAlg.venue);
}
```

## Expected Results

After clearing cache, you should see:
- ✅ App Version: v2.0.11
- ✅ Total Matches: 72
- ✅ Argentina vs Algeria: FOUND ✅
- ✅ Match ID: 69
- ✅ Date: 2026-06-17T20:00:00
- ✅ Venue: Kansas City Stadium (Kansas City)

## Why This Happens

The app uses this logic:
1. Check if matches exist in Firebase
2. If yes, load from Firebase (OLD DATA - 60 matches)
3. If no, load from code (NEW DATA - 72 matches)

Since Firebase has the old 60 matches, it never loads the new 72 matches from the code. Clearing Firebase forces it to reload from code.

## Alternative: Force Update in Code

If clearing cache doesn't work, we can add code to force update matches when version changes. But try clearing cache first!