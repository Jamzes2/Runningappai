import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, activities, performancePlans, coachConversations } from '@/db/schema';
import { eq, desc, limit } from 'drizzle-orm';

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

    // Calculate race day for prompt
    const dateObj = new Date(raceDate);
    const raceDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Gather context: Activities
    const recentActivities = await db.select()
      .from(activities)
      .where(eq(activities.userId, userProfile.id))
      .orderBy(desc(activities.date))
      .limit(10);

    // Gather context: AI Chats
    const recentChats = await db.select()
      .from(coachConversations)
      .where(eq(coachConversations.userId, userProfile.id))
      .orderBy(desc(coachConversations.createdAt))
      .limit(10);

    // Prepare prompt for Gemini
    const trainingContext = {
      athlete: userProfile.fullName,
      recentActivities: recentActivities.map(a => ({
        date: a.date,
        distance: a.distance,
        pace: a.avgPace,
        hr: a.avgHr,
        cadence: a.avgCadence,
        title: a.title
      })),
      recentCoachAdvice: recentChats.map(c => `${c.sender}: ${c.message}`).join('\n'),
      raceGoal: {
        name: raceName,
        distance: raceDistance,
        date: raceDate,
        day: raceDay,
        goal: raceGoal,
        notes: personalNotes,
        elevation: elevationData ? "Course elevation data is provided. Analyze the profile to include specific hill/climbing sessions." : "No course-specific elevation data provided."
      }
    };

    const prompt = `
      You are an elite running coach and performance scientist. 
      Generate a COMPREHENSIVE DAY-BY-DAY training schedule for an athlete leading up to their race.
      
      ATHLETE CONTEXT:
      - Name: ${trainingContext.athlete}
      - Recent Runs: ${JSON.stringify(trainingContext.recentActivities)}
      - Recent Coach Advice: ${trainingContext.recentCoachAdvice}
      
      RACE GOAL:
      - Event: ${raceName} (${raceDistance})
      - Date: ${raceDate} (${raceDay}) - IMPORTANT: THE RACE IS ON A ${raceDay.toUpperCase()}.
      - Today's Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      - Target: ${raceGoal}
      - Athlete Notes: ${personalNotes}
      - Course Context: ${trainingContext.raceGoal.elevation}
      ${elevationData ? `- Elevation Profile (sampled): ${JSON.stringify(elevationData.sampledProfile)}` : ''}
      
      INSTRUCTIONS:
      1. Analyze their current fitness (pace, HR, volume) from recent runs to set appropriate baseline intensities.
      2. MANDATORY: Provide a day-by-day calendar starting from TODAY until the RACE DATE (${raceDate}).
      3. The plan MUST conclude with the race itself on ${raceDay}, ${raceDate}.
      4. Use a clear table format for the daily schedule.
      5. For each day, specify:
         - Workout Type (e.g., Interval, Tempo, Easy, Long, Rest)
         - Duration/Distance
         - Target Intensity (Pace or HR Zone)
         - Specific instructions (e.g., "4x800m at 5k pace with 90s rest")
      6. If elevation data was provided, ensure the plan includes climbing or hill repeats proportional to the race difficulty.
      7. Include 2-3 sessions of Strength Training per week.
      8. Format the output using clean HTML (<h3>, <table>, <tr>, <td>, <ul>, <li>, <strong>). 
      9. Ensure the table has borders or clear spacing for readability.
    `;

    // Call OpenRouter/Gemini
    let generatedPlan;
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://runsynergy.com',
          'X-Title': 'RunSynergy Analytics',
        },
        body: JSON.stringify({
          model: 'google/gemini-3.5-flash',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI API error: ${errorText}`);
        generatedPlan = getFallbackPlan(raceName, raceGoal);
      } else {
        const aiData = await response.json();
        generatedPlan = aiData.choices?.[0]?.message?.content || getFallbackPlan(raceName, raceGoal);
      }
    } catch (apiErr) {
      console.error('API Call failed:', apiErr);
      generatedPlan = getFallbackPlan(raceName, raceGoal);
    }

    // Save generated plan
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
          generatedPlan,
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
        generatedPlan
      }).returning();
    }

    return NextResponse.json({ success: true, plan: result[0] });
  } catch (error: any) {
    console.error('Generate plan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate plan' }, { status: 500 });
  }
}

function getFallbackPlan(raceName: string, raceGoal: string) {
  return `
    <h3>Training Strategy for ${raceName}</h3>
    <p>We are currently experiencing high demand on our AI synthesis engine. While we finalize your elite telemetry analysis, here is your baseline high-performance weekly schedule to hit your <strong>${raceGoal}</strong> target:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: rgba(255,255,255,0.05);">
          <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">Day</th>
          <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">Workout</th>
          <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: left;">Intensity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Monday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Active Recovery / Mobility</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Very Low</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Tuesday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Intervals: 8x400m</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">5k Pace</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Wednesday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Easy Aerobic (45-60 min)</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Zone 2</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Thursday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Tempo Run: 20 min Steady</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Half Marathon Pace</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Friday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Strength Training (Lower Body)</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Moderate</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Saturday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Long Run (90-120 min)</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Zone 2 (Progressive)</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Sunday</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">Full Rest / Mobility</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);">-</td>
        </tr>
      </tbody>
    </table>
    
    <p><em>Note: This is a fallback template. Please try regenerating in a few minutes for your full, date-specific schedule.</em></p>
  `;
}
