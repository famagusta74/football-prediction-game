// App Version
const APP_VERSION = "v2.0.3"; // Show all matches in calendar view with selected date highlighted

// Data Storage (Firebase + localStorage fallback)
let currentUser = null;
let users = [];
let pools = [];
let predictions = [];
let matches = []; // Will be loaded from Firebase or use sampleMatches as default
let currentMatchId = null;
let useFirebase = false;
let selectedUserActivityId = null;
let activeTabName = 'predictions';

// Admin Configuration
const ADMIN_NICKNAME = "Menicos";
const DEFAULT_ADMIN_NICKNAMES = [ADMIN_NICKNAME];

// Initialize Firebase and load data
async function initializeApp() {
    console.log(`Football Prediction Game ${APP_VERSION}`);
    
    // Try to initialize Firebase
    useFirebase = initializeFirebase();
    
    if (useFirebase) {
        console.log('Using Firebase for data storage');
        
        // Check if migration is needed
        const migrationDone = localStorage.getItem('firebaseMigrationDone');
        
        if (!migrationDone) {
            console.log('First time with Firebase - migrating localStorage data...');
            await migrateLocalStorageToFirebase();
        }
        
        // Load data from Firebase
        await loadDataFromFirebase();
        
        // Initialize matches from Firebase or use defaults
        if (matches.length === 0) {
            matches = [...sampleMatches];
            await FirebaseDB.saveAllMatches(matches);
        }
    } else {
        console.log('Firebase not available, using localStorage');
        // Fallback to localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
        pools = JSON.parse(localStorage.getItem('pools')) || [];
        predictions = JSON.parse(localStorage.getItem('predictions')) || [];
    }
    
    console.log(`Loaded ${users.length} users, ${pools.length} pools, ${predictions.length} predictions`);
}

// Migrate all localStorage data to Firebase (one-time operation)
async function migrateLocalStorageToFirebase() {
    try {
        console.log('Starting migration from localStorage to Firebase...');
        
        // Get all data from localStorage
        const localUsers = JSON.parse(localStorage.getItem('users')) || [];
        const localPools = JSON.parse(localStorage.getItem('pools')) || [];
        const localPredictions = JSON.parse(localStorage.getItem('predictions')) || [];
        const localNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        
        console.log(`Found: ${localUsers.length} users, ${localPools.length} pools, ${localPredictions.length} predictions, ${localNotifications.length} notifications`);
        
        // Migrate users
        for (const user of localUsers) {
            await FirebaseDB.saveUser(user);
            console.log(`Migrated user: ${user.nickname}`);
        }
        
        // Migrate pools
        for (const pool of localPools) {
            await FirebaseDB.savePool(pool);
            console.log(`Migrated pool: ${pool.name}`);
        }
        
        // Migrate predictions
        for (const prediction of localPredictions) {
            await FirebaseDB.savePrediction(prediction);
        }
        console.log(`Migrated ${localPredictions.length} predictions`);
        
        // Migrate notifications
        for (const notification of localNotifications) {
            await FirebaseDB.saveNotification(notification);
        }
        console.log(`Migrated ${localNotifications.length} notifications`);
        
        // Mark migration as complete
        localStorage.setItem('firebaseMigrationDone', 'true');
        
        // Clear old localStorage data (keep only migration flag and currentUser)
        const currentUser = localStorage.getItem('currentUser');
        localStorage.clear();
        localStorage.setItem('firebaseMigrationDone', 'true');
        if (currentUser) {
            localStorage.setItem('currentUser', currentUser);
        }
        
        console.log('✅ Migration complete! localStorage cleared. All data now in Firebase.');
        alert('✅ Your data has been migrated to Firebase!\n\nYou can now access your account from any device.');
        
    } catch (error) {
        console.error('Migration error:', error);
        alert('⚠️ Migration encountered an error. Your localStorage data is still safe.');
    }
}

// Load all data from Firebase
async function loadDataFromFirebase() {
    try {
        users = await FirebaseDB.getUsers();
        pools = await FirebaseDB.getPools();
        predictions = await FirebaseDB.getPredictions();
        matches = await FirebaseDB.getMatches();
        
        // If no matches in Firebase, use sample matches
        if (matches.length === 0) {
            matches = [...sampleMatches];
        }

        if (normalizeAdminUsers()) {
            await saveUsers();
        }
    } catch (error) {
        console.error('Error loading data from Firebase:', error);
        // Fallback to localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
        pools = JSON.parse(localStorage.getItem('pools')) || [];
        predictions = JSON.parse(localStorage.getItem('predictions')) || [];
        matches = JSON.parse(localStorage.getItem('matches')) || [...sampleMatches];

        if (normalizeAdminUsers()) {
            await saveUsers();
        }
    }
}

// Check if current user is admin
function normalizeAdminUsers() {
    let changed = false;

    users.forEach(user => {
        if (typeof user.isAdmin !== 'boolean') {
            user.isAdmin = DEFAULT_ADMIN_NICKNAMES.includes(user.nickname);
            changed = true;
        }
    });

    return changed;
}

function isAdminUser(user) {
    return !!(user && user.isAdmin);
}

function isAdmin() {
    return isAdminUser(currentUser);
}

function hasMatchStarted(match) {
    return new Date(match.kickoff) <= new Date();
}

function isMatchLocked(match) {
    return hasMatchStarted(match) || match.status === 'finished';
}

function ensureUserActivityLog(user) {
    if (!Array.isArray(user.activityLog)) {
        user.activityLog = [];
    }
    return user.activityLog;
}

function addUserActivity(userId, type, amount, details = {}) {
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    const activityLog = ensureUserActivityLog(user);
    const activityKey = details.activityKey || null;

    if (activityKey && activityLog.some(entry => entry.details && entry.details.activityKey === activityKey)) {
        return false;
    }

    activityLog.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type,
        amount,
        balanceAfter: details.balanceAfter ?? user.coins,
        timestamp: new Date().toISOString(),
        details
    });

    if (activityLog.length > 200) {
        activityLog.length = 200;
    }

    if (currentUser && currentUser.id === userId) {
        currentUser.activityLog = activityLog;
    }

    return true;
}

function showDailyBonusNotification(message) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Football Prediction Game', {
            body: message,
            icon: 'bobimage.jpeg'
        });
        return;
    }

    alert(message);
}

async function requestNotificationPermission() {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') {
        return;
    }

    try {
        await Notification.requestPermission();
    } catch (error) {
        console.warn('Notification permission request failed:', error);
    }
}

function getActivityTypeLabel(type) {
    const labels = {
        daily_bonus: 'Daily Bonus',
        prediction_bet: 'Prediction Bet',
        prediction_edit: 'Prediction Edit',
        payout: 'Match Payout',
        admin_reset: 'Admin Coin Reset',
        admin_grant: 'Admin Granted',
        admin_remove: 'Admin Removed'
    };

    return labels[type] || type;
}

function getMatchLabel(matchId) {
    const match = matches.find(m => m.id === matchId);
    return match ? `${match.homeTeam} vs ${match.awayTeam}` : `Match #${matchId}`;
}

