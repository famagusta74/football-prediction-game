// Sample Data Storage (using localStorage for persistence)
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let pools = JSON.parse(localStorage.getItem('pools')) || [];
let predictions = JSON.parse(localStorage.getItem('predictions')) || [];
let currentMatchId = null;

// Admin Configuration
const ADMIN_NICKNAME = "Menicos";

// Check if current user is admin
function isAdmin() {
    return currentUser && currentUser.nickname === ADMIN_NICKNAME;
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
        homeTeam: "USA",
        awayTeam: "Paraguay",
        kickoff: "2026-06-13T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group D",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 4,
        homeTeam: "Qatar",
        awayTeam: "Switzerland",
        kickoff: "2026-06-13T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "San Francisco Bay Area Stadium (San Francisco Bay Area)"
    },
    {
        id: 5,
        homeTeam: "Brazil",
        awayTeam: "Morocco",
        kickoff: "2026-06-14T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "New York/New Jersey Stadium (New Jersey)"
    },
    {
        id: 6,
        homeTeam: "Germany",
        awayTeam: "Curaçao",
        kickoff: "2026-06-14T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Houston Stadium (Houston)"
    },
    {
        id: 7,
        homeTeam: "Netherlands",
        awayTeam: "Japan",
        kickoff: "2026-06-14T23:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Dallas Stadium (Dallas)"
    },
    {
        id: 8,
        homeTeam: "Côte d'Ivoire",
        awayTeam: "Ecuador",
        kickoff: "2026-06-15T02:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "Philadelphia Stadium (Philadelphia)"
    },
    {
        id: 9,
        homeTeam: "Sweden",
        awayTeam: "Tunisia",
        kickoff: "2026-06-15T05:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "Seattle Stadium (Seattle)"
    },
    {
        id: 10,
        homeTeam: "Saudi Arabia",
        awayTeam: "Uruguay",
        kickoff: "2026-06-16T01:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Miami Stadium (Miami)"
    },
    {
        id: 11,
        homeTeam: "IR Iran",
        awayTeam: "New Zealand",
        kickoff: "2026-06-16T04:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Los Angeles Stadium (Los Angeles)"
    },
    {
        id: 12,
        homeTeam: "France",
        awayTeam: "Senegal",
        kickoff: "2026-06-16T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group I",
        venue: "New York/New Jersey Stadium (New Jersey)"
    }
];

// Initialize app
function init() {
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

function login() {
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

    const user = users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase() && u.pin === pin);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Daily coin replenishment check
        const lastLogin = new Date(user.lastLogin || 0);
        const now = new Date();
        const hoursSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60);
        
        if (hoursSinceLastLogin >= 24) {
            user.coins = Math.min(user.coins + 500, 2000); // Daily bonus, max 2000
            user.lastLogin = now.toISOString();
            saveUsers();
        }
        
        showDashboard();
        
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

function register() {
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
    saveUsers();

    alert('Account created successfully! Please login.');
    showLogin();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboardScreen').classList.remove('active');
    showLogin();
}

// Dashboard Functions
function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('registerScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.add('active');
    
    document.getElementById('userNickname').textContent = currentUser.nickname;
    document.getElementById('userCoins').textContent = currentUser.coins;
    
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
}

function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'leaderboard') {
        updateLeaderboard();
    }
}

// Matches Functions
function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    
    sampleMatches.forEach(match => {
        const userPrediction = predictions.find(p => 
            p.userId === currentUser.id && p.matchId === match.id
        );
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
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
        
        matchCard.innerHTML = `
            <div class="match-header">
                <span class="match-time">${formattedDate} - ${match.venue}</span>
                <span class="match-status status-${match.status}">${match.status.toUpperCase()}</span>
            </div>
            <div class="match-teams">
                <span class="team">${match.homeTeam}</span>
                <span class="vs">${match.status === 'finished' && match.finalScore ? `${match.finalScore.home} - ${match.finalScore.away}` : 'VS'}</span>
                <span class="team">${match.awayTeam}</span>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
                ${match.stage}
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
        `;
        
        matchesList.appendChild(matchCard);
    });
}

