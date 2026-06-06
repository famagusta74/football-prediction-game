// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let database;
let isFirebaseInitialized = false;

function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded');
            return false;
        }
        
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseInitialized = true;
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Firebase Database Helper Functions
const FirebaseDB = {
    // Users
    async saveUser(user) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('users/' + user.id).set(user);
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    },
    
    async getUsers() {
        if (!isFirebaseInitialized) return [];
        try {
            const snapshot = await database.ref('users').once('value');
            const usersObj = snapshot.val() || {};
            return Object.values(usersObj);
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    },
    
    async updateUser(userId, updates) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('users/' + userId).update(updates);
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    },
    
    // Pools
    async savePool(pool) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('pools/' + pool.id).set(pool);
            return true;
        } catch (error) {
            console.error('Error saving pool:', error);
            return false;
        }
    },
    
    async getPools() {
        if (!isFirebaseInitialized) return [];
        try {
            const snapshot = await database.ref('pools').once('value');
            const poolsObj = snapshot.val() || {};
            return Object.values(poolsObj);
        } catch (error) {
            console.error('Error getting pools:', error);
            return [];
        }
    },
    
    async deletePool(poolId) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('pools/' + poolId).remove();
            return true;
        } catch (error) {
            console.error('Error deleting pool:', error);
            return false;
        }
    },
    
    // Predictions
    async savePrediction(prediction) {
        if (!isFirebaseInitialized) return false;
        try {
            await database.ref('predictions/' + prediction.id).set(prediction);
            return true;
        } catch (error) {
            console.error('Error saving prediction:', error);
            return false;
        }
    },
    
    async getPredictions() {
        if (!isFirebaseInitialized) return [];
        try {
            const snapshot = await database.ref('predictions').once('value');
            const predictionsObj = snapshot.val() || {};
            return Object.values(predictionsObj);
        } catch (error) {
            console.error('Error getting predictions:', error);
            return [];
        }
    },
    
    // Admin Notifications
    async saveNotification(notification) {
        if (!isFirebaseInitialized) return false;
        try {
            const notifId = Date.now();
            await database.ref('adminNotifications/' + notifId).set(notification);
            return true;
        } catch (error) {
            console.error('Error saving notification:', error);
            return false;
        }
    },
    
    async getNotifications() {
        if (!isFirebaseInitialized) return [];
        try {
            const snapshot = await database.ref('adminNotifications').once('value');
            const notifsObj = snapshot.val() || {};
            return Object.values(notifsObj);
        } catch (error) {
            console.error('Error getting notifications:', error);
            return [];
        }
    },
    
    async markNotificationsRead() {
        if (!isFirebaseInitialized) return false;
        try {
            const snapshot = await database.ref('adminNotifications').once('value');
            const updates = {};
            snapshot.forEach(child => {
                updates[child.key + '/read'] = true;
            });
            await database.ref('adminNotifications').update(updates);
            return true;
        } catch (error) {
            console.error('Error marking notifications read:', error);
            return false;
        }
    }
};

// Made with Bob
