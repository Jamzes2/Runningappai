import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allUsers = await db.select().from(users);
    
    const userWithStrava = await db
      .select()
      .from(users)
      .where(eq(users.stravaAthleteId, '50614694'))
      .limit(1);
    
    return NextResponse.json({
      allUsers: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        stravaAthleteId: u.stravaAthleteId,
        stravaConnected: !!u.stravaAccessToken,
        stravaRefreshToken: !!u.stravaRefreshToken,
        stravaTokenExpiresAt: u.stravaTokenExpiresAt,
      })),
      userWithStrava: userWithStrava[0] ? {
        id: userWithStrava[0].id,
        email: userWithStrava[0].email,
        stravaAthleteId: userWithStrava[0].stravaAthleteId,
        stravaConnected: !!userWithStrava[0].stravaAccessToken,
        stravaRefreshToken: !!userWithStrava[0].stravaRefreshToken,
        stravaTokenExpiresAt: userWithStrava[0].stravaTokenExpiresAt,
      } : null,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to fetch users'
    }, { status: 500 });
  }
}