function openPredictionModal(match) {
    currentMatchId = match.id;
    
    document.getElementById('modalMatchTitle').textContent = 
        `${match.homeTeam} vs ${match.awayTeam}`;
    document.getElementById('homeTeamLabel').textContent = match.homeTeam;
    document.getElementById('awayTeamLabel').textContent = match.awayTeam;
    
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
            // Modify existing prediction - no additional coins needed
            existingPrediction.homeScore = homeScore;
            existingPrediction.awayScore = awayScore;
            existingPrediction.betAmount = betAmount;
            existingPrediction.modifiedAt = new Date().toISOString();
            
            savePredictions();
            
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
    updateUserInStorage();
    savePredictions();
    
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
    poolSelect.innerHTML = ''; // Remove global option - users only see their pools
    
    const userPools = pools.filter(p => p.members.includes(currentUser.id));
    
    if (userPools.length === 0) {
        poolsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">You are not in any pools yet. Create or join one!</p>';
        poolSelect.innerHTML = '<option value="">No pools yet</option>';
        return;
    }
    
    userPools.forEach(pool => {
        // Add to pools list
        const poolCard = document.createElement('div');
        poolCard.className = 'pool-card';
        
        // Generate invite link
        const inviteLink = `${window.location.origin}${window.location.pathname}?pool=${pool.code}`;
        
        poolCard.innerHTML = `
            <div class="pool-header">
                <span class="pool-name">${pool.name}</span>
                <span class="pool-code">Code: ${pool.code}</span>
            </div>
            <p style="color: #666; margin: 10px 0;">${pool.description || 'No description'}</p>
            <div class="pool-stats">
                <span>👥 ${pool.members.length} members</span>
                <span>👑 Admin: ${getUserNickname(pool.adminId)}</span>
            </div>
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
function updateLeaderboard() {
    const poolSelect = document.getElementById('poolSelect');
    const poolId = poolSelect.value;
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Check if user has any pools
    const userPools = pools.filter(p => p.members.includes(currentUser.id));
    
    let usersToRank = [];
    
    if (userPools.length === 0) {
        // User has no pools - show message
        leaderboardList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p style="font-size: 18px; margin-bottom: 20px;">📊 No Rankings Available</p>
                <p>Join or create a pool to see rankings!</p>
            </div>
        `;
        return;
    }
    
    // User has pools - show only pool rankings
    if (poolId === 'global' || !poolId) {
        // Default to first pool if global is selected or no selection
        poolSelect.value = userPools[0].id;
        const pool = userPools[0];
        usersToRank = users.filter(u => pool.members.includes(u.id));
    } else {
        const pool = pools.find(p => p.id === parseInt(poolId));
        if (pool && pool.members.includes(currentUser.id)) {
            usersToRank = users.filter(u => pool.members.includes(u.id));
        } else {
            // User not in this pool - default to first pool
            poolSelect.value = userPools[0].id;
            const firstPool = userPools[0];
            usersToRank = users.filter(u => firstPool.members.includes(u.id));
        }
    }
    
    // Sort by coins (descending)
    usersToRank.sort((a, b) => b.coins - a.coins);
    
    leaderboardList.innerHTML = '';
    
    usersToRank.forEach((user, index) => {
        const rank = index + 1;
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        
        item.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">#${rank}</span>
            <span class="leaderboard-player">${user.nickname}</span>
            <div class="leaderboard-stats">
                <div class="stat">
                    <div class="stat-label">Coins</div>
                    <div class="stat-value">${user.coins} 🪙</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Predictions</div>
                    <div class="stat-value">${user.totalPredictions || 0}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Accuracy</div>
                    <div class="stat-value">${user.totalPredictions ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0}%</div>
                </div>
            </div>
        `;
        
        leaderboardList.appendChild(item);
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
    
    sampleMatches.forEach(match => {
        if (match.status === 'finished' && match.finalScore) {
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

// Admin: Load users for management
function loadAdminUsers() {
    const usersList = document.getElementById('adminUsersList');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'admin-user-item';
        userItem.innerHTML = `
            <div>
                <strong>${user.nickname}</strong> ${user.nickname === ADMIN_NICKNAME ? '(Admin)' : ''}
                <br>
                <small>Coins: ${user.coins} 🪙 | Email: ${user.email}</small>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="resetUserCoins('${user.id}')" class="btn-secondary" style="padding: 5px 10px;">
                    Reset Coins
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
    
    user.coins = amount;
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
        alert('Cannot delete admin user!');
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
    
    sampleMatches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'admin-match-item';
        
        const matchDate = new Date(match.kickoff);
        const isFinished = match.status === 'finished';
        
        matchItem.innerHTML = `
            <div>
                <strong>${match.homeTeam} vs ${match.awayTeam}</strong>
                <br>
                <small>${matchDate.toLocaleString()} | ${match.stage}</small>
                <br>
                <small>Status: <span style="color: ${isFinished ? '#28a745' : '#ffc107'}">${match.status.toUpperCase()}</span></small>
                ${isFinished && match.finalScore ? `<br><small>Final Score: ${match.finalScore.home} - ${match.finalScore.away}</small>` : ''}
            </div>
            <div>
                ${!isFinished ? `
                    <button onclick="enterMatchResult(${match.id})" class="btn-primary" style="padding: 5px 15px;">
                        Enter Result
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
function enterMatchResult(matchId) {
    if (!isAdmin()) return;
    
    const match = sampleMatches.find(m => m.id === matchId);
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
    
    // Save to localStorage (matches are in sampleMatches array, need to persist)
    localStorage.setItem('matches', JSON.stringify(sampleMatches));
    
    loadAdminMatches();
    loadMatches(); // Refresh main matches view
    
    alert(`Match result saved!\n${match.homeTeam} ${home} - ${away} ${match.awayTeam}\n\nDon't forget to click "Process Results" to award payouts!`);
}

// Admin: Edit match result
function editMatchResult(matchId) {
    if (!isAdmin()) return;
    
    const match = sampleMatches.find(m => m.id === matchId);
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
    localStorage.setItem('matches', JSON.stringify(sampleMatches));
    
    loadAdminMatches();
    loadMatches();
    
    alert(`Match result updated!\n${match.homeTeam} ${home} - ${away} ${match.awayTeam}\n\nPredictions marked as unprocessed. Click "Process Results" to recalculate payouts.`);
}

function updateUserInStorage() {
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        saveUsers();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function savePools() {
    localStorage.setItem('pools', JSON.stringify(pools));
}

function savePredictions() {
    localStorage.setItem('predictions', JSON.stringify(predictions));
}

// Initialize app when page loads
window.onload = init;

// Made with Bob
