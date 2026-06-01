import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { syncStravaActivities } from '@/lib/strava';

export async function POST(request: NextRequest) {
  try {
    // For testing purposes, get the user with Strava athlete ID 50614694
    const userProfiles = await db
      .select()
      .from(users)
      .where(eq(users.stravaAthleteId, '50614694'))
      .limit(1);
    
    const userProfile = userProfiles[0];

    if (!userProfile) {
      return NextResponse.json(
        { error: 'No user with Strava credentials found' },
        { status: 404 }
      );
    }

    console.log(`Force syncing for user ${userProfile.email} (${userProfile.id})...`);

    const result = await syncStravaActivities(userProfile.id);

    return NextResponse.json({
      success: true,
      message: `Force synced ${result.syncCount} running activities for ${userProfile.email}`,
      activitiesCount: result.totalFetched,
      userId: userProfile.id,
      userEmail: userProfile.email,
    });
  } catch (error: any) {
    console.error('Force sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to force sync activities' },
      { status: 500 }
    );
  }
}