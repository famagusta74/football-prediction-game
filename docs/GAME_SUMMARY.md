# Football Prediction Game - Summary

## Overview
The Football Prediction Game is a browser-based social game built around FIFA World Cup 2026 match predictions. Players create accounts, predict match scores, place virtual coin bets, join private pools with friends, and compete on leaderboards.

## What the Game Does
Players use virtual coins to predict the outcomes of scheduled World Cup matches. The game rewards prediction accuracy and creates friendly competition through private groups and ranking tables.

## Core Gameplay
- Users register with a nickname, email, and 4-digit PIN.
- Each new player starts with 1000 virtual coins.
- Players choose upcoming matches and submit predicted scores.
- Each prediction includes a coin bet.
- Exact score predictions return 5x the bet.
- Correct match result predictions return 2x the bet.
- Incorrect predictions lose the bet amount.
- A daily bonus can replenish coins by 100, up to a maximum balance of 2000.

## Social Features
- Users can create private pools.
- Friends can join pools using a code or invite link.
- Pool members compete against each other.
- The game also includes a global leaderboard.

## Admin Features
A special admin user, identified as Menicos, has additional controls:
- Enter and edit final match results
- Process finished matches
- Distribute payouts
- View all users
- Receive notifications when new users register

## Data and Technology
The application is a web app built with:
- HTML
- CSS
- Vanilla JavaScript
- Firebase Realtime Database
- localStorage fallback support

It runs entirely in the browser and supports cross-device synchronization when Firebase is available.

## Match Content
The game uses FIFA World Cup 2026 fixtures, including group-stage matches and venue information. Match data is stored in the application and can also be managed through Firebase.

## Rules and Positioning
This is a friendly entertainment platform only:
- No real money is involved
- Virtual coins have no cash value
- No gambling or wagering rights are created
- The purpose is fun, community, and friendly competition

## Documentation Available
The project already includes a documentation portal and detailed documents covering:
- Application definition
- Technical specification
- Source code documentation

This summary document provides a concise, non-technical overview of the game for quick reference.

## Match Locking and Result Control
The game now follows a stricter match lifecycle for predictions and result handling:

- A match is available for prediction only before its kickoff time
- Once kickoff time passes, the match is locked automatically
- Locked matches are frozen and users can no longer create or modify predictions
- The match remains frozen until an admin enters the final score
- After the final score is entered, an admin must process results so payouts and statistics are redistributed correctly

This means prediction access is time-based, while result entry and payout processing remain admin-controlled.

## Admin Management
The game is no longer limited to a single hardcoded admin identity, but promotion control starts with the primary admin.

- The original primary admin remains Menicos
- Only Menicos can promote a regular user to admin for the first time
- Once a user has admin access, that user receives the same operational capabilities as other admins
- Admin users can remove admin access from other users
- Any user marked as admin can manage match results, process payouts, and access user-management capabilities
- The primary admin should remain protected as the permanent first admin account

## Coin Activity Audit Trail
The game now includes an admin-facing coin activity history for each user.

- Admins can open a user record and view coin activity in detail through the activity viewer
- The activity log shows when coins were deducted for predictions
- The activity log shows when payouts were added after result processing
- The activity log also records daily bonuses and admin coin resets
- Each entry includes the amount, timestamp, resulting balance, and related match context when available

This makes it easier to investigate unexpected balance changes and understand exactly how a user's coin total was built over time.

## Development and Release Notes
The current project documentation only partially covers release workflow.

### What is already documented
- GitHub Pages deployment and push steps are documented in [`README.md`](README.md) under the deployment section.
- The technical documentation confirms the app is hosted on GitHub Pages in [`docs/TECHNICAL_SPECIFICATION.md`](docs/TECHNICAL_SPECIFICATION.md).

### What is visible in the codebase
When a new version is released, the version number currently appears in multiple places and should be updated consistently. The current release is version v1.7.0:
- Application constant in [`app.js:2`](app.js:2)
- Login screen version label in [`index.html:21`](index.html:21)
- Dashboard version badge in [`index.html:146`](index.html:146)
- Documentation portal version badge in [`docs/index.html:190`](docs/index.html:190)
- There are also older visible version labels in [`index.html:114`](index.html:114) and [`index.html:132`](index.html:132) that still show an outdated version string.

### What is not clearly documented yet
The following process is not yet explicitly documented as a formal maintenance rule:
- Every change to the game should include a version number update
- Every visible version label in the interface should be updated together
- Changes should then be committed and pushed from the Mac desktop GitHub workflow

### Recommended release checklist
For each change made to the game:
1. Update the internal app version in [`app.js:2`](app.js:2)
2. Update all visible version labels in [`index.html:21`](index.html:21), [`index.html:146`](index.html:146), [`index.html:114`](index.html:114), [`index.html:132`](index.html:132), and [`docs/index.html:190`](docs/index.html:190)
3. Commit the change with the version in the commit message
4. Push the latest code to GitHub using the Mac desktop Git workflow already used for the project
5. Verify the GitHub Pages deployment after push

This should ideally be added as a dedicated maintenance or release procedure in the main project documentation.

## Latest Update Summary
Version v1.7.0 includes the latest admin activity-viewer improvements and coin-balance clarification changes:

- The admin user activity viewer now opens in a dedicated modal for clearer visibility
- Daily login bonus has been reduced to 100 coins
- The prediction page includes a reminder that users can log in every day to win coins
- Match locking, admin promotion controls, and coin audit history remain part of the current release baseline