function buildActivitySummary(user) {
    const activityLog = ensureUserActivityLog(user);
    const summary = activityLog.reduce((acc, entry) => {
        if (entry.amount > 0) {
            acc.totalIn += entry.amount;
        } else if (entry.amount < 0) {
            acc.totalOut += Math.abs(entry.amount);
        }
        acc.entries += 1;
        return acc;
    }, { totalIn: 0, totalOut: 0, entries: 0 });

    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
            <div style="background: #f8f9fa; border-radius: 12px; padding: 16px; border: 1px solid #e9ecef;">
                <div style="font-size: 12px; color: #666; text-transform: uppercase;">Current Balance</div>
                <div style="font-size: 24px; font-weight: bold; color: #1e3c72;">${user.coins} 🪙</div>
            </div>
            <div style="background: #f8fff9; border-radius: 12px; padding: 16px; border: 1px solid #cfe8d6;">
                <div style="font-size: 12px; color: #666; text-transform: uppercase;">Total In</div>
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">+${summary.totalIn} 🪙</div>
            </div>
            <div style="background: #fff8f8; border-radius: 12px; padding: 16px; border: 1px solid #f1d0d0;">
                <div style="font-size: 12px; color: #666; text-transform: uppercase;">Total Out</div>
                <div style="font-size: 24px; font-weight: bold; color: #dc3545;">-${summary.totalOut} 🪙</div>
            </div>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 16px; border: 1px solid #e9ecef;">
                <div style="font-size: 12px; color: #666; text-transform: uppercase;">Entries</div>
                <div style="font-size: 24px; font-weight: bold; color: #343a40;">${summary.entries}</div>
            </div>
        </div>
    `;
}

function buildActivityEntriesHtml(user, emptyMessage) {
    const activityLog = ensureUserActivityLog(user);

    if (activityLog.length === 0) {
        return `
            <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; color: #666;">
                ${emptyMessage}
            </div>
        `;
    }

    return `
        <div style="display: grid; gap: 12px;">
            ${activityLog.map(entry => `
                <div style="padding: 14px; border: 1px solid #ddd; border-radius: 10px; background: #fff;">
                    <div style="display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 6px;">
                        <strong>${getActivityTypeLabel(entry.type)}</strong>
                        <span style="color: ${entry.amount >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">
                            ${entry.amount >= 0 ? '+' : ''}${entry.amount} 🪙
                        </span>
                    </div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 6px;">
                        ${new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
                        Balance after: <strong>${entry.balanceAfter} 🪙</strong>
                    </div>
                    <div style="font-size: 13px; color: #555;">
                        ${entry.details.reason || ''}
                        ${entry.details.matchId ? `<div>Match: ${getMatchLabel(entry.details.matchId)}</div>` : ''}
                        ${entry.details.previousPredictionScore ? `<div>Previous prediction: ${entry.details.previousPredictionScore}</div>` : ''}
                        ${entry.details.predictionScore ? `<div>Prediction: ${entry.details.predictionScore}</div>` : ''}
                        ${entry.details.previousBetAmount !== undefined ? `<div>Previous bet: ${entry.details.previousBetAmount} 🪙</div>` : ''}
                        ${entry.details.updatedBetAmount !== undefined ? `<div>Updated bet: ${entry.details.updatedBetAmount} 🪙</div>` : ''}
                        ${entry.details.finalScore ? `<div>Final score: ${entry.details.finalScore}</div>` : ''}
                        ${entry.details.changedBy ? `<div>Changed by: ${entry.details.changedBy}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCurrentUserActivity() {
    const summaryContainer = document.getElementById('myActivitySummary');
    const listContainer = document.getElementById('myActivityList');
    if (!summaryContainer || !listContainer || !currentUser) return;

    const latestCurrentUser = users.find(u => u.id === currentUser.id) || currentUser;
    currentUser = latestCurrentUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    summaryContainer.innerHTML = buildActivitySummary(currentUser);
    listContainer.innerHTML = buildActivityEntriesHtml(
        currentUser,
        `No coin activity recorded yet for <strong>${currentUser.nickname}</strong>.`
    );
}

function showUserActivity(userId) {
    selectedUserActivityId = userId;

    if (activeTabName !== 'users') {
        showTab('users');
    } else {
        renderAdminActivityViewer();
    }
}

function renderAdminActivityViewer() {
    const container = document.getElementById('adminActivityViewer');
    if (!container || !isAdmin()) return;

    if (!selectedUserActivityId) {
        container.innerHTML = `
            <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; color: #666;">
                Select <strong>View Activity</strong> for any user to inspect their full coin history here.
            </div>
        `;
        return;
    }

    const user = users.find(u => String(u.id) === String(selectedUserActivityId));
    if (!user) {
        container.innerHTML = '<p style="color: #666;">Selected user was not found.</p>';
        return;
    }

    container.innerHTML = `
        <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px;">Coin Activity: ${user.nickname}</h3>
            <p style="color: #666; margin-bottom: 20px;">Full HTML transaction history for this user.</p>
            <div style="margin-bottom: 20px;">
                ${buildActivitySummary(user)}
            </div>
            ${buildActivityEntriesHtml(user, `No coin activity recorded yet for <strong>${user.nickname}</strong>.`)}
        </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// FIFA World Cup 2026 Matches Data (from FIFA website)
const sampleMatches = [
    {
        id: 1,
        homeTeam: "Mexico",
        awayTeam: "South Africa",
        kickoff: "2026-06-11T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group A",
        venue: "Mexico City Stadium (Mexico City)"
    },
    {
        id: 2,
        homeTeam: "Korea Republic",
        awayTeam: "Czechia",
        kickoff: "2026-06-12T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group A",
        venue: "Guadalajara Stadium (Guadalajara)"
    },
    {
        id: 3,
        homeTeam: "Canada",
        awayTeam: "Bosnia and Herzegovina",
        kickoff: "2026-06-12T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "Toronto Stadium (Toronto)"
    },
    {
        id: 4,
        homeTeam: "USA",
        awayTeam: "Paraguay",
        kickoff: "2026-06-13T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 5,
        homeTeam: "Qatar",
        awayTeam: "Switzerland",
        kickoff: "2026-06-13T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "San Francisco Bay Area Stadium (San Francisco Bay Area)"
    },
    {
        id: 6,
        homeTeam: "Brazil",
        awayTeam: "Morocco",
        kickoff: "2026-06-14T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "New York/New Jersey Stadium (New Jersey)"
    },
    {
        id: 7,
        homeTeam: "Haiti",
        awayTeam: "Scotland",
        kickoff: "2026-06-14T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "Boston Stadium (Boston)"
    },
    {
        id: 8,
        homeTeam: "Australia",
        awayTeam: "Türkiye",
        kickoff: "2026-06-14T07:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "BC Place Vancouver (Vancouver)"
    },
    {
        id: 9,
        homeTeam: "Germany",
        awayTeam: "Curaçao",
        kickoff: "2026-06-14T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 10,
        homeTeam: "Netherlands",
        awayTeam: "Japan",
        kickoff: "2026-06-14T23:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Dallas Stadium (Dallas)"
    },
    {
        id: 11,
        homeTeam: "Côte d'Ivoire",
        awayTeam: "Ecuador",
        kickoff: "2026-06-15T02:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Philadelphia Stadium (Philadelphia)"
    },
    {
        id: 12,
        homeTeam: "Sweden",
        awayTeam: "Tunisia",
        kickoff: "2026-06-15T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Monterrey Stadium (Monterrey)"
    },
    {
        id: 13,
        homeTeam: "Spain",
        awayTeam: "Cabo Verde",
        kickoff: "2026-06-15T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Atlanta Stadium (Atlanta)"
    },
    {
        id: 14,
        homeTeam: "Belgium",
        awayTeam: "Egypt",
        kickoff: "2026-06-15T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Seattle Stadium (Seattle)"
    },
    {
        id: 15,
        homeTeam: "Saudi Arabia",
        awayTeam: "Uruguay",
        kickoff: "2026-06-16T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Miami Stadium (Miami)"
    },
    {
        id: 16,
        homeTeam: "IR Iran",
        awayTeam: "New Zealand",
        kickoff: "2026-06-16T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 17,
        homeTeam: "France",
        awayTeam: "Senegal",
        kickoff: "2026-06-16T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "New York/New Jersey Stadium (New Jersey)"
    },
    {
        id: 18,
        homeTeam: "Austria",
        awayTeam: "Jordan",
        kickoff: "2026-06-17T07:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group J",
        venue: "San Francisco Bay Area Stadium (San Francisco Bay Area)"
    },
    {
        id: 19,
        homeTeam: "Portugal",
        awayTeam: "Congo DR",
        kickoff: "2026-06-17T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group K",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 20,
        homeTeam: "England",
        awayTeam: "Croatia",
        kickoff: "2026-06-17T23:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group L",
        venue: "Dallas Stadium (Dallas)"
    },
    {
        id: 21,
        homeTeam: "Czechia",
        awayTeam: "South Africa",
        kickoff: "2026-06-18T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group A",
        venue: "Atlanta Stadium (Atlanta)"
    },
    {
        id: 22,
        homeTeam: "Switzerland",
        awayTeam: "Bosnia and Herzegovina",
        kickoff: "2026-06-18T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 23,
        homeTeam: "Canada",
        awayTeam: "Qatar",
        kickoff: "2026-06-19T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "BC Place Vancouver (Vancouver)"
    },
    {
        id: 24,
        homeTeam: "Scotland",
        awayTeam: "Morocco",
        kickoff: "2026-06-20T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "Boston Stadium (Boston)"
    },
    {
        id: 25,
        homeTeam: "Brazil",
        awayTeam: "Haiti",
        kickoff: "2026-06-20T03:30:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "Philadelphia Stadium (Philadelphia)"
    },
    {
        id: 26,
        homeTeam: "Türkiye",
        awayTeam: "Paraguay",
        kickoff: "2026-06-20T06:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "San Francisco Bay Area Stadium (San Francisco Bay Area)"
    },
    {
        id: 27,
        homeTeam: "Netherlands",
        awayTeam: "Sweden",
        kickoff: "2026-06-20T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 28,
        homeTeam: "Ecuador",
        awayTeam: "Curaçao",
        kickoff: "2026-06-21T03:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Kansas City Stadium (Kansas City)"
    },
    {
        id: 29,
        homeTeam: "Tunisia",
        awayTeam: "Japan",
        kickoff: "2026-06-21T07:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Monterrey Stadium (Monterrey)"
    },
    {
        id: 30,
        homeTeam: "Spain",
        awayTeam: "Saudi Arabia",
        kickoff: "2026-06-21T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Atlanta Stadium (Atlanta)"
    },
    {
        id: 31,
        homeTeam: "Belgium",
        awayTeam: "IR Iran",
        kickoff: "2026-06-21T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 32,
        homeTeam: "Argentina",
        awayTeam: "Austria",
        kickoff: "2026-06-22T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group J",
        venue: "Dallas Stadium (Dallas)"
    },
    {
        id: 33,
        homeTeam: "France",
        awayTeam: "Iraq",
        kickoff: "2026-06-23T00:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "Philadelphia Stadium (Philadelphia)"
    },
    {
        id: 34,
        homeTeam: "Norway",
        awayTeam: "Senegal",
        kickoff: "2026-06-23T03:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "New York/New Jersey Stadium (New Jersey)"
    },
    {
        id: 35,
        homeTeam: "England",
        awayTeam: "Ghana",
        kickoff: "2026-06-23T23:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group L",
        venue: "Boston Stadium (Boston)"
    },
    {
        id: 36,
        homeTeam: "Panama",
        awayTeam: "Croatia",
        kickoff: "2026-06-24T02:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group L",
        venue: "Toronto Stadium (Toronto)"
    },
    {
        id: 37,
        homeTeam: "Colombia",
        awayTeam: "Congo DR",
        kickoff: "2026-06-24T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group K",
        venue: "Guadalajara Stadium (Guadalajara)"
    },
    {
        id: 38,
        homeTeam: "Switzerland",
        awayTeam: "Canada",
        kickoff: "2026-06-24T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "BC Place Vancouver (Vancouver)"
    },
    {
        id: 39,
        homeTeam: "Scotland",
        awayTeam: "Brazil",
        kickoff: "2026-06-25T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "Miami Stadium (Miami)"
    },
    {
        id: 40,
        homeTeam: "Morocco",
        awayTeam: "Haiti",
        kickoff: "2026-06-25T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "Atlanta Stadium (Atlanta)"
    },
    {
        id: 41,
        homeTeam: "Czechia",
        awayTeam: "Mexico",
        kickoff: "2026-06-25T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group A",
        venue: "Mexico City Stadium (Mexico City)"
    },
    {
        id: 42,
        homeTeam: "South Africa",
        awayTeam: "Korea Republic",
        kickoff: "2026-06-25T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group A",
        venue: "Monterrey Stadium (Monterrey)"
    },
    {
        id: 43,
        homeTeam: "Curaçao",
        awayTeam: "Côte d'Ivoire",
        kickoff: "2026-06-25T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 44,
        homeTeam: "Germany",
        awayTeam: "Ecuador",
        kickoff: "2026-06-25T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Seattle Stadium (Seattle)"
    },
    {
        id: 45,
        homeTeam: "Japan",
        awayTeam: "Sweden",
        kickoff: "2026-06-26T02:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Dallas Stadium (Dallas)"
    },
    {
        id: 46,
        homeTeam: "Tunisia",
        awayTeam: "Netherlands",
        kickoff: "2026-06-26T02:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Kansas City Stadium (Kansas City)"
    },
    {
        id: 47,
        homeTeam: "Türkiye",
        awayTeam: "USA",
        kickoff: "2026-06-26T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 48,
        homeTeam: "Paraguay",
        awayTeam: "Australia",
        kickoff: "2026-06-26T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "San Francisco Bay Area Stadium (San Francisco Bay Area)"
    },
    {
        id: 49,
        homeTeam: "Cabo Verde",
        awayTeam: "Saudi Arabia",
        kickoff: "2026-06-27T03:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 50,
        homeTeam: "Uruguay",
        awayTeam: "Spain",
        kickoff: "2026-06-27T03:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Guadalajara Stadium (Guadalajara)"
    },
    {
        id: 51,
        homeTeam: "Egypt",
        awayTeam: "IR Iran",
        kickoff: "2026-06-27T06:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Seattle Stadium (Seattle)"
    },
    {
        id: 52,
        homeTeam: "New Zealand",
        awayTeam: "Belgium",
        kickoff: "2026-06-27T06:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Miami Stadium (Miami)"
    },
    {
        id: 53,
        homeTeam: "Croatia",
        awayTeam: "Ghana",
        kickoff: "2026-06-28T00:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group L",
        venue: "Philadelphia Stadium (Philadelphia)"
    },
    {
        id: 54,
        homeTeam: "Colombia",
        awayTeam: "Portugal",
        kickoff: "2026-06-28T02:30:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group K",
        venue: "Miami Stadium (Miami)"
    },
    {
        id: 55,
        homeTeam: "Congo DR",
        awayTeam: "Uzbekistan",
        kickoff: "2026-06-28T02:30:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group K",
        venue: "Atlanta Stadium (Atlanta)"
    },
    {
        id: 56,
        homeTeam: "Algeria",
        awayTeam: "Austria",
        kickoff: "2026-06-28T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group J",
        venue: "Kansas City Stadium (Kansas City)"
    },
    {
        id: 57,
        homeTeam: "Jordan",
        awayTeam: "Argentina",
        kickoff: "2026-06-28T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group J",
        venue: "New York/New Jersey Stadium (New Jersey)"
    },
    {
        id: 58,
        homeTeam: "Iraq",
        awayTeam: "Senegal",
        kickoff: "2026-06-28T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "Boston Stadium (Boston)"
    },
    {
        id: 59,
        homeTeam: "Norway",
        awayTeam: "France",
        kickoff: "2026-06-28T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "Toronto Stadium (Toronto)"
    },
    {
        id: 60,
        homeTeam: "Panama",
        awayTeam: "England",
        kickoff: "2026-06-28T23:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group L",
        venue: "Monterrey Stadium (Monterrey)"
    },
];

// Initialize app
async function init() {
    // Initialize Firebase and load data
    await initializeApp();
    
    const savedUser = localStorage.getItem('currentUser');
    
    // Check if there's a pool invite in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const poolCode = urlParams.get('pool');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
        
        // If there's a pool code in URL, try to join it
        if (poolCode) {
            autoJoinPool(poolCode);
        }
    } else if (poolCode) {
        // Store pool code to join after login/registration
        localStorage.setItem('pendingPoolCode', poolCode);
        alert('Please login or create an account to join this pool!');
    }
}

// Auto-join pool from invite link
function autoJoinPool(poolCode) {
    const pool = pools.find(p => p.code === poolCode.toUpperCase());
    
    if (!pool) {
        alert(`Pool with code ${poolCode} not found. The pool may have been deleted.`);
        return;
    }
    
    if (pool.members.includes(currentUser.id)) {
        alert(`You are already a member of "${pool.name}"!`);
        // Navigate to pools tab
        showTab('pools');
        return;
    }
    
    if (pool.members.length >= 40) {
        alert(`Pool "${pool.name}" is full (max 40 members).`);
        return;
    }
    
    // Join the pool
    pool.members.push(currentUser.id);
    savePools();
    loadPools();
    
    // Navigate to pools tab
    showTab('pools');
    
    alert(`Successfully joined pool: "${pool.name}"!\n\nMembers: ${pool.members.length}/40`);
    
    // Clear the URL parameter
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Authentication Functions
function showLogin() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('registerScreen').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerScreen').classList.add('active');
    document.getElementById('loginScreen').classList.remove('active');
}
// Check and award daily bonus - can be called on any interaction
function checkAndAwardDailyBonus() {
    if (!currentUser) return '';
    
    // Daily coin replenishment check - once per calendar day (user's local timezone)
    const now = new Date();
    // Use local date instead of UTC to respect user's timezone
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const loginDayKey = `${year}-${month}-${day}`; // YYYY-MM-DD format in user's local timezone
    const activityKey = `daily_bonus_${loginDayKey}`;
    let dailyBonusMessage = '';
    
    // Check if user already received bonus today
    const hasDailyBonusEntry = ensureUserActivityLog(currentUser).some(entry =>
        entry.type === 'daily_bonus' &&
        entry.details &&
        entry.details.activityKey === activityKey
    );

    if (!hasDailyBonusEntry) {
        currentUser.coins += 100;
        addUserActivity(currentUser.id, 'daily_bonus', 100, {
            reason: 'Daily bonus applied',
            activityKey,
            balanceAfter: currentUser.coins
        });
        dailyBonusMessage = `Thanks for coming back, ${currentUser.nickname}! You received 100 coins for today.`;
        
        // Update user in storage
        updateUserInStorage();
        
        // Update UI
        document.getElementById('userCoins').textContent = currentUser.coins;
        
        // Show notification
        if (dailyBonusMessage) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Daily Bonus!', {
                    body: dailyBonusMessage,
                    icon: 'bobimage.jpeg'
                });
            } else {
                alert(dailyBonusMessage);
            }
        }
    }
    
    return dailyBonusMessage;
}


async function login() {
    const nickname = document.getElementById('nickname').value.trim();
    const pin = document.getElementById('pin').value;

    if (!nickname || !pin) {
        alert('Please enter both nickname and PIN');
        return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be exactly 4 digits');
        return;
    }

    // Reload users from Firebase/localStorage
    if (useFirebase) {
        users = await FirebaseDB.getUsers();
    } else {
        users = JSON.parse(localStorage.getItem('users')) || [];
    }

    const user = users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase() && u.pin === pin);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Check for daily bonus on login
        const dailyBonusMessage = checkAndAwardDailyBonus();
        
        user.lastLogin = new Date().toISOString();

        await saveUsers();

        if (useFirebase) {
            users = await FirebaseDB.getUsers();
        } else {
            users = JSON.parse(localStorage.getItem('users')) || [];
        }

        currentUser = users.find(u => u.id === user.id) || user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();

        if (dailyBonusMessage) {
            showDailyBonusNotification(dailyBonusMessage);
            renderCurrentUserActivity();
        }
        
        // Check for pending pool invitation
        const pendingPoolCode = localStorage.getItem('pendingPoolCode');
        if (pendingPoolCode) {
            localStorage.removeItem('pendingPoolCode');
            autoJoinPool(pendingPoolCode);
        }
    } else {
        alert('Invalid nickname or PIN');
    }
}

async function register() {
    const nickname = document.getElementById('regNickname').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pin = document.getElementById('regPin').value;
    const pinConfirm = document.getElementById('regPinConfirm').value;

    if (!nickname || !email || !pin || !pinConfirm) {
        alert('Please fill in all fields');
        return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be exactly 4 digits');
        return;
    }

    if (pin !== pinConfirm) {
        alert('PINs do not match');
        return;
    }

    if (users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
        alert('Nickname already taken');
        return;
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('Email already registered');
        return;
    }

    const newUser = {
        id: Date.now(),
        nickname: nickname,
        email: email,
        pin: pin,
        coins: 1000,
        totalPredictions: 0,
        correctPredictions: 0,
        exactScores: 0,
        winStreak: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers();
    
    // Notify admin about new registration
    await notifyAdminNewUser(newUser);

    alert('Account created successfully! Please login.');
    showLogin();
}

// Notify admin about new user registration
async function notifyAdminNewUser(newUser) {
    const notification = {
        type: 'new_user',
        user: {
            nickname: newUser.nickname,
            email: newUser.email,
            createdAt: newUser.createdAt
        },
        timestamp: new Date().toISOString(),
        read: false
    };
    
    if (useFirebase) {
        await FirebaseDB.saveNotification(notification);
    } else {
        // Fallback to localStorage
        let adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        adminNotifications.push(notification);
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
    }
    
    console.log(`[ADMIN NOTIFICATION] New user registered: ${newUser.nickname} (${newUser.email})`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboardScreen').classList.remove('active');
    showLogin();
}

// Dashboard Functions
function showDashboard() {
    // Check for daily bonus when showing dashboard
    checkAndAwardDailyBonus();
    
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('registerScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.add('active');
    
    document.getElementById('userNickname').textContent = currentUser.nickname;
    document.getElementById('userCoins').textContent = currentUser.coins;
    
    // Show/hide admin tabs based on user role
    const usersTab = document.querySelector('.tab[onclick="showTab(\'users\')"]');
    const matchesTab = document.querySelector('.tab[onclick="showTab(\'matches\')"]');
    if (usersTab) {
        usersTab.style.display = isAdmin() ? 'block' : 'none';
    }
    if (matchesTab) {
        matchesTab.style.display = isAdmin() ? 'block' : 'none';
    }
    
    // Show admin notification badge if there are unread notifications
    if (isAdmin()) {
        updateAdminNotificationBadge();
    }
    if (isAdmin()) {
        updateAdminNotificationBadge();
    }
    
    loadMatches();
    loadPools();
    
    // Set default leaderboard to first pool if user has pools, otherwise hide global option
    const userPools = pools.filter(p => p.members.includes(currentUser.id));
    if (userPools.length > 0) {
        // User has pools - select first pool by default
        const poolSelect = document.getElementById('poolSelect');
        poolSelect.value = userPools[0].id;
    }
    
    updateLeaderboard();
    renderCurrentUserActivity();
}

function showTab(tabName) {
    // Check for daily bonus on any tab interaction
    checkAndAwardDailyBonus();
    
    activeTabName = tabName;

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        const targetTab = document.querySelector(`.tab[onclick="showTab('${tabName}')"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'leaderboard') {
        updateLeaderboard();
    } else if (tabName === 'users' && isAdmin()) {
        loadUsersTab();
    } else if (tabName === 'matches' && isAdmin()) {
        loadAdminMatches();
    } else if (tabName === 'pools') {
        loadPools();
    } else if (tabName === 'activity') {
        renderCurrentUserActivity();
    } else if (tabName === 'history') {
        loadHistory();
    }
}

// Matches Functions
function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    renderBobSuggestionKpi();
    
    const currentUserPredictions = predictions.filter(p => p.userId === currentUser.id);
    
    // Get today's date range (start and end of day in user's timezone)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Filter today's matches (upcoming only, not finished)
    const todaysMatches = matches.filter(match => {
        const kickoffDate = new Date(match.kickoff);
        return kickoffDate >= todayStart && kickoffDate <= todayEnd && match.status !== 'finished';
    });
    
    // Render Today's Games section if there are any
    if (todaysMatches.length > 0) {
        const todaySection = document.createElement('div');
        todaySection.className = 'todays-games-section';
        todaySection.innerHTML = `
            <div class="todays-games-header">
                <h3>⚽ Today's Games</h3>
                <span class="todays-games-count">${todaysMatches.length} match${todaysMatches.length !== 1 ? 'es' : ''}</span>
            </div>
        `;
        matchesList.appendChild(todaySection);
        
        // Render today's matches with special styling
        todaysMatches.forEach(match => {
            const userPrediction = currentUserPredictions.find(p => p.matchId === match.id);
            renderMatchCard(match, userPrediction, matchesList, true);
        });
        
        // Add separator
        const separator = document.createElement('div');
        separator.className = 'matches-separator';
        separator.innerHTML = '<h3>All Matches</h3>';
        matchesList.appendChild(separator);
    }

    matches.forEach(match => {
        const userPrediction = currentUserPredictions.find(p => p.matchId === match.id);
        
        const matchCard = document.createElement('div');
        const matchLocked = isMatchLocked(match);
        const predictionStateClass = userPrediction ? ' predicted' : ' unpredicted';
        matchCard.className = `match-card${matchLocked ? ' locked' : ''}${predictionStateClass}`;
        matchCard.onclick = () => openPredictionModal(match);
        
        const kickoffDate = new Date(match.kickoff);
        const formattedDate = kickoffDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Calculate result if match is finished
        let resultInfo = '';
        let lockInfo = '';
        if (match.status === 'finished' && match.finalScore && userPrediction) {
            const payout = calculatePayout(userPrediction, match.finalScore);
            const resultColor = payout > 0 ? '#28a745' : '#dc3545';
            resultInfo = `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid ${resultColor};">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <strong style="font-size: 16px;">Final Score: ${match.finalScore.home} - ${match.finalScore.away}</strong>
                    </div>
                    <div style="text-align: center; color: ${resultColor}; font-weight: bold; font-size: 18px;">
                        ${payout > 0 ? `🎉 Won ${payout} coins!` : '❌ Lost ${userPrediction.betAmount} coins'}
                    </div>
                </div>
            `;
        }

        if (match.status === 'finished' && match.finalScore) {
            lockInfo = `
                <div style="text-align: center; margin-top: 12px; color: #666; font-size: 13px; font-weight: 600;">
                    🔒 Predictions closed - awaiting processed results
                </div>
            `;
        } else if (matchLocked) {
            lockInfo = `
                <div style="text-align: center; margin-top: 12px; color: #dc3545; font-size: 13px; font-weight: 600;">
                    🔒 Predictions closed once kickoff passed
                </div>
            `;
        }

        const homeFlag = getCountryFlag(match.homeTeam);
        const awayFlag = getCountryFlag(match.awayTeam);

        const suggestion = ensureMatchSuggestion(match);
        const suggestionOutcome = getSuggestionOutcome(match);

        matchCard.innerHTML = `
            <div class="match-header">
                <span class="match-time">${formattedDate} - ${match.venue}</span>
                <span class="match-status status-${match.status}">${match.status.toUpperCase()}</span>
            </div>
            <div class="match-teams">
                <span class="team"><span class="team-flag">${homeFlag}</span>${match.homeTeam}</span>
                <span class="vs">${match.status === 'finished' && match.finalScore ? `${match.finalScore.home} - ${match.finalScore.away}` : 'VS'}</span>
                <span class="team">${match.awayTeam}<span class="team-flag">${awayFlag}</span></span>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
                ${match.stage}
            </div>
            <div class="match-suggestion">
                <div class="match-suggestion-header">
                    <span>🤖 Bob Suggestion</span>
                    <span class="match-suggestion-confidence">${suggestion.confidenceLabel}</span>
                </div>
                <div class="match-suggestion-score">Suggested score: ${suggestion.suggestedScore}</div>
                <div class="match-suggestion-result">Suggested result: ${suggestion.resultLabel}</div>
                <p class="match-suggestion-text">${suggestion.rationale}</p>
                <div class="match-suggestion-note">${suggestion.sourceNote}</div>
                ${suggestionOutcome ? `
                    <div class="match-suggestion-outcome ${suggestionOutcome.resultHit ? 'success' : 'miss'}">
                        <strong>${suggestionOutcome.summary}</strong>
                        <span>${suggestionOutcome.detail}</span>
                    </div>
                ` : ''}
            </div>
            ${userPrediction ? `
                <div class="match-prediction">
                    <span class="prediction-info">
                        Your prediction: ${userPrediction.homeScore} - ${userPrediction.awayScore}
                    </span>
                    <span class="prediction-bet">${userPrediction.betAmount} 🪙</span>
                </div>
            ` : ''}
            ${resultInfo}
            ${lockInfo}
        `;
        
        matchesList.appendChild(matchCard);
    });
}
// Helper function to render a match card
function renderMatchCard(match, userPrediction, container, isTodaySection = false) {
    const matchCard = document.createElement('div');
    const matchLocked = isMatchLocked(match);
    const predictionStateClass = userPrediction ? ' predicted' : ' unpredicted';
    const todayClass = isTodaySection ? ' today-match' : '';
    matchCard.className = `match-card${matchLocked ? ' locked' : ''}${predictionStateClass}${todayClass}`;
    matchCard.onclick = () => openPredictionModal(match);
    
    const kickoffDate = new Date(match.kickoff);
    const formattedDate = kickoffDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Calculate result if match is finished
    let resultInfo = '';
    let lockInfo = '';
    if (match.status === 'finished' && match.finalScore && userPrediction) {
        const payout = calculatePayout(userPrediction, match.finalScore);
        const resultColor = payout > 0 ? '#28a745' : '#dc3545';
        resultInfo = `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid ${resultColor};">
                <div style="text-align: center; margin-bottom: 10px;">
                    <strong style="font-size: 16px;">Final Score: ${match.finalScore.home} - ${match.finalScore.away}</strong>
                </div>
                <div style="text-align: center; color: ${resultColor}; font-weight: bold; font-size: 18px;">
                    ${payout > 0 ? `🎉 Won ${payout} coins!` : '❌ Lost ${userPrediction.betAmount} coins'}
                </div>
            </div>
        `;
    }

    if (match.status === 'finished' && match.finalScore) {
        lockInfo = `
            <div style="text-align: center; margin-top: 12px; color: #666; font-size: 13px; font-weight: 600;">
                🔒 Predictions closed - awaiting processed results
            </div>
        `;
    } else if (matchLocked) {
        lockInfo = `
            <div style="text-align: center; margin-top: 12px; color: #dc3545; font-size: 13px; font-weight: 600;">
                🔒 Predictions closed once kickoff passed
            </div>
        `;
    }

    const homeFlag = getCountryFlag(match.homeTeam);
    const awayFlag = getCountryFlag(match.awayTeam);

    const suggestion = ensureMatchSuggestion(match);
    const suggestionOutcome = getSuggestionOutcome(match);

    matchCard.innerHTML = `
        <div class="match-header">
            <span class="match-time">${formattedDate} - ${match.venue}</span>
            <span class="match-status status-${match.status}">${match.status.toUpperCase()}</span>
        </div>
        <div class="match-teams">
            <span class="team"><span class="team-flag">${homeFlag}</span>${match.homeTeam}</span>
            <span class="vs">${match.status === 'finished' && match.finalScore ? `${match.finalScore.home} - ${match.finalScore.away}` : 'VS'}</span>
            <span class="team">${match.awayTeam}<span class="team-flag">${awayFlag}</span></span>
        </div>
        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
            ${match.stage}
        </div>
        <div class="match-suggestion">
            <div class="match-suggestion-header">
                <span>🤖 Bob Suggestion</span>
                <span class="match-suggestion-confidence">${suggestion.confidenceLabel}</span>
            </div>
            <div class="match-suggestion-score">Suggested score: ${suggestion.suggestedScore}</div>
            <div class="match-suggestion-result">Suggested result: ${suggestion.resultLabel}</div>
            <p class="match-suggestion-text">${suggestion.rationale}</p>
            <div class="match-suggestion-note">${suggestion.sourceNote}</div>
            ${suggestionOutcome ? `
                <div class="match-suggestion-outcome ${suggestionOutcome.resultHit ? 'success' : 'miss'}">
                    <strong>${suggestionOutcome.summary}</strong>
                    <span>${suggestionOutcome.detail}</span>
                </div>
            ` : ''}
        </div>
        ${userPrediction ? `
            <div class="match-prediction">
                <span class="prediction-info">
                    Your prediction: ${userPrediction.homeScore} - ${userPrediction.awayScore}
                </span>
                <span class="prediction-bet">${userPrediction.betAmount} 🪙</span>
            </div>
        ` : ''}
        ${resultInfo}
        ${lockInfo}
    `;
    
    container.appendChild(matchCard);
}

// Load History Tab - Shows processed/finished matches
function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const currentUserPredictions = predictions.filter(p => p.userId === currentUser.id);
    
    // Filter for finished matches with final scores
    const finishedMatches = matches.filter(match => 
        match.status === 'finished' && match.finalScore
    );
    
    if (finishedMatches.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No match history yet. Check back after matches are completed and processed.</div>';
        return;
    }
    
    // Sort by kickoff date (most recent first)
    finishedMatches.sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff));
    
    finishedMatches.forEach(match => {
        const userPrediction = currentUserPredictions.find(p => p.matchId === match.id);
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card history-card';
        
        const kickoffDate = new Date(match.kickoff);
        const formattedDate = kickoffDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const homeFlag = getCountryFlag(match.homeTeam);
        const awayFlag = getCountryFlag(match.awayTeam);
        
        let resultInfo = '';
        if (userPrediction) {
            const payout = calculatePayout(userPrediction, match.finalScore);
            const resultColor = payout > 0 ? '#28a745' : '#dc3545';
            const resultIcon = payout > 0 ? '🎉' : '❌';
            const resultText = payout > 0 ? `Won ${payout} coins!` : `Lost ${userPrediction.betAmount} coins`;
            
            resultInfo = `
                <div class="history-result" style="border-top: 2px solid ${resultColor}; margin-top: 15px; padding-top: 15px;">
                    <div style="text-align: center; margin-bottom: 8px;">
                        <strong>Your Prediction: ${userPrediction.homeScore} - ${userPrediction.awayScore}</strong>
                        <span style="margin-left: 10px; color: #666;">(Bet: ${userPrediction.betAmount} 🪙)</span>
                    </div>
                    <div style="text-align: center; color: ${resultColor}; font-weight: bold; font-size: 18px;">
                        ${resultIcon} ${resultText}
                    </div>
                </div>
            `;
        } else {
            resultInfo = `
                <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; color: #999;">
                    No prediction made for this match
                </div>
            `;
        }
        
        matchCard.innerHTML = `
            <div class="match-header">
                <span class="match-time">${formattedDate} - ${match.venue}</span>
                <span class="match-status status-finished">FINISHED</span>
            </div>
            <div class="match-teams">
                <span class="team"><span class="team-flag">${homeFlag}</span>${match.homeTeam}</span>
                <span class="vs">${match.finalScore.home} - ${match.finalScore.away}</span>
                <span class="team">${match.awayTeam}<span class="team-flag">${awayFlag}</span></span>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
                ${match.stage}
            </div>
            ${resultInfo}
        `;
        
        historyList.appendChild(matchCard);
    });
}


