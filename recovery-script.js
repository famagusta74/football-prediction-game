// Data Recovery Script for v2.0.7
// Run this in the browser console (F12) to check for and recover lost data

console.log('=== Football Prediction Game - Data Recovery Script ===');
console.log('Version: v2.0.7');
console.log('');

// Check if migration has already happened
const migrationDone = localStorage.getItem('firebaseMigrationDone');
console.log('Migration status:', migrationDone ? 'COMPLETED' : 'NOT STARTED');

// Check for matches in localStorage
const localMatches = localStorage.getItem('matches');
if (localMatches) {
    try {
        const matches = JSON.parse(localMatches);
        console.log(`✅ Found ${matches.length} matches in localStorage`);
        
        // Check for matches with results
        const matchesWithResults = matches.filter(m => m.homeScore !== undefined || m.awayScore !== undefined);
        console.log(`   - ${matchesWithResults.length} matches have results`);
        
        // Check for Bob predictions
        const matchesWithBobPredictions = matches.filter(m => m.bobPrediction);
        console.log(`   - ${matchesWithBobPredictions.length} matches have Bob predictions`);
        
        if (matchesWithResults.length > 0 || matchesWithBobPredictions.length > 0) {
            console.log('');
            console.log('⚠️ IMPORTANT: You have match data that needs to be preserved!');
            console.log('');
            console.log('Sample matches with data:');
            matches.slice(0, 3).forEach(m => {
                if (m.homeScore !== undefined || m.bobPrediction) {
                    console.log(`   Match ${m.id}: ${m.homeTeam} vs ${m.awayTeam}`);
                    if (m.homeScore !== undefined) {
                        console.log(`      Result: ${m.homeScore}-${m.awayScore}`);
                    }
                    if (m.bobPrediction) {
                        console.log(`      Bob's prediction: ${m.bobPrediction.homeScore}-${m.bobPrediction.awayScore}`);
                    }
                }
            });
        }
        
        // Export data for backup
        console.log('');
        console.log('=== BACKUP YOUR DATA ===');
        console.log('Copy and save this JSON:');
        console.log('');
        console.log(JSON.stringify(matches, null, 2));
        
    } catch (error) {
        console.error('❌ Error parsing matches:', error);
    }
} else {
    console.log('❌ No matches found in localStorage');
}

// Check other data
console.log('');
console.log('=== Other Data Status ===');
const users = localStorage.getItem('users');
const predictions = localStorage.getItem('predictions');
const pools = localStorage.getItem('pools');

console.log('Users:', users ? `${JSON.parse(users).length} found` : 'None');
console.log('Predictions:', predictions ? `${JSON.parse(predictions).length} found` : 'None');
console.log('Pools:', pools ? `${JSON.parse(pools).length} found` : 'None');

// Check Firebase
console.log('');
console.log('=== Firebase Status ===');
if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    console.log('✅ Firebase is initialized');
    console.log('To check Firebase data, run:');
    console.log('  firebase.database().ref("matches").once("value").then(s => console.log(s.val()))');
} else {
    console.log('❌ Firebase is not initialized');
}

console.log('');
console.log('=== Recovery Instructions ===');
console.log('1. If you see matches with data above, COPY THE JSON BACKUP');
console.log('2. Save it to a file for safekeeping');
console.log('3. Reload the page with the updated v2.0.7 code');
console.log('4. If data is lost, you can restore it manually or contact admin');
console.log('');
console.log('=== End of Recovery Script ===');

// Made with Bob
