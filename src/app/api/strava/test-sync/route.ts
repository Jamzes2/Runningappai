import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check if we can connect to the database
    if (!db) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database not available',
        dbConfig: !!process.env.DATABASE_URL 
      });
    }

    // Check if we have any users
    const allUsers = await db.select().from(users).limit(5);
    
    let activitiesCount = 0;
    let sampleActivities = [];
    try {
      const activitiesResult = await db.select({ id: activities.id }).from(activities).limit(5);
      activitiesCount = activitiesResult.length;
      sampleActivities = activitiesResult.slice(0, 3);
    } catch (activitiesError) {
      console.log('Activities table may not exist or is empty:', activitiesError);
    }

    return NextResponse.json({
      status: 'healthy',
      message: 'Database connection successful',
      usersCount: allUsers.length,
      activitiesCount: activitiesCount,
      users: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        stravaConnected: !!u.stravaAccessToken,
        stravaAthleteId: u.stravaAthleteId
      })),
      sampleActivities: sampleActivities
    });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Database connection failed',
      error: error.toString()
    }, { status: 500 });
  }
}