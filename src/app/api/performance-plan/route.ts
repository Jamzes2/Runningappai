import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, performancePlans } from '@/db/schema';
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

    const plans = await db.select().from(performancePlans).where(eq(performancePlans.userId, userProfile.id)).limit(1);
    
    return NextResponse.json({ plan: plans[0] || null });
  } catch (error: any) {
    console.error('Fetch plan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch plan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { raceName, raceDistance, raceDate, raceGoal, personalNotes, elevationData } = body;

    const existingPlans = await db.select().from(performancePlans).where(eq(performancePlans.userId, userProfile.id)).limit(1);
    
    let result;
    if (existingPlans.length > 0) {
      result = await db.update(performancePlans)
        .set({
          raceName,
          raceDistance,
          raceDate: new Date(raceDate),
          raceGoal,
          personalNotes,
          elevationData,
          updatedAt: new Date()
        })
        .where(eq(performancePlans.id, existingPlans[0].id))
        .returning();
    } else {
      result = await db.insert(performancePlans).values({
        userId: userProfile.id,
        raceName,
        raceDistance,
        raceDate: new Date(raceDate),
        raceGoal,
        personalNotes,
        elevationData
      }).returning();
    }

    return NextResponse.json({ success: true, plan: result[0] });
  } catch (error: any) {
    console.error('Save plan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save plan' }, { status: 500 });
  }
}
