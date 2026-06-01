import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './src/db';
import { users } from './src/db/schema';
import { refreshStravaToken } from './src/lib/strava';

async function debugSync() {
  console.log('Starting debugSync...');
  const { db: dbLive } = await import('./src/db');
  if (!dbLive) {
     console.error('DB Live is null');
     return;
  }

  const [user] = await dbLive.select().from(users).limit(1);
  if (!user) {
    console.error('No user found in DB');
    return;
  }

  console.log(`Debugging sync for ${user.email}...`);
  try {
    const accessToken = await refreshStravaToken(user.id);
    console.log('Token refreshed successfully');

    console.log('Fetching first page of activities...');
    const response = await fetch(
      'https://www.strava.com/api/v3/athlete/activities?per_page=10',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Strava API error status:', response.status);
      console.error('Strava API error body:', await response.json());
      return;
    }

    const activities = await response.json();
    console.log(`Found ${activities.length} raw activities.`);
    activities.forEach((a: any) => {
      console.log(`- ${a.name} | Date: ${a.start_date} | Type: ${a.type} | SportType: ${a.sport_type}`);
    });
  } catch (err) {
    console.error('Error during debugSync:', err);
  }
}

debugSync().then(() => {
    console.log('Done.');
    process.exit(0);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
