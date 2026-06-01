import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const checks = {
      api: 'operational',
      supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ configured' : '✗ missing',
      stravaAuth: process.env.STRAVA_CLIENT_ID ? '✓ configured' : '✗ missing',
      openrouter: process.env.OPENROUTER_API_KEY ? '✓ configured' : '✗ missing',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      status: 'healthy',
      message: 'Backend API is operational',
      checks,
      endpoints: {
        auth: '/api/auth/strava - Strava OAuth redirect',
        authCallback: '/api/auth/strava/callback - Strava OAuth callback',
        coach: '/api/ai/coach - AI Coach endpoint',
        health: '/api/health - This endpoint',
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Health check failed'
    }, { status: 500 });
  }
}
