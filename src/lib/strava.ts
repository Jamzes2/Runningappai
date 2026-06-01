import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function refreshStravaToken(userId: string) {
  const userProfiles = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  const userProfile = userProfiles[0];
  if (!userProfile || !userProfile.stravaRefreshToken) {
    throw new Error('No Strava refresh token found for user');
  }

  // Check if token is still valid (with 5 min buffer)
  const now = Math.floor(Date.now() / 1000);
  if (userProfile.stravaTokenExpiresAt && userProfile.stravaTokenExpiresAt > now + 300) {
    return userProfile.stravaAccessToken;
  }

  console.log(`Refreshing Strava token for user ${userId}...`);

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: userProfile.stravaRefreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Strava token refresh failed:', errorData);
    throw new Error('Failed to refresh Strava token');
  }

  const data = await response.json();

  // Update DB with new tokens
  await db.update(users)
    .set({
      stravaAccessToken: data.access_token,
      stravaRefreshToken: data.refresh_token,
      stravaTokenExpiresAt: data.expires_at,
    })
    .where(eq(users.id, userId));

  return data.access_token;
}

export async function syncStravaActivities(userId: string, options: { after?: Date, before?: Date } = {}) {
  const { after, before } = options;
  const accessToken = await refreshStravaToken(userId);
  let page = 1;
  let syncCount = 0;
  let totalFetched = 0;
  let hasMore = true;
  const MAX_PAGES = 50; 
  const PAGE_TIMEOUT = 10000; 

  console.log(`Starting Strava sync for user ${userId}... ${after ? `After: ${after.toISOString()}` : 'Full sync'}`);

  while (hasMore && page <= MAX_PAGES) {
    console.log(`Fetching page ${page}...`);
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), PAGE_TIMEOUT);
      
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=100&page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Strava API page ${page} failed:`, errorData);
        if (syncCount > 0) break;
        throw new Error(`Failed to fetch from Strava API: ${errorData.message || response.status}`);
      }

      const stravaActivities = await response.json();
      
      if (stravaActivities.length === 0) {
        hasMore = false;
        break;
      }

      totalFetched += stravaActivities.length;
      console.log(`Fetched ${stravaActivities.length} activities on page ${page}. Total so far: ${totalFetched}`);

      for (const activity of stravaActivities) {
        const activityDate = new Date(activity.start_date);
        
        // DEBUG: Log every activity we see from Strava
        console.log(`Processing activity: ${activity.name} | Date: ${activityDate.toISOString()} | Type: ${activity.type}`);

        // Date Filtering
        if (after && activityDate < after) {
          console.log(`Reached activity date ${activityDate.toISOString()} which is before the 'after' date. Stopping sync.`);
          hasMore = false;
          break;
        }
        if (before && activityDate > before) {
          console.log(`Skipping activity ${activity.name} as it is newer than 'before' date ${before.toISOString()}`);
          continue; 
        }

        const avgPaceSeconds = activity.distance > 0 ? (activity.moving_time / activity.distance) * 1000 : 0;
        const minutes = Math.floor(avgPaceSeconds / 60);
        const seconds = Math.floor(avgPaceSeconds % 60);
        const avgPace = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        try {
          await db.insert(activities).values({
            id: activity.id.toString(),
            userId: userId,
            title: activity.name,
            distance: activity.distance / 1000,
            duration: activity.moving_time,
            avgPace: avgPace,
            avgHr: activity.average_heartrate ? Math.round(activity.average_heartrate) : null,
            maxHr: activity.max_heartrate ? Math.round(activity.max_heartrate) : null,
            avgPower: activity.average_watts ? Math.round(activity.average_watts) : null,
            elevationGained: activity.total_elevation_gain || null,
            date: activityDate,
          }).onConflictDoUpdate({
            target: [activities.id],
            set: {
              title: activity.name,
              distance: activity.distance / 1000,
              duration: activity.moving_time,
              avgPace,
              avgHr: activity.average_heartrate ? Math.round(activity.average_heartrate) : null,
              maxHr: activity.max_heartrate ? Math.round(activity.max_heartrate) : null,
              avgPower: activity.average_watts ? Math.round(activity.average_watts) : null,
              elevationGained: activity.total_elevation_gain || null,
            }
          });
          syncCount++;
        } catch (err) {
          console.error(`Error saving activity ${activity.id}:`, err);
        }
      }

      if (stravaActivities.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (err: any) {
      console.error(`Error fetching page ${page}:`, err.message);
      if (syncCount === 0) throw err;
      break;
    }
  }

  console.log(`Sync complete: ${syncCount} activities synced out of ${totalFetched} fetched`);
  return {
    syncCount,
    totalFetched
  };
}
