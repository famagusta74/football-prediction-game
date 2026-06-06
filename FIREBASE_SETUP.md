# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "football-prediction-game")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In Firebase Console, click "Realtime Database" in left menu
2. Click "Create Database"
3. Choose location (e.g., "United States (us-central1)")
4. Start in **Test mode** for now (we'll secure it later)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register app with nickname (e.g., "Football Prediction Game")
6. Copy the `firebaseConfig` object

## Step 4: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

## Step 5: Configure Database Rules (Important!)

1. In Firebase Console, go to "Realtime Database"
2. Click "Rules" tab
3. Replace with these rules:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true,
      "$userId": {
        ".validate": "newData.hasChildren(['id', 'nickname', 'email', 'pin', 'coins'])"
      }
    },
    "pools": {
      ".read": true,
      ".write": true
    },
    "predictions": {
      ".read": true,
      ".write": true
    },
    "adminNotifications": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Click "Publish"

**Note:** These are permissive rules for development. For production, implement proper authentication and security rules.

## Step 6: Test the Integration

1. Open your app in a browser
2. Open browser console (F12)
3. Look for "Firebase initialized successfully"
4. Create a new user account
5. Check Firebase Console > Realtime Database to see the data

## Step 7: Migrate Existing Data (Optional)

If you have existing users in localStorage, you can migrate them:

1. Open browser console on your app
2. Run this code:

```javascript
// Get existing localStorage data
const localUsers = JSON.parse(localStorage.getItem('users')) || [];
const localPools = JSON.parse(localStorage.getItem('pools')) || [];
const localPredictions = JSON.parse(localStorage.getItem('predictions')) || [];

// Migrate to Firebase
localUsers.forEach(user => FirebaseDB.saveUser(user));
localPools.forEach(pool => FirebaseDB.savePool(pool));
localPredictions.forEach(pred => FirebaseDB.savePrediction(pred));

console.log('Migration complete!');
```

## Troubleshooting

### "Firebase SDK not loaded"
- Check that Firebase scripts are loading in index.html
- Check browser console for network errors
- Verify Firebase CDN URLs are correct

### "Permission denied"
- Check Database Rules in Firebase Console
- Ensure rules allow read/write access
- Verify databaseURL in config is correct

### Data not syncing
- Check browser console for errors
- Verify Firebase config values are correct
- Check Firebase Console > Realtime Database for data

## Security Best Practices (For Production)

1. **Enable Authentication:**
   - Use Firebase Authentication
   - Implement proper user authentication
   - Update database rules to require authentication

2. **Secure Database Rules:**
   ```json
   {
     "rules": {
       "users": {
         "$userId": {
           ".read": "auth != null",
           ".write": "auth != null && auth.uid === $userId"
         }
       }
     }
   }
   ```

3. **Environment Variables:**
   - Don't commit Firebase config to public repos
   - Use environment variables for sensitive data
   - Consider using Firebase App Check

## Next Steps

After Firebase is set up:
1. Test user registration across devices
2. Verify data syncs in real-time
3. Test admin features
4. Monitor Firebase usage in console
5. Set up billing alerts (Firebase has free tier)

## Support

If you encounter issues:
- Check [Firebase Documentation](https://firebase.google.com/docs)
- Review browser console for errors
- Check Firebase Console for service status