function getCountryFlag(teamName) {
    const countryFlags = {
        "Argentina": "🇦🇷",
        "Australia": "🇦🇺",
        "Austria": "🇦🇹",
        "Belgium": "🇧🇪",
        "Bosnia and Herzegovina": "🇧🇦",
        "Brazil": "🇧🇷",
        "Cabo Verde": "🇨🇻",
        "Canada": "🇨🇦",
        "Colombia": "🇨🇴",
        "Congo DR": "🇨🇩",
        "Croatia": "🇭🇷",
        "Curaçao": "🇨🇼",
        "Czechia": "🇨🇿",
        "Côte d'Ivoire": "🇨🇮",
        "Denmark": "🇩🇰",
        "Ecuador": "🇪🇨",
        "Egypt": "🇪🇬",
        "England": "🏴",
        "France": "🇫🇷",
        "Germany": "🇩🇪",
        "Haiti": "🇭🇹",
        "IR Iran": "🇮🇷",
        "Italy": "🇮🇹",
        "Japan": "🇯🇵",
        "Jordan": "🇯🇴",
        "Korea Republic": "🇰🇷",
        "Mexico": "🇲🇽",
        "Morocco": "🇲🇦",
        "Netherlands": "🇳🇱",
        "New Zealand": "🇳🇿",
        "Paraguay": "🇵🇾",
        "Portugal": "🇵🇹",
        "Qatar": "🇶🇦",
        "Saudi Arabia": "🇸🇦",
        "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "Senegal": "🇸🇳",
        "South Africa": "🇿🇦",
        "Spain": "🇪🇸",
        "Sweden": "🇸🇪",
        "Switzerland": "🇨🇭",
        "Tunisia": "🇹🇳",
        "Türkiye": "🇹🇷",
        "Uruguay": "🇺🇾",
        "USA": "🇺🇸"
    };

    return countryFlags[teamName] || "🏳️";
}

