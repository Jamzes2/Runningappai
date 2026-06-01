# 🏃 Strava Integration Setup Guide

## ✅ What's Been Set Up

### 1. **API Endpoints Created**
- **`/api/auth/strava`** - OAuth redirect (already existed)
- **`/api/auth/strava/callback`** - Token exchange & user persistence (already existed)  
- **`/api/strava/sync`** - NEW: Fetch and sync your real activities from Strava
- **`/api/strava/status`** - NEW: Check Strava connection status

### 2. **Settings Page Created**
- Located in the **SETTINGS** tab on your dashboard
- Shows Strava connection status
- One-click button to connect Strava
- Sync button to fetch all your running activities
- Displays last sync timestamp

### 3. **Database Setup**
Your activities table is configured with columns for:
- Activity ID, title, distance, duration
- Average pace, heart rate (avg/max)
- Elevation gain
- Date of activity
- AI-generated summaries & recommendations (future use)

## 🚀 How to Use Strava Integration

### Step 1: Navigate to Settings
1. Open your dashboard at `http://localhost:3002`
2. Click the **SETTINGS** tab
3. Look for "STRAVA INTEGRATION" section

### Step 2: Connect Your Strava Account
1. Click the **"CONNECT STRAVA"** button
2. You'll be redirected to Strava's login page
3. Authorize the app to access your activities (scopes: read_all, activity:read_all)
4. You'll be redirected back to your app
5. The button will change to **"SYNC ACTIVITIES"**

### Step 3: Sync Your Activities
1. Click **"SYNC ACTIVITIES"**
2. The app will fetch your last 30 running activities from Strava
3. All activities are saved to your database
4. You'll see a success message with the count of synced activities

## ⚠️ Important Configuration Notes

### Current Setup
```
STRAVA_REDIRECT_URI=http://localhost:3002/api/auth/strava/callback
```
- **Dev Port**: 3002 (your current setup)
- **Production**: Change this to your production domain

### Update Strava Developer App Settings
If you haven't already, update your Strava app settings:
1. Go to https://www.strava.com/settings/apps
2. Find your app (should be "RunSynergy" or your app name)
3. Update **Authorization callback domain** to: `localhost:3002` (for dev) or your production domain
4. Make sure the **Redirect URI** matches exactly:
   - Dev: `http://localhost:3002/api/auth/strava/callback`
   - Prod: `https://yourdomain.com/api/auth/strava/callback`

## 📊 What Data You Get

After syncing, your dashboard will have access to:
- ✅ Running activities only (other activity types are filtered out)
- ✅ Distance (converted to km from Strava's meters)
- ✅ Duration (in seconds, displayed as formatted time)
- ✅ Average pace (/km)
- ✅ Average and max heart rate
- ✅ Elevation gain
- ✅ Activity date/time

## 🔄 Next Steps

After syncing your Strava activities:
1. Check the **ACTIVITIES** tab to see your synced runs
2. Go to **DASHBOARD** to see updated stats with real data
3. Use the **AI COACH** to get personalized training recommendations based on your actual runs

## 🐛 Troubleshooting

### "Strava not connected" error
- Make sure you've gone through the OAuth flow
- Check that your Strava app settings have the correct redirect URI
- Refresh the page and try again

### Activities not syncing
- Ensure you're connected to Strava first
- Check that you have running activities in your Strava account
- Check browser console for detailed error messages

### Database queries failing
- Verify DATABASE_URL is correctly set in .env.local
- Ensure Supabase is accessible
- Check that the database tables exist (users, activities, coach_conversations)

## 📝 Technical Details

### API Response Examples

**GET /api/strava/status**
```json
{
  "connected": true,
  "lastSync": "2026-05-30T10:30:00Z"
}
```

**POST /api/strava/sync**
```json
{
  "success": true,
  "message": "Synced 12 running activities",
  "activitiesCount": 15
}
```

## 🎯 Future Enhancements

Planned features:
- [ ] Auto-sync on schedule (every day/hour)
- [ ] Garmin and Apple Watch integration
- [ ] AI workout analysis and recommendations
- [ ] Training load and recovery metrics
- [ ] Route visualization on map
