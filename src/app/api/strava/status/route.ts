import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ connected: false }, { status: 200 });
    }

    const userProfiles = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);
    
    const userProfile = userProfiles[0];

    return NextResponse.json({
      connected: !!userProfile?.stravaAccessToken,
      lastSync: userProfile?.stravaTokenExpiresAt ? new Date(userProfile.stravaTokenExpiresAt * 1000) : null,
    });
  } catch (error) {
    return NextResponse.json({ connected: false }, { status: 200 });
  }
}