function getTeamStrength(teamName) {
    const strengthMap = {
        "Brazil": 95,
        "France": 94,
        "England": 92,
        "Spain": 91,
        "Germany": 90,
        "Portugal": 89,
        "Netherlands": 88,
        "Belgium": 87,
        "Croatia": 85,
        "Uruguay": 84,
        "Japan": 82,
        "Morocco": 82,
        "Mexico": 81,
        "USA": 81,
        "Switzerland": 80,
        "Senegal": 80,
        "Austria": 79,
        "Türkiye": 79,
        "Sweden": 78,
        "Paraguay": 77,
        "Ecuador": 77,
        "Czechia": 76,
        "Scotland": 76,
        "IR Iran": 75,
        "Egypt": 75,
        "Tunisia": 74,
        "Australia": 74,
        "Saudi Arabia": 73,
        "Qatar": 72,
        "New Zealand": 71,
        "Jordan": 70,
        "South Africa": 70,
        "Bosnia and Herzegovina": 70,
        "Congo DR": 69,
        "Côte d'Ivoire": 78,
        "Korea Republic": 78,
        "Canada": 79,
        "Haiti": 64,
        "Curaçao": 63,
        "Cabo Verde": 68
    };

    return strengthMap[teamName] || 66;
}

function getMatchSuggestion(match) {
    const homeStrength = getTeamStrength(match.homeTeam);
    const awayStrength = getTeamStrength(match.awayTeam);
    const strengthGap = homeStrength - awayStrength;
    const homeAdvantage = ["Mexico", "Canada", "USA"].includes(match.homeTeam) ? 4 : 0;
    const adjustedGap = strengthGap + homeAdvantage;

    let suggestedHomeScore;
    let suggestedAwayScore;
    let resultLabel;
    let confidenceLabel;
    let rationale;

    if (adjustedGap >= 12) {
        suggestedHomeScore = 2;
        suggestedAwayScore = 0;
        resultLabel = `${match.homeTeam} win`;
        confidenceLabel = "High confidence";
        rationale = `${match.homeTeam} look stronger on paper and should control most phases of the match.`;
    } else if (adjustedGap >= 6) {
        suggestedHomeScore = 2;
        suggestedAwayScore = 1;
        resultLabel = `${match.homeTeam} win`;
        confidenceLabel = "Solid confidence";
        rationale = `${match.homeTeam} have the stronger squad profile, but ${match.awayTeam} should still create moments.`;
    } else if (adjustedGap <= -12) {
        suggestedHomeScore = 0;
        suggestedAwayScore = 2;
        resultLabel = `${match.awayTeam} win`;
        confidenceLabel = "High confidence";
        rationale = `${match.awayTeam} appear significantly stronger and are the more likely side to convert chances.`;
    } else if (adjustedGap <= -6) {
        suggestedHomeScore = 1;
        suggestedAwayScore = 2;
        resultLabel = `${match.awayTeam} win`;
        confidenceLabel = "Solid confidence";
        rationale = `${match.awayTeam} have the edge overall, although ${match.homeTeam} could still get on the scoresheet.`;
    } else {
        suggestedHomeScore = 1;
        suggestedAwayScore = 1;
        resultLabel = "Draw";
        confidenceLabel = "Balanced matchup";
        rationale = `The teams look closely matched, so a draw is the safest suggestion for result-based play.`;
    }

    return {
        suggestedHomeScore,
        suggestedAwayScore,
        suggestedScore: `${suggestedHomeScore}-${suggestedAwayScore}`,
        resultLabel,
        confidenceLabel,
        rationale,
        sourceNote: "Based on Bob's own football-strength model using public team reputation and tournament context."
    };
}

