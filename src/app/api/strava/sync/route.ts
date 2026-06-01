import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { syncStravaActivities } from '@/lib/strava';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from our DB to get their internal ID
    const userProfiles = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);
    
    const userProfile = userProfiles[0];

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found.' },
        { status: 404 }
      );
    }

    if (!userProfile.stravaRefreshToken) {
      return NextResponse.json(
        { error: 'Strava not connected. Please authorize Strava first.' },
        { status: 400 }
      );
    }

    const result = await syncStravaActivities(userProfile.id);

    return NextResponse.json({
      success: true,
      message: `Synced ${result.syncCount} running activities`,
      activitiesCount: result.totalFetched,
    });
  } catch (error: any) {
    console.error('Sync activities error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync activities' },
      { status: 500 }
    );
  }
}
