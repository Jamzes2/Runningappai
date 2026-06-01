import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const { db } = await import('./src/db');
  const { users } = await import('./src/db/schema');
  const { refreshStravaToken } = await import('./src/lib/strava');

  if (!db) {
    console.error('Database not initialized. Check DATABASE_URL.');
    return;
  }

  const user = await db.query.users.findFirst();
  if (!user) {
    console.error('No user found');
    return;
  }

  console.log(`User: ${user.email}`);
  const token = await refreshStravaToken(user.id);
  
  const response = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=50',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    console.error('Strava API error:', await response.text());
    return;
  }

  const activities = await response.json();
  console.log(`Fetched ${activities.length} activities`);
  activities.forEach((a: any) => {
    console.log(`- ${a.name} | ${a.start_date} | ${a.type} | ${a.sport_type}`);
  });
}

run().catch(console.error);