function ensureMatchSuggestion(match) {
    if (!match.bobSuggestion) {
        const suggestion = getMatchSuggestion(match);
        match.bobSuggestion = {
            suggestedHomeScore: suggestion.suggestedHomeScore,
            suggestedAwayScore: suggestion.suggestedAwayScore,
            suggestedScore: suggestion.suggestedScore,
            resultLabel: suggestion.resultLabel,
            confidenceLabel: suggestion.confidenceLabel,
            rationale: suggestion.rationale,
            sourceNote: suggestion.sourceNote,
            createdAt: new Date().toISOString()
        };
    }

    return match.bobSuggestion;
}

function getActualResultLabel(finalScore) {
    if (!finalScore) {
        return '';
    }

    if (finalScore.home > finalScore.away) {
        return 'home';
    }

    if (finalScore.home < finalScore.away) {
        return 'away';
    }

    return 'draw';
}

function getSuggestedResultKey(suggestion, match) {
    if (!suggestion) {
        return '';
    }

    if (suggestion.resultLabel === 'Draw') {
        return 'draw';
    }

    if (suggestion.resultLabel === `${match.homeTeam} win`) {
        return 'home';
    }

    if (suggestion.resultLabel === `${match.awayTeam} win`) {
        return 'away';
    }

    return '';
}

function evaluateBobSuggestion(match) {
    const suggestion = ensureMatchSuggestion(match);

    if (!match.finalScore) {
        delete suggestion.evaluation;
        return suggestion;
    }

    const exactHit = suggestion.suggestedHomeScore === match.finalScore.home &&
        suggestion.suggestedAwayScore === match.finalScore.away;
    const resultHit = getSuggestedResultKey(suggestion, match) === getActualResultLabel(match.finalScore);

    suggestion.evaluation = {
        exactHit,
        resultHit,
        actualScore: `${match.finalScore.home}-${match.finalScore.away}`,
        evaluatedAt: new Date().toISOString()
    };

    return suggestion;
}

function getSuggestionOutcome(match) {
    const suggestion = match.bobSuggestion;
    if (!suggestion || !suggestion.evaluation) {
        return null;
    }

    if (suggestion.evaluation.exactHit) {
        return {
            resultHit: true,
            summary: '✅ Bob nailed the exact score',
            detail: `Actual score: ${suggestion.evaluation.actualScore}`
        };
    }

    if (suggestion.evaluation.resultHit) {
        return {
            resultHit: true,
            summary: '🟦 Bob got the result right',
            detail: `Suggested ${suggestion.resultLabel} • Actual score: ${suggestion.evaluation.actualScore}`
        };
    }

    return {
        resultHit: false,
        summary: '❌ Bob missed this one',
        detail: `Suggested ${suggestion.suggestedScore} (${suggestion.resultLabel}) • Actual score: ${suggestion.evaluation.actualScore}`
    };
}

function getBobSuggestionKpi() {
    const evaluatedMatches = matches.filter(match => match.bobSuggestion && match.bobSuggestion.evaluation);
    const exactHits = evaluatedMatches.filter(match => match.bobSuggestion.evaluation.exactHit).length;
    const resultHits = evaluatedMatches.filter(match => match.bobSuggestion.evaluation.resultHit).length;
    const total = evaluatedMatches.length;

    return {
        total,
        exactHits,
        resultHits,
        exactRate: total ? Math.round((exactHits / total) * 100) : 0,
        resultRate: total ? Math.round((resultHits / total) * 100) : 0
    };
}

function renderBobSuggestionKpi() {
    const kpiContainer = document.getElementById('bobSuggestionKpi');
    if (!kpiContainer) {
        return;
    }

    const kpi = getBobSuggestionKpi();

    kpiContainer.innerHTML = `
        <div class="bob-kpi-card">
            <div class="bob-kpi-header">
                <div>
                    <div class="bob-kpi-eyebrow">🤖 Bob Suggestion KPI</div>
                    <h3>How Bob is performing so far</h3>
                    <p>Each match keeps Bob's original suggestion, then scores it once the final result is entered.</p>
                </div>
                <div class="bob-kpi-highlight">${kpi.resultRate}%</div>
            </div>
            <div class="bob-kpi-grid">
                <div class="bob-kpi-stat">
                    <span class="bob-kpi-label">Finished matches scored</span>
                    <strong>${kpi.total}</strong>
                </div>
                <div class="bob-kpi-stat">
                    <span class="bob-kpi-label">Correct result calls</span>
                    <strong>${kpi.resultHits}</strong>
                </div>
                <div class="bob-kpi-stat">
                    <span class="bob-kpi-label">Exact score hits</span>
                    <strong>${kpi.exactHits}</strong>
                </div>
                <div class="bob-kpi-stat">
                    <span class="bob-kpi-label">Exact score rate</span>
                    <strong>${kpi.exactRate}%</strong>
                </div>
            </div>
        </div>
    `;
}

function openPredictionModalById(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) {
        console.error('Match not found:', matchId);
        return;
    }
    openPredictionModal(match);
}

function openPredictionModal(match) {
    if (isMatchLocked(match)) {
        alert('This match is locked. Predictions are frozen after kickoff and remain unavailable until an admin enters the final result and processes payouts.');
        return;
    }

    currentMatchId = match.id;
    
    const suggestion = ensureMatchSuggestion(match);

    document.getElementById('modalMatchTitle').textContent =
        `${match.homeTeam} vs ${match.awayTeam}`;
    document.getElementById('homeTeamLabel').textContent = match.homeTeam;
    document.getElementById('awayTeamLabel').textContent = match.awayTeam;
    document.getElementById('modalSuggestionScore').textContent = suggestion.suggestedScore;
    document.getElementById('modalSuggestionResult').textContent = suggestion.resultLabel;
    document.getElementById('modalSuggestionConfidence').textContent = suggestion.confidenceLabel;
    document.getElementById('modalSuggestionReason').textContent = suggestion.rationale;
    
    // Check if user already has a prediction
    const existingPrediction = predictions.find(p => 
        p.userId === currentUser.id && p.matchId === match.id
    );
    
    if (existingPrediction) {
        document.getElementById('homeScore').value = existingPrediction.homeScore;
        document.getElementById('awayScore').value = existingPrediction.awayScore;
        document.getElementById('betAmount').value = existingPrediction.betAmount;
    } else {
        document.getElementById('homeScore').value = 0;
        document.getElementById('awayScore').value = 0;
        document.getElementById('betAmount').value = 50;
    }
    
    updatePayoutDisplay();
    document.getElementById('predictionModal').classList.add('active');
}

function closePredictionModal() {
    document.getElementById('predictionModal').classList.remove('active');
    currentMatchId = null;
}

function updatePayoutDisplay() {
    const betAmount = parseInt(document.getElementById('betAmount').value) || 0;
    document.getElementById('exactPayout').textContent = betAmount * 5;
    document.getElementById('resultPayout').textContent = betAmount * 2;
}

// Update payout when bet amount changes
document.addEventListener('DOMContentLoaded', () => {
    const betAmountInput = document.getElementById('betAmount');
    if (betAmountInput) {
        betAmountInput.addEventListener('input', updatePayoutDisplay);
    }
});

