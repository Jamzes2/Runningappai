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
      4. RETURN THE PLAN IN THE FOLLOWING JSON FORMAT ONLY:
      {
        "summary": "Short coach's summary of the training strategy",
        "weeks": [
          {
            "weekNumber": 1,
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "days": [
              {
                "date": "YYYY-MM-DD",
                "dayName": "Monday",
                "workoutType": "Interval|Tempo|Easy|Long|Rest|Strength",
                "title": "Short title",
                "description": "Detailed instructions",
                "distance": "e.g. 10km (numeric value preferred followed by km)",
                "duration": "e.g. 60 min",
                "targetPace": "e.g. 4:30 min/km",
                "targetHR": "e.g. 150-160 bpm",
                "intensity": "Low|Moderate|High|Very High"
              }
            ]
          }
        ]
      }
      5. Ensure the JSON is valid and contains no other text.
      6. For "distance", always provide a string like "10km" or "5.5km" if there is a distance component.
      6. If elevation data was provided, ensure the plan includes climbing or hill repeats proportional to the race difficulty.
      7. Include 2-3 sessions of Strength Training per week.
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
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI API error: ${errorText}`);
        generatedPlan = JSON.stringify(getFallbackPlan(raceName, raceGoal));
      } else {
        const aiData = await response.json();
        generatedPlan = aiData.choices?.[0]?.message?.content || JSON.stringify(getFallbackPlan(raceName, raceGoal));
      }
    } catch (apiErr) {
      console.error('API Call failed:', apiErr);
      generatedPlan = JSON.stringify(getFallbackPlan(raceName, raceGoal));
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
  return {
    summary: `Training Strategy for ${raceName}. Focus on hitting your ${raceGoal} target.`,
    weeks: [
      {
        weekNumber: 1,
        startDate: new Date().toISOString().split('T')[0],
        days: [
          { dayName: 'Monday', workoutType: 'Rest', title: 'Active Recovery', description: 'Mobility and light stretching.', duration: '20 min', intensity: 'Low' },
          { dayName: 'Tuesday', workoutType: 'Interval', title: 'Speed Work', description: '8x400m at 5k pace with 90s recovery.', distance: '8km', targetPace: '5k Pace', intensity: 'High' },
          { dayName: 'Wednesday', workoutType: 'Easy', title: 'Aerobic Base', description: 'Steady run in Zone 2.', distance: '10km', duration: '50 min', intensity: 'Moderate' },
          { dayName: 'Thursday', workoutType: 'Tempo', title: 'Threshold Run', description: '20 min steady at Half Marathon pace.', distance: '12km', targetPace: 'HM Pace', intensity: 'High' },
          { dayName: 'Friday', workoutType: 'Strength', title: 'Lower Body', description: 'Focus on glutes, hamstrings, and calves.', duration: '45 min', intensity: 'Moderate' },
          { dayName: 'Saturday', workoutType: 'Long', title: 'Endurance Build', description: 'Progressive long run, finishing last 2km at race pace.', distance: '18km', duration: '100 min', intensity: 'High' },
          { dayName: 'Sunday', workoutType: 'Rest', title: 'Full Recovery', description: 'Rest day.', intensity: 'Low' }
        ]
      }
    ]
  };
}

