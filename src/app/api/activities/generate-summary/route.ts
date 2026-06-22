import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq, desc, lt, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityId } = await request.json();
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    // Get the specific activity
    const activityData = await db
      .select()
      .from(activities)
      .where(eq(activities.id, activityId))
      .limit(1);

    const activity = activityData[0];
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Fetch past 5 runs for comparison
    const pastActivities = await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.userId, activity.userId!),
          lt(activities.date, activity.date)
        )
      )
      .orderBy(desc(activities.date))
      .limit(5);

    const comparisonContext = pastActivities.map(a => ({
      date: a.date.toISOString().split('T')[0],
      dist: a.distance.toFixed(2),
      pace: a.avgPace,
      hr: a.avgHr,
      cadence: a.avgCadence
    }));

    // Call the AI Coach
    const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Please analyze my run and compare it to my recent history.
THIS RUN:
- Title: ${activity.title}
- Distance: ${activity.distance.toFixed(2)}km
- Avg Pace: ${activity.avgPace}
- Avg HR: ${activity.avgHr || '--'}
- Avg Cadence: ${activity.avgCadence || '--'}
- Running Dynamics: VO: ${activity.metadata?.avgVerticalOscillation}cm, GCT: ${activity.metadata?.avgGroundContactTime}ms

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

    if (!aiResponse.ok) {
      throw new Error('AI Coach service unavailable');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    const summaryMatch = content.match(/SUMMARY:\s*([\s\S]*?)(?=RECOMMENDATION:|$)/i);
    const recommendationMatch = content.match(/RECOMMENDATION:\s*([\s\S]*)/i);

    const aiSummary = summaryMatch ? summaryMatch[1].trim() : null;
    const aiWorkoutRecommendation = recommendationMatch ? recommendationMatch[1].trim() : null;

    if (aiSummary || aiWorkoutRecommendation) {
      await db.update(activities)
        .set({ aiSummary, aiWorkoutRecommendation })
        .where(eq(activities.id, activityId));
    }

    return NextResponse.json({
      success: true,
      aiSummary,
      aiWorkoutRecommendation
    });

  } catch (error: any) {
    console.error('AI summary generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