function submitPrediction() {
    const match = matches.find(m => m.id === currentMatchId);

    if (!match) {
        alert('Match not found');
        return;
    }

    if (isMatchLocked(match)) {
        alert('This match is locked. Predictions cannot be created or changed after kickoff.');
        closePredictionModal();
        loadMatches();
        return;
    }

    const homeScore = parseInt(document.getElementById('homeScore').value);
    const awayScore = parseInt(document.getElementById('awayScore').value);
    const betAmount = parseInt(document.getElementById('betAmount').value);
    
    if (isNaN(homeScore) || isNaN(awayScore) || isNaN(betAmount)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (betAmount < 10 || betAmount > 500) {
        alert('Bet amount must be between 10 and 500 coins');
        return;
    }
    
    // Check if user already has a prediction for this match
    const existingPrediction = predictions.find(p =>
        p.userId === currentUser.id && p.matchId === currentMatchId
    );
    
    if (existingPrediction) {
        // Ask user if they want to modify or place a new bet
        const userChoice = confirm(
            `You already have a prediction for this match:\n` +
            `Score: ${existingPrediction.homeScore} - ${existingPrediction.awayScore}\n` +
            `Bet: ${existingPrediction.betAmount} coins\n\n` +
            `Click OK to MODIFY your existing prediction (no additional coins deducted)\n` +
            `Click CANCEL to place a NEW bet (${betAmount} coins will be deducted)`
        );
        
        if (userChoice) {
            const previousPredictionScore = `${existingPrediction.homeScore} - ${existingPrediction.awayScore}`;
            const previousBetAmount = existingPrediction.betAmount;
            const betDifference = betAmount - previousBetAmount;

            if (betDifference > 0 && currentUser.coins < betDifference) {
                alert(`Insufficient coins to increase your bet by ${betDifference} coins.`);
                return;
            }

            existingPrediction.homeScore = homeScore;
            existingPrediction.awayScore = awayScore;
            existingPrediction.betAmount = betAmount;
            existingPrediction.modifiedAt = new Date().toISOString();

            currentUser.coins -= betDifference;

            addUserActivity(currentUser.id, 'prediction_edit', currentUser.coins - (currentUser.coins + betDifference), {
                reason: 'Prediction updated before kickoff',
                matchId: currentMatchId,
                predictionScore: `${homeScore} - ${awayScore}`,
                previousPredictionScore,
                previousBetAmount,
                updatedBetAmount: betAmount,
                balanceAfter: currentUser.coins
            });
            
            updateUserInStorage();
            savePredictions();
            renderCurrentUserActivity();
            
            document.getElementById('userCoins').textContent = currentUser.coins;
            closePredictionModal();
            loadMatches();
            
            alert('Prediction modified successfully!');
            return;
        }
        // If user chose CANCEL, continue to place new bet below
    }
    
    // Check if user has enough coins for new bet
    if (currentUser.coins < betAmount) {
        alert('Insufficient coins!');
        return;
    }
    
    // Add new prediction
    predictions.push({
        id: Date.now(),
        userId: currentUser.id,
        matchId: currentMatchId,
        homeScore: homeScore,
        awayScore: awayScore,
        betAmount: betAmount,
        createdAt: new Date().toISOString()
    });
    
    // Deduct coins for new bet
    currentUser.coins -= betAmount;
    currentUser.totalPredictions = (currentUser.totalPredictions || 0) + 1;

    addUserActivity(currentUser.id, 'prediction_bet', -betAmount, {
        reason: 'Coins deducted for new prediction',
        matchId: currentMatchId,
        predictionScore: `${homeScore} - ${awayScore}`,
        balanceAfter: currentUser.coins
    });

    updateUserInStorage();
    savePredictions();
    renderCurrentUserActivity();
    
    document.getElementById('userCoins').textContent = currentUser.coins;
    
    closePredictionModal();
    loadMatches();
    
    alert('New prediction submitted successfully!');
}

// Pools Functions
function loadPools() {
    const poolsList = document.getElementById('poolsList');
    const poolSelect = document.getElementById('poolSelect');
    
    poolsList.innerHTML = '';
    
    // Admin sees all pools, regular users see only their pools
    const displayPools = isAdmin() ? pools : pools.filter(p => p.members.includes(currentUser.id));
    
    // Always add global option first
    poolSelect.innerHTML = '<option value="global">🌍 Global Leaderboard</option>';
    
    if (displayPools.length === 0) {
        poolsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">You are not in any pools yet. Create or join one!</p>';
        return;
    }
    
    // Add admin badge if viewing all pools
    if (isAdmin() && pools.length > displayPools.length) {
        poolsList.innerHTML = '<div style="background: #ffc107; color: #000; padding: 10px; border-radius: 5px; margin-bottom: 15px; text-align: center; font-weight: bold;">👑 Admin View: Showing All Pools</div>';
    }
    
    displayPools.forEach(pool => {
        const isUserMember = pool.members.includes(currentUser.id);
        // Add to pools list
        const poolCard = document.createElement('div');
        poolCard.className = 'pool-card';
        
        // Generate invite link
        const inviteLink = `${window.location.origin}${window.location.pathname}?pool=${pool.code}`;
        
        poolCard.innerHTML = `
            <div class="pool-header">
                <span class="pool-name">${pool.name}${!isUserMember && isAdmin() ? ' 👁️' : ''}</span>
                <span class="pool-code">Code: ${pool.code}</span>
            </div>
            <p style="color: #666; margin: 10px 0;">${pool.description || 'No description'}</p>
            <div class="pool-stats">
                <span>👥 ${pool.members.length} members</span>
                <span>👑 Admin: ${getUserNickname(pool.adminId)}</span>
            </div>
            ${!isUserMember && isAdmin() ? `
                <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px; font-size: 14px;">
                    👁️ Viewing as admin (not a member)
                </div>
            ` : ''}
            ${pool.adminId === currentUser.id ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p style="font-size: 14px; color: #666; margin-bottom: 8px;">📤 Invite Link:</p>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" value="${inviteLink}" readonly
                               style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px; background: #f8f9fa;"
                               onclick="this.select()">
                        <button onclick="copyInviteLink('${inviteLink}', '${pool.code}')"
                                style="padding: 8px 15px; background: #1e3c72; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                            Copy
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
        poolsList.appendChild(poolCard);
        
        // Add to pool select
        const option = document.createElement('option');
        option.value = pool.id;
        option.textContent = pool.name;
        poolSelect.appendChild(option);
    });
}

function showCreatePool() {
    document.getElementById('createPoolModal').classList.add('active');
}

function closeCreatePool() {
    document.getElementById('createPoolModal').classList.remove('active');
}

function createPool() {
    const poolName = document.getElementById('poolName').value.trim();
    const poolDescription = document.getElementById('poolDescription').value.trim();
    
    if (!poolName) {
        alert('Please enter a pool name');
        return;
    }
    
    const poolCode = generatePoolCode();
    
    const newPool = {
        id: Date.now(),
        name: poolName,
        description: poolDescription,
        code: poolCode,
        adminId: currentUser.id,
        members: [currentUser.id],
        createdAt: new Date().toISOString()
    };
    
    pools.push(newPool);
    savePools();
    
    closeCreatePool();
    loadPools();
    
    // Generate invite link
    const inviteLink = `${window.location.origin}${window.location.pathname}?pool=${poolCode}`;
    
    // Show success message with invite link
    const message = `Pool created successfully!\n\n` +
                   `Pool Code: ${poolCode}\n\n` +
                   `Invite Link:\n${inviteLink}\n\n` +
                   `Share this link with friends to invite them!`;
    
    alert(message);
    
    // Optionally copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteLink).then(() => {
            console.log('Invite link copied to clipboard');
        }).catch(err => {
            console.log('Could not copy link:', err);
        });
    }
}

// Function to copy invite link to clipboard
function copyInviteLink(link, code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            alert(`Invite link copied to clipboard!\n\nPool Code: ${code}\nLink: ${link}`);
        }).catch(err => {
            alert(`Could not copy link automatically. Please copy manually:\n\n${link}`);
        });
    } else {
        alert(`Copy this invite link:\n\n${link}`);
    }
}

function showJoinPool() {
    document.getElementById('joinPoolModal').classList.add('active');
}

function closeJoinPool() {
    document.getElementById('joinPoolModal').classList.remove('active');
}

function joinPool() {
    const poolCode = document.getElementById('poolCode').value.trim().toUpperCase();
    
    if (!poolCode) {
        alert('Please enter a pool code');
        return;
    }
    
    const pool = pools.find(p => p.code === poolCode);
    
    if (!pool) {
        alert('Invalid pool code');
        return;
    }
    
    if (pool.members.includes(currentUser.id)) {
        alert('You are already in this pool');
        return;
    }
    
    if (pool.members.length >= 40) {
        alert('This pool is full (max 40 members)');
        return;
    }
    
    pool.members.push(currentUser.id);
    savePools();
    
    closeJoinPool();
    loadPools();
    
    alert(`Successfully joined ${pool.name}!`);
}

function generatePoolCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Leaderboard Functions
function getPredictionEarnedCoins(user) {
    const activityLog = ensureUserActivityLog(user);
    return activityLog.reduce((total, entry) => {
        if (entry.type === 'payout' && entry.amount > 0) {
            return total + entry.amount;
        }
        return total;
    }, 0);
}

function updateLeaderboard() {
    const poolSelect = document.getElementById('poolSelect');
    const poolId = poolSelect.value;
    const leaderboardList = document.getElementById('leaderboardList');
    const poolLeaderboardList = document.getElementById('poolLeaderboardList');
    
    let usersToRank = [];
    
    // Global leaderboard - show all users
    if (poolId === 'global') {
        usersToRank = users;
    } else {
        // Pool-specific leaderboard
        const pool = pools.find(p => p.id === parseInt(poolId));
        if (pool) {
            usersToRank = users.filter(u => pool.members.includes(u.id));
        }
    }

    const rankedUsers = usersToRank.map(user => ({
        ...user,
        predictionEarnedCoins: getPredictionEarnedCoins(user)
    }));
    
    // Sort by prediction-earned coins only, then accuracy, then total correct predictions
    rankedUsers.sort((a, b) => {
        if (b.predictionEarnedCoins !== a.predictionEarnedCoins) {
            return b.predictionEarnedCoins - a.predictionEarnedCoins;
        }

        const accuracyA = a.totalPredictions ? (a.correctPredictions / a.totalPredictions) : 0;
        const accuracyB = b.totalPredictions ? (b.correctPredictions / b.totalPredictions) : 0;
        if (accuracyB !== accuracyA) {
            return accuracyB - accuracyA;
        }

        return (b.correctPredictions || 0) - (a.correctPredictions || 0);
    });
    
    leaderboardList.innerHTML = '';
    
    rankedUsers.forEach((user, index) => {
        const rank = index + 1;
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        
        item.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">#${rank}</span>
            <span class="leaderboard-player">${user.nickname}</span>
            <div class="leaderboard-stats">
                <div class="stat">
                    <div class="stat-label">Won on Predictions</div>
                    <div class="stat-value">${user.predictionEarnedCoins} 🪙</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Current Coins</div>
                    <div class="stat-value">${user.coins} 🪙</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Accuracy</div>
                    <div class="stat-value">${user.totalPredictions ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0}%</div>
                </div>
            </div>
        `;
        
        leaderboardList.appendChild(item);
    });

    if (!poolLeaderboardList) {
        return;
    }

    const rankedPools = pools.map(pool => {
        const poolMembers = users.filter(user => pool.members.includes(user.id));
        const totalPredictionEarnedCoins = poolMembers.reduce((total, user) => total + getPredictionEarnedCoins(user), 0);
        const totalCurrentCoins = poolMembers.reduce((total, user) => total + (user.coins || 0), 0);

        return {
            ...pool,
            totalPredictionEarnedCoins,
            totalCurrentCoins,
            memberCount: poolMembers.length
        };
    }).sort((a, b) => {
        if (b.totalPredictionEarnedCoins !== a.totalPredictionEarnedCoins) {
            return b.totalPredictionEarnedCoins - a.totalPredictionEarnedCoins;
        }

        return b.memberCount - a.memberCount;
    });

    poolLeaderboardList.innerHTML = '';

    rankedPools.forEach((pool, index) => {
        const rank = index + 1;
        const item = document.createElement('div');
        item.className = 'leaderboard-item';

        const rankClass = rank <= 3 ? `rank-${rank}` : '';

        item.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">#${rank}</span>
            <span class="leaderboard-player">${pool.name}</span>
            <div class="leaderboard-stats">
                <div class="stat">
                    <div class="stat-label">Pool Prediction Winnings</div>
                    <div class="stat-value">${pool.totalPredictionEarnedCoins} 🪙</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Members</div>
                    <div class="stat-value">${pool.memberCount}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Pool Coins</div>
                    <div class="stat-value">${pool.totalCurrentCoins} 🪙</div>
                </div>
            </div>
        `;

        poolLeaderboardList.appendChild(item);
    });
}

// Helper Functions
function getUserNickname(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.nickname : 'Unknown';
}

// Calculate payout for a prediction
function calculatePayout(prediction, finalScore) {
    const predictedHome = prediction.homeScore;
    const predictedAway = prediction.awayScore;
    const actualHome = finalScore.home;
    const actualAway = finalScore.away;
    const betAmount = prediction.betAmount;
    
    // Check if exact score
    if (predictedHome === actualHome && predictedAway === actualAway) {
        return betAmount * 5; // 5x payout for exact score
    }
    
    // Check if correct result (winner or draw)
    const predictedResult = predictedHome > predictedAway ? 'home' :
                           predictedHome < predictedAway ? 'away' : 'draw';
    const actualResult = actualHome > actualAway ? 'home' :
                        actualHome < actualAway ? 'away' : 'draw';
    
    if (predictedResult === actualResult) {
        return betAmount * 2; // 2x payout for correct result
    }
    
    // Incorrect prediction
    return 0;
}

// Process finished matches and award payouts
function processFinishedMatches() {
    if (!isAdmin()) {
        alert('Only admin can process match results!');
        return;
    }
    
    let processedCount = 0;
    let totalPayout = 0;
    
    let matchesUpdated = false;

    matches.forEach(match => {
        if (match.status === 'finished' && match.finalScore) {
            evaluateBobSuggestion(match);
            matchesUpdated = true;
            // Find all predictions for this match
            const matchPredictions = predictions.filter(p => p.matchId === match.id);
            
            matchPredictions.forEach(prediction => {
                // Skip if already processed
                if (prediction.processed) return;
                
                const payout = calculatePayout(prediction, match.finalScore);
                const user = users.find(u => u.id === prediction.userId);
                
                if (user) {
                    // Award payout
                    user.coins += payout;

                    addUserActivity(user.id, 'payout', payout, {
                        reason: payout > 0 ? 'Prediction payout processed' : 'Prediction processed with no winnings',
                        matchId: match.id,
                        predictionScore: `${prediction.homeScore} - ${prediction.awayScore}`,
                        finalScore: `${match.finalScore.home} - ${match.finalScore.away}`
                    });
                    
                    // Update stats
                    if (payout > 0) {
                        user.correctPredictions = (user.correctPredictions || 0) + 1;
                        if (payout === prediction.betAmount * 5) {
                            user.exactScores = (user.exactScores || 0) + 1;
                        }
                    }
                    
                    // Mark prediction as processed
                    prediction.processed = true;
                    prediction.payout = payout;
                    
                    processedCount++;
                    totalPayout += payout;
                }
            });
        }
    });
    
    // Save all changes
    saveUsers();
    savePredictions();
    if (matchesUpdated) {
        saveMatches();
    }
    
    // Update current user if they got payouts
    const updatedCurrentUser = users.find(u => u.id === currentUser.id);
    if (updatedCurrentUser) {
        currentUser = updatedCurrentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('userCoins').textContent = currentUser.coins;
    }
    
    // Reload matches and leaderboard
    loadMatches();
    updateLeaderboard();
    
    alert(`Processed ${processedCount} predictions!\nTotal payouts: ${totalPayout} coins\n\nYour balance: ${currentUser.coins} coins`);
}

// Admin: Show admin panel
function showAdminPanel() {
    if (!isAdmin()) {
        alert('Access denied! Admin only.');
        return;
    }
    document.getElementById('adminModal').style.display = 'block';
    loadAdminUsers();
    loadAdminMatches();
}

function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
}

// Admin: Toggle admin access
async function toggleAdminStatus(userId) {
    if (!isAdmin()) return;

    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.nickname === ADMIN_NICKNAME && user.isAdmin) {
        alert('The primary admin must always remain an admin.');
        return;
    }

    const currentUserIsPrimaryAdmin = currentUser && currentUser.nickname === ADMIN_NICKNAME;
    const willBecomeAdmin = !user.isAdmin;

    if (willBecomeAdmin && !currentUserIsPrimaryAdmin) {
        alert('Only Menicos can promote users to admin. Existing admins can still remove admin access from other users.');
        return;
    }

    const actionLabel = willBecomeAdmin ? 'grant admin access to' : 'remove admin access from';

    if (!confirm(`Are you sure you want to ${actionLabel} "${user.nickname}"?`)) {
        return;
    }

    user.isAdmin = willBecomeAdmin;

    addUserActivity(user.id, willBecomeAdmin ? 'admin_grant' : 'admin_remove', 0, {
        reason: willBecomeAdmin ? 'User promoted to admin' : 'Admin access removed',
        changedBy: currentUser.nickname
    });

    await saveUsers();

    if (currentUser && currentUser.id === user.id) {
        currentUser.isAdmin = willBecomeAdmin;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    loadAdminUsers();
    loadUsersTab();
    alert(`${user.nickname} is ${willBecomeAdmin ? 'now' : 'no longer'} an admin.`);
}

// Admin: Load users for management
function loadAdminUsers() {
    const usersList = document.getElementById('adminUsersList');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'admin-user-item';
        userItem.innerHTML = `
            <div>
                <strong>${user.nickname}</strong> ${user.isAdmin ? '(Admin)' : ''}
                <br>
                <small>Coins: ${user.coins} 🪙 | Email: ${user.email}</small>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="resetUserCoins('${user.id}')" class="btn-secondary" style="padding: 5px 10px;">
                    Reset Coins
                </button>
                <button onclick="toggleAdminStatus('${user.id}')" class="btn-secondary" style="padding: 5px 10px; background: ${user.isAdmin ? '#6c757d' : '#1e3c72'};">
                    ${user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
                ${user.nickname !== ADMIN_NICKNAME ? `
                    <button onclick="deleteUser('${user.id}')" class="btn-secondary" style="padding: 5px 10px; background: #dc3545;">
                        Delete
                    </button>
                ` : ''}
            </div>
        `;
        usersList.appendChild(userItem);
    });
}

// Admin: Reset user coins
function resetUserCoins(userId) {
    if (!isAdmin()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newAmount = prompt(`Reset coins for ${user.nickname}?\nCurrent: ${user.coins} coins\n\nEnter new amount:`, '1000');
    if (newAmount === null) return;
    
    const amount = parseInt(newAmount);
    if (isNaN(amount) || amount < 0) {
        alert('Invalid amount!');
        return;
    }
    
    const previousCoins = user.coins;
    user.coins = amount;

    addUserActivity(user.id, 'admin_reset', amount - previousCoins, {
        reason: `Admin reset coins from ${previousCoins} to ${amount}`,
        changedBy: currentUser.nickname
    });

    saveUsers();
    
    // Update if it's current user
    if (user.id === currentUser.id) {
        currentUser.coins = amount;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('userCoins').textContent = currentUser.coins;
    }
    
    loadAdminUsers();
    alert(`Coins reset for ${user.nickname}!\nNew balance: ${amount} coins`);
}

// Admin: Delete user
function deleteUser(userId) {
    if (!isAdmin()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.nickname === ADMIN_NICKNAME) {
        alert('Cannot delete the primary admin user!');
        return;
    }

    if (user.isAdmin) {
        alert('Remove admin access before deleting this user.');
        return;
    }
    
    if (!confirm(`Delete user "${user.nickname}"?\n\nThis will also remove:\n- All their predictions\n- Their pool memberships\n\nThis action cannot be undone!`)) {
        return;
    }
    
    // Remove user from users array
    users = users.filter(u => u.id !== userId);
    
    // Remove user's predictions
    predictions = predictions.filter(p => p.userId !== userId);
    
    // Remove user from all pools
    pools.forEach(pool => {
        pool.members = pool.members.filter(memberId => memberId !== userId);
    });
    
    // Save changes
    saveUsers();
    savePredictions();
    savePools();
    
    loadAdminUsers();
    updateLeaderboard();
    
    alert(`User "${user.nickname}" has been deleted.`);
}

// Admin: Load matches for result entry
function loadAdminMatches() {
    const matchesList = document.getElementById('adminMatchesList');
    matchesList.innerHTML = '';
    
    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'admin-match-item';
        
        const matchDate = new Date(match.kickoff);
        const isFinished = match.status === 'finished';
        const hasStarted = hasMatchStarted(match);
        
        matchItem.innerHTML = `
            <div>
                <strong>${match.homeTeam} vs ${match.awayTeam}</strong>
                <br>
                <small>${matchDate.toLocaleString()} | ${match.stage}</small>
                <br>
                <small>Status: <span style="color: ${isFinished ? '#28a745' : hasStarted ? '#dc3545' : '#ffc107'}">${isFinished ? 'FINISHED' : hasStarted ? 'LOCKED' : match.status.toUpperCase()}</span></small>
                ${hasStarted && !isFinished ? `<br><small>Predictions frozen until admin enters the final score.</small>` : ''}
                ${isFinished && match.finalScore ? `<br><small>Final Score: ${match.finalScore.home} - ${match.finalScore.away}</small>` : ''}
            </div>
            <div>
                ${!isFinished ? `
                    <button onclick="enterMatchResult(${match.id})" class="btn-primary" style="padding: 5px 15px;">
                        ${hasStarted ? 'Enter Result' : 'Set Result Early'}
                    </button>
                ` : `
                    <button onclick="editMatchResult(${match.id})" class="btn-secondary" style="padding: 5px 15px;">
                        Edit Result
                    </button>
                `}
            </div>
        `;
        matchesList.appendChild(matchItem);
    });
}

// Admin: Enter match result
async function enterMatchResult(matchId) {
    if (!isAdmin()) return;
    
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const homeScore = prompt(`Enter result for:\n${match.homeTeam} vs ${match.awayTeam}\n\nHome team (${match.homeTeam}) score:`, '0');
    if (homeScore === null) return;
    
    const awayScore = prompt(`Away team (${match.awayTeam}) score:`, '0');
    if (awayScore === null) return;
    
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);
    
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
        alert('Invalid scores!');
        return;
    }
    
    // Update match
    match.status = 'finished';
    match.finalScore = { home, away };
    
    // Save to Firebase/localStorage
    await saveMatches();
    
    loadAdminMatches();
    loadMatches(); // Refresh main matches view
    
    alert(`Match result saved!\n${match.homeTeam} ${home} - ${away} ${match.awayTeam}\n\nDon't forget to click "Process Results" to award payouts!`);
}

// Admin: Edit match result
async function editMatchResult(matchId) {
    if (!isAdmin()) return;
    
    const match = matches.find(m => m.id === matchId);
    if (!match || !match.finalScore) return;
    
    const homeScore = prompt(`Edit result for:\n${match.homeTeam} vs ${match.awayTeam}\n\nCurrent: ${match.finalScore.home} - ${match.finalScore.away}\n\nHome team (${match.homeTeam}) score:`, match.finalScore.home);
    if (homeScore === null) return;
    
    const awayScore = prompt(`Away team (${match.awayTeam}) score:`, match.finalScore.away);
    if (awayScore === null) return;
    
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);
    
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
        alert('Invalid scores!');
        return;
    }
    
    // Update match
    match.finalScore = { home, away };
    
    // Mark all predictions for this match as unprocessed so they can be recalculated
    predictions.forEach(p => {
        if (p.matchId === matchId) {
            p.processed = false;
        }
    });
    savePredictions();
    
    // Save matches
    await saveMatches();
    
    loadAdminMatches();
    loadMatches();
    
    alert(`Match result updated!\n${match.homeTeam} ${home} - ${away} ${match.awayTeam}\n\nPredictions marked as unprocessed. Click "Process Results" to recalculate payouts.`);
}

async function updateUserInStorage() {
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        await saveUsers();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

async function saveUsers() {
    if (useFirebase) {
        // Save all users to Firebase
        for (const user of users) {
            await FirebaseDB.saveUser(user);
        }
    } else {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

async function savePools() {
    if (useFirebase) {
        // Save all pools to Firebase
        for (const pool of pools) {
            await FirebaseDB.savePool(pool);
        }
    } else {
        localStorage.setItem('pools', JSON.stringify(pools));
    }
}

async function savePredictions() {
    if (useFirebase) {
        // Save all predictions to Firebase
        for (const prediction of predictions) {
            await FirebaseDB.savePrediction(prediction);
        }
    } else {
        localStorage.setItem('predictions', JSON.stringify(predictions));
    }
}

async function saveMatches() {
    if (useFirebase) {
        await FirebaseDB.saveAllMatches(matches);
    } else {
        localStorage.setItem('matches', JSON.stringify(matches));
    }
}

// Toggle disclaimer visibility
function toggleDisclaimer() {
    const content = document.getElementById('disclaimerContent');
    const arrow = document.getElementById('disclaimerArrow');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        arrow.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        arrow.classList.add('rotated');
    }
}

// Admin Functions
function updateAdminNotificationBadge() {
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
    const unreadCount = adminNotifications.filter(n => !n.read).length;
    
    const badge = document.getElementById('adminNotificationBadge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

async function loadUsersTab() {
    if (!isAdmin()) return;
    
    const usersList = document.getElementById('usersList');
    
    // Show loading state
    usersList.innerHTML = '<div style="text-align: center; padding: 40px;"><p>Loading users...</p></div>';
    
    let unreadCount = 0;
    
    // Reload users from Firebase to ensure we have the latest data
    if (useFirebase) {
        users = await FirebaseDB.getUsers();
        const adminNotifications = await FirebaseDB.getNotifications();
        unreadCount = adminNotifications.filter(n => !n.read).length;
        
        // Mark all notifications as read
        await FirebaseDB.markNotificationsRead();
        updateAdminNotificationBadge();
    } else {
        users = JSON.parse(localStorage.getItem('users')) || [];
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        unreadCount = adminNotifications.filter(n => !n.read).length;
        
        // Mark all notifications as read
        adminNotifications.forEach(n => n.read = true);
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        updateAdminNotificationBadge();
    }
    
    // Sort users by creation date (newest first)
    const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`Admin viewing ${sortedUsers.length} users (Firebase: ${useFirebase})`);
    
    usersList.innerHTML = `
        <div class="admin-stats">
            <div class="stat-card">
                <div class="stat-value">${users.length}</div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${unreadCount}</div>
                <div class="stat-label">New Registrations</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${pools.length}</div>
                <div class="stat-label">Total Pools</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${predictions.length}</div>
                <div class="stat-label">Total Predictions</div>
            </div>
        </div>
        <div class="users-table">
            <table>
                <thead>
                    <tr>
                        <th>Nickname</th>
                        <th>Email</th>
                        <th>Coins</th>
                        <th>Predictions</th>
                        <th>Accuracy</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedUsers.map(user => `
                        <tr>
                            <td>
                                <strong>${user.nickname}</strong>${user.isAdmin ? ' 👑' : ''}
                                <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                                    <button onclick="showUserActivity('${user.id}')" class="btn-secondary" style="padding: 4px 10px; background: #17a2b8; font-size: 12px;">
                                        View Activity
                                    </button>
                                    ${(currentUser && currentUser.nickname === ADMIN_NICKNAME) || user.isAdmin ? `
                                        <button onclick="toggleAdminStatus('${user.id}')" class="btn-secondary" style="padding: 4px 10px; background: ${user.isAdmin ? '#6c757d' : '#1e3c72'}; font-size: 12px;">
                                            ${user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                        </button>
                                    ` : ''}
                                </div>
                            </td>
                            <td>${user.email}</td>
                            <td>${user.coins} 🪙</td>
                            <td>${user.totalPredictions || 0}</td>
                            <td>${user.totalPredictions ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0}%</td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    renderAdminActivityViewer();
}

// Initialize app when page loads
window.onload = init;


// ============================================
// CALENDAR & TEAM FLAGS VIEW FUNCTIONS (v2.0.0)
// ============================================

// Current view state
let currentView = 'list';
let currentCalendarDate = new Date();
let selectedCalendarDate = null;
let selectedTeam = null;

// Team flag emoji mapping
const teamFlags = {
    "Mexico": "🇲🇽",
    "South Africa": "🇿🇦",
    "Korea Republic": "🇰🇷",
    "Czechia": "🇨🇿",
    "Canada": "🇨🇦",
    "Bosnia and Herzegovina": "🇧🇦",
    "USA": "🇺🇸",
    "Paraguay": "🇵🇾",
    "Qatar": "🇶🇦",
    "Switzerland": "🇨🇭",
    "Brazil": "🇧🇷",
    "Morocco": "🇲🇦",
    "Haiti": "🇭🇹",
    "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Australia": "🇦🇺",
    "Türkiye": "🇹🇷",
    "Germany": "🇩🇪",
    "Curaçao": "🇨🇼",
    "Netherlands": "🇳🇱",
    "Japan": "🇯🇵",
    "Côte d'Ivoire": "🇨🇮",
    "Ecuador": "🇪🇨",
    "Sweden": "🇸🇪",
    "Tunisia": "🇹🇳",
    "Spain": "🇪🇸",
    "Cabo Verde": "🇨🇻",
    "Belgium": "🇧🇪",
    "Egypt": "🇪🇬",
    "Saudi Arabia": "🇸🇦",
    "Uruguay": "🇺🇾",
    "IR Iran": "🇮🇷",
    "New Zealand": "🇳🇿",
    "France": "🇫🇷",
    "Senegal": "🇸🇳",
    "Austria": "🇦🇹",
    "Jordan": "🇯🇴",
    "Portugal": "🇵🇹",
    "Congo DR": "🇨🇩",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Croatia": "🇭🇷",
    "Argentina": "🇦🇷",
    "Algeria": "🇩🇿",
    "Iraq": "🇮🇶",
    "Norway": "🇳🇴",
    "Ghana": "🇬🇭",
    "Panama": "🇵🇦",
    "Colombia": "🇨🇴",
    "Uzbekistan": "🇺🇿"
};

// Switch between prediction views
function switchPredictionView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Hide all views
    document.querySelectorAll('.prediction-view').forEach(v => {
        v.classList.remove('active');
    });
    
    // Show selected view
    if (view === 'list') {
        document.getElementById('listView').classList.add('active');
    } else if (view === 'calendar') {
        document.getElementById('calendarView').classList.add('active');
        renderCalendar();
    } else if (view === 'teams') {
        document.getElementById('teamsView').classList.add('active');
        renderTeamsGrid();
    }
}

// ============================================
// CALENDAR VIEW FUNCTIONS
// ============================================

function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Update header
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Get first and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Build calendar grid
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Check if this day has matches
        const matchesOnDay = getMatchesForDate(dayDate);
        if (matchesOnDay.length > 0) {
            dayElement.classList.add('has-matches');
        }
        
        // Check if today
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if selected
        if (selectedCalendarDate && dayDate.toDateString() === selectedCalendarDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Match count
        if (matchesOnDay.length > 0) {
            const matchCount = document.createElement('div');
            matchCount.className = 'calendar-day-matches';
            matchCount.textContent = `${matchesOnDay.length} match${matchesOnDay.length > 1 ? 'es' : ''}`;
            dayElement.appendChild(matchCount);
        }
        
        // Click handler
        dayElement.onclick = () => selectCalendarDate(dayDate);
        
        calendarGrid.appendChild(dayElement);
    }
    
    // If a date is selected, show its matches
    if (selectedCalendarDate) {
        displayCalendarMatches(selectedCalendarDate);
    }
}

function navigateCalendar(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    selectedCalendarDate = null; // Clear selection when navigating
    renderCalendar();
    document.getElementById('calendarMatchesList').innerHTML = '';
}

function selectCalendarDate(date) {
    selectedCalendarDate = date;
    renderCalendar();
    displayCalendarMatches(date);
}

function getMatchesForDate(date) {
    return matches.filter(match => {
        const matchDate = new Date(match.kickoff);
        return matchDate.toDateString() === date.toDateString();
    });
}

function displayCalendarMatches(date) {
    const matchesList = document.getElementById('calendarMatchesList');
    matchesList.innerHTML = '';
    
    // Get matches for the selected date
    const matchesOnDay = getMatchesForDate(date);
    
    if (matchesOnDay.length === 0) {
        matchesList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">No matches on this date</p>';
        return;
    }
    
    // Show all matches, sorted by date
    const allMatches = [...matches].sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
    const now = new Date();
    
    // Separate into past and future matches
    const pastMatches = allMatches.filter(m => new Date(m.kickoff) < now);
    const futureMatches = allMatches.filter(m => new Date(m.kickoff) >= now);
    
    // Add section header for selected date matches
    const selectedDateHeader = document.createElement('div');
    selectedDateHeader.style.cssText = 'background: linear-gradient(135deg, #0f62fe 0%, #0043ce 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;';
    selectedDateHeader.innerHTML = `
        <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">
            📅 Matches on ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
    `;
    matchesList.appendChild(selectedDateHeader);
    
    // Display selected date matches
    matchesOnDay.forEach(match => {
        const matchCard = createMatchCard(match);
        matchCard.style.border = '3px solid #0f62fe';
        matchCard.style.boxShadow = '0 4px 16px rgba(15, 98, 254, 0.4)';
        matchesList.appendChild(matchCard);
    });
    
    // Add section for all matches
    const allMatchesHeader = document.createElement('div');
    allMatchesHeader.style.cssText = 'background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; margin: 30px 0 20px 0; text-align: center;';
    allMatchesHeader.innerHTML = `
        <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">
            📋 All Matches
        </h3>
    `;
    matchesList.appendChild(allMatchesHeader);
    
    // Display past matches
    if (pastMatches.length > 0) {
        const pastHeader = document.createElement('div');
        pastHeader.style.cssText = 'padding: 10px; margin: 15px 0 10px 0; color: rgba(255,255,255,0.7); font-weight: 600; font-size: 14px;';
        pastHeader.innerHTML = '📜 Past Matches';
        matchesList.appendChild(pastHeader);
        
        pastMatches.forEach(match => {
            const matchCard = createMatchCard(match);
            matchCard.style.opacity = '0.8';
            matchesList.appendChild(matchCard);
        });
    }
    
    // Display future matches
    if (futureMatches.length > 0) {
        const futureHeader = document.createElement('div');
        futureHeader.style.cssText = 'padding: 10px; margin: 15px 0 10px 0; color: rgba(255,255,255,0.7); font-weight: 600; font-size: 14px;';
        futureHeader.innerHTML = '🔮 Upcoming Matches';
        matchesList.appendChild(futureHeader);
        
        futureMatches.forEach(match => {
            const matchCard = createMatchCard(match);
            matchesList.appendChild(matchCard);
        });
    }
}

// ============================================
// TEAM FLAGS VIEW FUNCTIONS
// ============================================

function renderTeamsGrid() {
    const teamsGrid = document.getElementById('teamsGrid');
    teamsGrid.innerHTML = '';
    
    // Get unique teams from matches
    const teams = new Set();
    matches.forEach(match => {
        teams.add(match.homeTeam);
        teams.add(match.awayTeam);
    });
    
    // Sort teams alphabetically
    const sortedTeams = Array.from(teams).sort();
    
    // Create team cards
    sortedTeams.forEach(team => {
        const teamMatches = matches.filter(m => 
            m.homeTeam === team || m.awayTeam === team
        );
        
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        if (selectedTeam === team) {
            teamCard.classList.add('selected');
        }
        
        teamCard.innerHTML = `
            <div class="team-flag">${teamFlags[team] || '🏴'}</div>
            <div class="team-name">${team}</div>
            <div class="team-matches-count">${teamMatches.length} match${teamMatches.length > 1 ? 'es' : ''}</div>
        `;
        
        teamCard.onclick = () => selectTeam(team);
        teamsGrid.appendChild(teamCard);
    });
    
    // If a team is selected, show its matches
    if (selectedTeam) {
        displayTeamMatches(selectedTeam);
    }
}

function selectTeam(team) {
    selectedTeam = team;
    renderTeamsGrid();
    displayTeamMatches(team);
}

function displayTeamMatches(team) {
    const teamMatches = matches.filter(m => 
        m.homeTeam === team || m.awayTeam === team
    );
    
    // Sort by kickoff time
    teamMatches.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
    
    const matchesList = document.getElementById('teamMatchesList');
    matchesList.innerHTML = '';
    
    teamMatches.forEach(match => {
        const matchCard = createMatchCard(match);
        matchesList.appendChild(matchCard);
    });
}

function filterTeams() {
    const searchInput = document.getElementById('teamSearchInput').value.toLowerCase();
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const teamName = card.querySelector('.team-name').textContent.toLowerCase();
        if (teamName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Helper function to create match card (reusable for all views)
function createMatchCard(match) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    
    const matchDate = new Date(match.kickoff);
    const now = new Date();
    const isLocked = hasMatchStarted(match);
    const userPrediction = predictions.find(p => 
        p.userId === currentUser.id && p.matchId === match.id
    );
    
    // Determine if this is a historical match
    const isHistorical = match.status === 'finished' || isLocked;
    
    matchCard.innerHTML = `
        <div class="match-header">
            <span class="match-league">${match.league}</span>
            <span class="match-stage">${match.stage}</span>
        </div>
        <div class="match-teams">
            <div class="team">
                <span class="team-flag">${teamFlags[match.homeTeam] || '🏴'}</span>
                <span class="team-name">${match.homeTeam}</span>
            </div>
            <div class="match-vs">VS</div>
            <div class="team">
                <span class="team-flag">${teamFlags[match.awayTeam] || '🏴'}</span>
                <span class="team-name">${match.awayTeam}</span>
            </div>
        </div>
        <div class="match-info">
            <div class="match-time">
                <span class="time-icon">🕐</span>
                ${matchDate.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}
            </div>
            <div class="match-venue">📍 ${match.venue}</div>
        </div>
        ${userPrediction ? `
            <div class="prediction-badge ${isHistorical ? 'historical' : ''}">
                ${isHistorical ? '📜 ' : '✅ '}Predicted: ${userPrediction.homeScore}-${userPrediction.awayScore} 
                (${userPrediction.betAmount} coins)
                ${isHistorical ? ' - View Only' : ''}
            </div>
        ` : ''}
        ${!isHistorical ? `
            <button class="predict-btn" onclick="openPredictionModalById(${match.id})">
                ${userPrediction ? 'Update Prediction' : 'Make Prediction'}
            </button>
        ` : match.status === 'finished' ? `
            <div class="match-result">
                Final Score: ${match.homeScore || 0}-${match.awayScore || 0}
            </div>
        ` : `
            <div class="match-locked">
                🔒 Match Started - Predictions Locked
            </div>
        `}
    `;
    
    return matchCard;
}

// Made with Bob
