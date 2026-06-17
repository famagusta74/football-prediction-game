const sampleMatches = [
    { id: 1, homeTeam: "Mexico", awayTeam: "South Africa", stage: "First Stage - Group A" },
    { id: 2, homeTeam: "Korea Republic", awayTeam: "Czechia", stage: "First Stage - Group A" },
    { id: 3, homeTeam: "Canada", awayTeam: "Bosnia and Herzegovina", stage: "First Stage - Group B" },
    { id: 4, homeTeam: "USA", awayTeam: "Paraguay", stage: "First Stage - Group D" },
    { id: 5, homeTeam: "Qatar", awayTeam: "Switzerland", stage: "First Stage - Group B" },
    { id: 6, homeTeam: "Brazil", awayTeam: "Morocco", stage: "First Stage - Group C" },
    { id: 7, homeTeam: "Haiti", awayTeam: "Scotland", stage: "First Stage - Group C" },
    { id: 8, homeTeam: "Australia", awayTeam: "Türkiye", stage: "First Stage - Group D" },
    { id: 9, homeTeam: "Germany", awayTeam: "Curaçao", stage: "First Stage - Group E" },
    { id: 10, homeTeam: "Netherlands", awayTeam: "Japan", stage: "First Stage - Group F" },
    { id: 11, homeTeam: "Côte d'Ivoire", awayTeam: "Ecuador", stage: "First Stage - Group E" },
    { id: 12, homeTeam: "Sweden", awayTeam: "Tunisia", stage: "First Stage - Group F" },
    { id: 13, homeTeam: "Spain", awayTeam: "Cabo Verde", stage: "First Stage - Group H" },
    { id: 14, homeTeam: "Belgium", awayTeam: "Egypt", stage: "First Stage - Group G" },
    { id: 15, homeTeam: "Saudi Arabia", awayTeam: "Uruguay", stage: "First Stage - Group H" },
    { id: 16, homeTeam: "IR Iran", awayTeam: "New Zealand", stage: "First Stage - Group G" },
    { id: 17, homeTeam: "France", awayTeam: "Senegal", stage: "First Stage - Group I" },
    { id: 18, homeTeam: "Austria", awayTeam: "Jordan", stage: "First Stage - Group J" },
    { id: 19, homeTeam: "Portugal", awayTeam: "Congo DR", stage: "First Stage - Group K" },
    { id: 20, homeTeam: "England", awayTeam: "Croatia", stage: "First Stage - Group L" },
    { id: 21, homeTeam: "Czechia", awayTeam: "South Africa", stage: "First Stage - Group A" },
    { id: 22, homeTeam: "Switzerland", awayTeam: "Bosnia and Herzegovina", stage: "First Stage - Group B" },
    { id: 23, homeTeam: "Canada", awayTeam: "Qatar", stage: "First Stage - Group B" },
    { id: 24, homeTeam: "Scotland", awayTeam: "Morocco", stage: "First Stage - Group C" },
    { id: 25, homeTeam: "Brazil", awayTeam: "Haiti", stage: "First Stage - Group C" },
    { id: 26, homeTeam: "Türkiye", awayTeam: "Paraguay", stage: "First Stage - Group D" },
    { id: 27, homeTeam: "Netherlands", awayTeam: "Sweden", stage: "First Stage - Group F" },
    { id: 28, homeTeam: "Ecuador", awayTeam: "Curaçao", stage: "First Stage - Group E" },
    { id: 29, homeTeam: "Tunisia", awayTeam: "Japan", stage: "First Stage - Group F" },
    { id: 30, homeTeam: "Spain", awayTeam: "Saudi Arabia", stage: "First Stage - Group H" },
    { id: 31, homeTeam: "Belgium", awayTeam: "IR Iran", stage: "First Stage - Group G" },
    { id: 32, homeTeam: "Argentina", awayTeam: "Austria", stage: "First Stage - Group J" },
    { id: 33, homeTeam: "France", awayTeam: "Iraq", stage: "First Stage - Group I" },
    { id: 34, homeTeam: "Norway", awayTeam: "Senegal", stage: "First Stage - Group I" },
    { id: 35, homeTeam: "England", awayTeam: "Ghana", stage: "First Stage - Group L" },
    { id: 36, homeTeam: "Panama", awayTeam: "Croatia", stage: "First Stage - Group L" },
    { id: 37, homeTeam: "Colombia", awayTeam: "Congo DR", stage: "First Stage - Group K" },
    { id: 38, homeTeam: "Switzerland", awayTeam: "Canada", stage: "First Stage - Group B" },
    { id: 39, homeTeam: "Scotland", awayTeam: "Brazil", stage: "First Stage - Group C" },
    { id: 40, homeTeam: "Morocco", awayTeam: "Haiti", stage: "First Stage - Group C" },
    { id: 41, homeTeam: "Czechia", awayTeam: "Mexico", stage: "First Stage - Group A" },
    { id: 42, homeTeam: "South Africa", awayTeam: "Korea Republic", stage: "First Stage - Group A" },
    { id: 43, homeTeam: "Curaçao", awayTeam: "Côte d'Ivoire", stage: "First Stage - Group E" },
    { id: 44, homeTeam: "Germany", awayTeam: "Ecuador", stage: "First Stage - Group E" },
    { id: 45, homeTeam: "Japan", awayTeam: "Sweden", stage: "First Stage - Group F" },
    { id: 46, homeTeam: "Tunisia", awayTeam: "Netherlands", stage: "First Stage - Group F" },
    { id: 47, homeTeam: "Türkiye", awayTeam: "USA", stage: "First Stage - Group D" },
    { id: 48, homeTeam: "Paraguay", awayTeam: "Australia", stage: "First Stage - Group D" },
    { id: 49, homeTeam: "Cabo Verde", awayTeam: "Saudi Arabia", stage: "First Stage - Group H" },
    { id: 50, homeTeam: "Uruguay", awayTeam: "Spain", stage: "First Stage - Group H" },
    { id: 51, homeTeam: "Egypt", awayTeam: "IR Iran", stage: "First Stage - Group G" },
    { id: 52, homeTeam: "New Zealand", awayTeam: "Belgium", stage: "First Stage - Group G" },
    { id: 53, homeTeam: "Croatia", awayTeam: "Ghana", stage: "First Stage - Group L" },
    { id: 54, homeTeam: "Colombia", awayTeam: "Portugal", stage: "First Stage - Group K" },
    { id: 55, homeTeam: "Congo DR", awayTeam: "Uzbekistan", stage: "First Stage - Group K" },
    { id: 56, homeTeam: "Algeria", awayTeam: "Austria", stage: "First Stage - Group J" },
    { id: 57, homeTeam: "Jordan", awayTeam: "Argentina", stage: "First Stage - Group J" },
    { id: 58, homeTeam: "Iraq", awayTeam: "Senegal", stage: "First Stage - Group I" },
    { id: 59, homeTeam: "Norway", awayTeam: "France", stage: "First Stage - Group I" },
    { id: 60, homeTeam: "Panama", awayTeam: "England", stage: "First Stage - Group L" }
];

// Count matches per team
const teamCounts = {};
sampleMatches.forEach(match => {
    teamCounts[match.homeTeam] = (teamCounts[match.homeTeam] || 0) + 1;
    teamCounts[match.awayTeam] = (teamCounts[match.awayTeam] || 0) + 1;
});

// Find teams with less than 3 matches
console.log("Teams with LESS than 3 matches:");
Object.entries(teamCounts)
    .filter(([team, count]) => count < 3)
    .sort((a, b) => a[1] - b[1])
    .forEach(([team, count]) => {
        console.log(`  ${team}: ${count} matches`);
    });

console.log("\nTeams with EXACTLY 3 matches:");
Object.entries(teamCounts)
    .filter(([team, count]) => count === 3)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([team, count]) => {
        console.log(`  ${team}: ${count} matches`);
    });

console.log("\nTotal unique teams:", Object.keys(teamCounts).length);
