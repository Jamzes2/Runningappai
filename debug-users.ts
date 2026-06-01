import { db } from './src/db';
import { users, activities } from './src/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debug() {
  const { db: dbLive } = await import('./src/db');
  if (!dbLive) return;

  const allUsers = await dbLive.select().from(users);
  for (const u of allUsers) {
    console.log(`User: ${u.email}`);
    const acts = await dbLive.select().from(activities)
      .where(eq(activities.userId, u.id))
      .orderBy(activities.date); // Oldest first to see if I'm getting the latest at the end
    
    console.log(`Total Activities: ${acts.length}`);
    if (acts.length > 0) {
      console.log(`Latest 5 in DB:`);
      acts.slice(-5).forEach(a => console.log(`  - ${a.title} (${a.date})`));
    }
  }
}

debug().then(() => process.exit(0));
