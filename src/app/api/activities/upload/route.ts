import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseTcx, parseGpx, parseFit, generateRouteSvg, calculateSplits } from '@/lib/tcx';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from our DB
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let parsedActivity: any;

    if (fileName.endsWith('.tcx')) {
      const tcxData = await file.text();
      parsedActivity = parseTcx(tcxData);
    } else if (fileName.endsWith('.gpx')) {
      const gpxData = await file.text();
      parsedActivity = parseGpx(gpxData);
    } else if (fileName.endsWith('.fit')) {
      const arrayBuffer = await file.arrayBuffer();
      parsedActivity = await parseFit(arrayBuffer);
    } else {
      return NextResponse.json({ 
        error: 'Unsupported file format. Please upload .tcx, .gpx, or .fit files.' 
      }, { status: 400 });
    }

    const distanceKm = parsedActivity.totalDistanceMeters / 1000;
    const durationSeconds = parsedActivity.totalTimeSeconds;
    
    const avgPaceSeconds = distanceKm > 0 ? durationSeconds / distanceKm : 0;
    const minutes = Math.floor(avgPaceSeconds / 60);
    const seconds = Math.floor(avgPaceSeconds % 60);
    const avgPace = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const routeSvg = generateRouteSvg(parsedActivity.trackpoints);
    const splits = calculateSplits(parsedActivity.trackpoints);

    // Use a unique ID for the activity
    const activityId = `upload-${uuidv4()}`;

    await db.insert(activities).values({
      id: activityId,
      userId: userProfile.id,
      title: file.name.replace(/\.[^/.]+$/, "") || 'Imported Activity',
      distance: distanceKm,
      duration: Math.round(durationSeconds),
      avgPace: avgPace,
      avgHr: parsedActivity.avgHeartRate ? Math.round(parsedActivity.avgHeartRate) : null,
      maxHr: parsedActivity.maxHeartRate ? Math.round(parsedActivity.maxHeartRate) : null,
      avgCadence: parsedActivity.avgCadence ? Math.round(parsedActivity.avgCadence) : null,
      avgPower: parsedActivity.avgPower ? Math.round(parsedActivity.avgPower) : null,
      elevationGained: parsedActivity.elevationGained || 0, 
      routeSvg: routeSvg,
      splits: splits,
      telemetry: parsedActivity.telemetry,
      date: new Date(parsedActivity.startTime),
    });

    return NextResponse.json({
      success: true,
      message: 'Activity uploaded successfully',
      activityId: activityId,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process activity file' },
      { status: 500 }
    );
  }
}
