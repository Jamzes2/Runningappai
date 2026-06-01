import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth rejection or errors from Strava
  if (error) {
    return NextResponse.redirect(
      new URL(`/?tab=settings&sync=error&message=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?tab=settings&sync=error&message=Missing+authorization+code+from+Strava', request.url)
    );
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/?tab=settings&sync=error&message=Server+misconfiguration:+missing+Strava+secrets', request.url)
    );
  }

  try {
    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Strava token exchange failure details:', errorData);
      return NextResponse.redirect(
        new URL('/?tab=settings&sync=error&message=Strava+token+exchange+rejected', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { 
      access_token, 
      refresh_token, 
      expires_at, 
      athlete 
    } = tokenData;

    try {
      const { db } = await import('@/db');
      const { users } = await import('@/db/schema');
      const { createClient } = await import('@/lib/supabase/server');
      const { eq } = await import('drizzle-orm');
      const { syncStravaActivities } = await import('@/lib/strava');

      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const userEmail = user?.email || athlete.email || `strava-${athlete.id}@runsynergy.com`;

      const [dbUser] = await db.insert(users).values({
        email: userEmail,
        fullName: `${athlete.firstname} ${athlete.lastname}`,
        avatarUrl: athlete.profile,
        stravaAthleteId: String(athlete.id),
        stravaAccessToken: access_token,
        stravaRefreshToken: refresh_token,
        stravaTokenExpiresAt: expires_at,
      }).onConflictDoUpdate({
        target: users.email,
        set: {
          stravaAccessToken: access_token,
          stravaRefreshToken: refresh_token,
          stravaTokenExpiresAt: expires_at,
          fullName: `${athlete.firstname} ${athlete.lastname}`,
          avatarUrl: athlete.profile,
          stravaAthleteId: String(athlete.id),
        }
      }).returning();

      const userIdToSync = dbUser?.id;
      
      if (userIdToSync) {
        console.log(`[Strava OAuth Sync] Athlete linked successfully. Triggering initial sync for user ${userIdToSync}`);
        // Trigger initial sync in the background or wait for it
        try {
          await syncStravaActivities(userIdToSync);
        } catch (syncErr) {
          console.error('[Strava Callback Sync Error] Initial sync failed:', syncErr);
        }
      }
    } catch (dbErr) {
      console.error('[Strava Callback DB Error] Failed to persist tokens:', dbErr);
      // We continue even if DB fails, as the token exchange was successful
    }

    // Redirect user back to settings with a success parameter
    return NextResponse.redirect(
      new URL('/?tab=settings&sync=success', request.url)
    );
  } catch (err: any) {
    console.error('[Strava Callback Error] Exception during exchange:', err);
    return NextResponse.redirect(
      new URL(`/?tab=settings&sync=error&message=${encodeURIComponent(err.message || 'Unknown error')}`, request.url)
    );
  }
}
