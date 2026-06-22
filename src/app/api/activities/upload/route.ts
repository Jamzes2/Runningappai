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
      avgTemp: parsedActivity.avgTemp ? Math.round(parsedActivity.avgTemp) : null,
      elevationGained: parsedActivity.elevationGained || 0, 
      routeSvg: routeSvg,
      splits: splits,
      telemetry: parsedActivity.telemetry,
      metadata: parsedActivity.metadata,
      date: new Date(parsedActivity.startTime),
    });

    // Generate AI Session Intelligence
    try {
      // Fetch some context (past 5 runs) for comparison
      const pastActivities = await db
        .select()
        .from(activities)
        .where(eq(activities.userId, userProfile.id))
        .orderBy(activities.date)
        .limit(5);

      const comparisonContext = pastActivities.map(a => ({
        date: a.date.toISOString().split('T')[0],
        dist: a.distance.toFixed(2),
        pace: a.avgPace,
        hr: a.avgHr,
        cadence: a.avgCadence
      }));

      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please analyze my new run and compare it to my recent history.
NEW RUN:
- Distance: ${parsedActivity.totalDistanceMeters / 1000}km
- Avg Pace: ${parsedActivity.avgPace || '--'}
- Avg HR: ${parsedActivity.avgHeartRate || '--'}
- Avg Cadence: ${parsedActivity.avgCadence || '--'}
- Running Dynamics: VO: ${parsedActivity.metadata?.avgVerticalOscillation}cm, GCT: ${parsedActivity.metadata?.avgGroundContactTime}ms

RECENT HISTORY:
${JSON.stringify(comparisonContext, null, 2)}

Provide two specific parts in your response:
1. SUMMARY: A personalized analysis of this run, how it compares to my others, and specific biomechanical feedback.
2. RECOMMENDATION: One specific adaptive training suggestion for my next workout.

Format your response exactly as:
SUMMARY: [analysis text]
RECOMMENDATION: [workout text]`
            }
          ]
        })
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || "";
        
        const summaryMatch = content.match(/SUMMARY:\s*([\s\S]*?)(?=RECOMMENDATION:|$)/i);
        const recommendationMatch = content.match(/RECOMMENDATION:\s*([\s\S]*)/i);

        if (summaryMatch || recommendationMatch) {
          await db.update(activities)
            .set({
              aiSummary: summaryMatch ? summaryMatch[1].trim() : null,
              aiWorkoutRecommendation: recommendationMatch ? recommendationMatch[1].trim() : null
            })
            .where(eq(activities.id, activityId));
        }
      }
    } catch (aiErr) {
      console.error('Failed to generate AI intelligence:', aiErr);
    }

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
