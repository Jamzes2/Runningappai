import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { syncStravaActivities } from '@/lib/strava';

/**
 * Demo sync endpoint - syncs activities for the first user in the database
 * This allows testing the sync without authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { after, before } = body;

    // Get the first user (for demo purposes)
    const allUsers = await db
      .select()
      .from(users)
      .limit(1);

    const userProfile = allUsers[0];

    if (!userProfile) {
      return NextResponse.json(
        { error: 'No users found in database' },
        { status: 404 }
      );
    }

    if (!userProfile.stravaRefreshToken) {
      return NextResponse.json(
        { error: 'User has no Strava connection' },
        { status: 400 }
      );
    }

    const options: { after?: Date, before?: Date } = {};
    if (after) options.after = new Date(after);
    if (before) options.before = new Date(before);

    console.log(`Demo sync: Starting sync for ${userProfile.email} ${options.after ? `after ${options.after}` : ''}`);
    const result = await syncStravaActivities(userProfile.id, options);

    return NextResponse.json({
      success: true,
      message: `✅ Synced ${result.syncCount} activities (out of ${result.totalFetched} fetched)`,
      detail: `Synced activities for ${userProfile.email}`,
      activitiesCount: result.syncCount,
      totalFetched: result.totalFetched,
    });
  } catch (error: any) {
    console.error('Demo sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync activities' },
      { status: 500 }
    );
  }
}
