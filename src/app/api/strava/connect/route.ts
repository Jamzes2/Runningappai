import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Strava Connect route hit');
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  
  console.log('Config:', { clientId, redirectUri });

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Strava API configuration missing: Client ID or Redirect URI is undefined.' }, 
      { status: 500 }
    );
  }

  // Scopes required: read (athlete details) and activity:read_all (retrieve historical workouts)
  const scope = 'read,activity:read_all';
  const approvalPrompt = 'auto';
  
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&approval_prompt=${approvalPrompt}&scope=${scope}`;

  console.log('Redirecting to:', stravaAuthUrl);
  return NextResponse.redirect(stravaAuthUrl);
}
