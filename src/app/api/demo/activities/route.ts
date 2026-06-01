import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get all activities (no auth required for demo)
    const allActivities = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.date))
      .limit(50);

    return NextResponse.json({
      activities: allActivities,
      count: allActivities.length
    });
  } catch (error: any) {
    console.error('Demo activities error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}