import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfiles = await db.select().from(users).where(eq(users.email, authUser.email!)).limit(1);
    const userProfile = userProfiles[0];
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userActivities = await db.select().from(activities).where(eq(activities.userId, userProfile.id)).orderBy(activities.date, 'desc');
    return NextResponse.json({ activities: userActivities });
  } catch (error: any) {
    console.error('Fetch activities error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch activities' }, { status: 500 });
  }
}
