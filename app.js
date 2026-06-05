// Sample Data Storage (using localStorage for persistence)
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let pools = JSON.parse(localStorage.getItem('pools')) || [];
let predictions = JSON.parse(localStorage.getItem('predictions')) || [];
let currentMatchId = null;

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
        homeTeam: "Canada",
        awayTeam: "Bosnia and Herzegovina",
        kickoff: "2026-06-12T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group B",
        venue: "Toronto Stadium (Toronto)"
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
        homeTeam: "England",
        awayTeam: "Brazil",
        kickoff: "2026-06-14T20:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group C",
        venue: "MetLife Stadium (New York)"
    },
    {
        id: 5,
        homeTeam: "Germany",
        awayTeam: "Argentina",
        kickoff: "2026-06-15T18:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group E",
        venue: "AT&T Stadium (Dallas)"
    },
    {
        id: 6,
        homeTeam: "France",
        awayTeam: "Spain",
        kickoff: "2026-06-16T21:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group F",
        venue: "SoFi Stadium (Los Angeles)"
    },
    {
        id: 7,
        homeTeam: "Portugal",
        awayTeam: "Netherlands",
        kickoff: "2026-06-17T19:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group G",
        venue: "Arrowhead Stadium (Kansas City)"
    },
    {
        id: 8,
        homeTeam: "Belgium",
        awayTeam: "Italy",
        kickoff: "2026-06-18T22:00:00",
        status: "upcoming",
        league: "FIFA World Cup 2026",
        stage: "First Stage - Group H",
        venue: "Mercedes-Benz Stadium (Atlanta)"
    }
];

// Initialize app
function init() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
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
        
        matchCard.innerHTML = `
            <div class="match-header">
                <span class="match-time">${formattedDate} - ${match.venue}</span>
                <span class="match-status status-${match.status}">${match.status.toUpperCase()}</span>
            </div>
            <div class="match-teams">
                <span class="team">${match.homeTeam}</span>
                <span class="vs">VS</span>
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
    
    if (currentUser.coins < betAmount) {
        alert('Insufficient coins!');
        return;
    }
    
    // Remove existing prediction if any
    predictions = predictions.filter(p => 
        !(p.userId === currentUser.id && p.matchId === currentMatchId)
    );
    
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
    
    // Deduct coins
    currentUser.coins -= betAmount;
    currentUser.totalPredictions = (currentUser.totalPredictions || 0) + 1;
    updateUserInStorage();
    savePredictions();
    
    document.getElementById('userCoins').textContent = currentUser.coins;
    
    closePredictionModal();
    loadMatches();
    
    alert('Prediction submitted successfully!');
}

// Pools Functions
function loadPools() {
    const poolsList = document.getElementById('poolsList');
    const poolSelect = document.getElementById('poolSelect');
    
    poolsList.innerHTML = '';
    poolSelect.innerHTML = '<option value="global">Global</option>';
    
    const userPools = pools.filter(p => p.members.includes(currentUser.id));
    
    if (userPools.length === 0) {
        poolsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">You are not in any pools yet. Create or join one!</p>';
        return;
    }
    
    userPools.forEach(pool => {
        // Add to pools list
        const poolCard = document.createElement('div');
        poolCard.className = 'pool-card';
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
    
    alert(`Pool created! Share this code with friends: ${poolCode}`);
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
    const poolId = document.getElementById('poolSelect').value;
    const leaderboardList = document.getElementById('leaderboardList');
    
    let usersToRank = [];
    
    if (poolId === 'global') {
        usersToRank = [...users];
    } else {
        const pool = pools.find(p => p.id === parseInt(poolId));
        if (pool) {
            usersToRank = users.filter(u => pool.members.includes(u.id));
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
