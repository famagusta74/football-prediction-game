# Debug Argentina vs Algeria Match

## Check in Browser Console

Open browser console (F12) and run these commands:

### 1. Check if match exists in matches array
```javascript
console.log('Total matches:', matches.length);
const argAlg = matches.find(m => m.id === 69);
console.log('Match 69 (Argentina vs Algeria):', argAlg);
```

### 2. Check match details
```javascript
if (argAlg) {
    console.log('Match found!');
    console.log('Home:', argAlg.homeTeam);
    console.log('Away:', argAlg.awayTeam);
    console.log('Kickoff:', argAlg.kickoff);
    console.log('Status:', argAlg.status);
    console.log('Date object:', new Date(argAlg.kickoff));
    console.log('Is future?', new Date(argAlg.kickoff) > new Date());
} else {
    console.log('Match 69 NOT FOUND in matches array!');
}
```

### 3. Check how matches are filtered
```javascript
// Check what the Predictions tab shows
const upcomingMatches = matches.filter(m => m.status === 'upcoming');
console.log('Upcoming matches:', upcomingMatches.length);
console.log('Match 69 in upcoming?', upcomingMatches.some(m => m.id === 69));

// Check date filtering
const now = new Date();
const futureMatches = matches.filter(m => new Date(m.kickoff) > now);
console.log('Future matches:', futureMatches.length);
console.log('Match 69 in future?', futureMatches.some(m => m.id === 69));
```

### 4. List all Argentina and Algeria matches
```javascript
const argMatches = matches.filter(m => 
    m.homeTeam === 'Argentina' || m.awayTeam === 'Argentina'
);
console.log('Argentina matches:', argMatches.length);
argMatches.forEach(m => {
    console.log(`ID ${m.id}: ${m.homeTeam} vs ${m.awayTeam} - ${m.kickoff}`);
});

const algMatches = matches.filter(m => 
    m.homeTeam === 'Algeria' || m.awayTeam === 'Algeria'
);
console.log('Algeria matches:', algMatches.length);
algMatches.forEach(m => {
    console.log(`ID ${m.id}: ${m.homeTeam} vs ${m.awayTeam} - ${m.kickoff}`);
});
```

## Expected Results

If everything is correct, you should see:
- Total matches: 72
- Match 69 found with Argentina vs Algeria
- Kickoff: 2026-06-17T20:00:00
- Status: upcoming
- Is future: true (if current time < 20:00)

## If Match is Missing

If Match 69 is NOT found, it means:
1. The auto-update didn't run properly
2. Firebase still has old data
3. Need to force a complete refresh

## If Match Exists But Not Visible

If Match 69 exists in the array but not visible in UI:
1. Check if date filtering is hiding it
2. Check if status filtering is hiding it
3. Check if there's a display bug in the UI

## Next Steps

After running these commands, share the console output so we can identify the exact issue.