import { db } from '@/db';
import { activities, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function addTodayRun() {
  try {
    const user = (await db.select().from(users).limit(1))[0];
    if (!user) throw new Error('No user found');

    const today = new Date();
    today.setUTCHours(10, 0, 0, 0); // Set to 10 AM today

    const activityId = `manual_${Date.now()}`;
    
    await db.insert(activities).values({
      id: activityId,
      userId: user.id,
      title: 'Long Run',
      distance: 20.0,
      duration: 6300, // ~1h 45m
      avgPace: '5:15',
      avgHr: 155,
      maxHr: 175,
      elevationGained: 100,
      date: today,
    });

    console.log('✅ Successfully added today\'s 20km long run!');
  } catch (err) {
    console.error('Error adding run:', err);
  }
}

addTodayRun();
