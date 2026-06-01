import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const { db } = await import('./src/db');
  const { users } = await import('./src/db/schema');
  const { syncStravaActivities } = await import('./src/lib/strava');

  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const user = await db.query.users.findFirst();
  if (!user) {
    console.error('No user found');
    return;
  }

  console.log(`Starting sync for ${user.email}...`);
  try {
    const result = await syncStravaActivities(user.id);
    console.log('Sync result:', result);
  } catch (err) {
    console.error('Sync failed with error:', err);
  }
}

run().catch(console.error);
