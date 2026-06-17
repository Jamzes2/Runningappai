import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, coachConversations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array provided' }, { status: 400 });
    }

    // Identify user in DB
    let userProfile = null;
    if (authUser && db) {
      const profiles = await db.select().from(users).where(eq(users.email, authUser.email!)).limit(1);
      userProfile = profiles[0];
    }

    // Save user's latest message if we have a profile
    if (userProfile && messages.length > 0) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg.role === 'user') {
        await db.insert(coachConversations).values({
          userId: userProfile.id,
          sender: 'user',
          message: lastUserMsg.content
        });
      }
    }

    let result;
    if (!apiKey || apiKey === 'mock-openrouter-key') {
      result = await getMockResponse(messages);
    } else {
      // System prompt
      const systemPrompt = {
        role: 'system',
        content: `You are the RunSynergy AI Coach—a premium, scientific performance running assistant built to help elite athletes crush personal records.
Your athlete is ${userProfile?.fullName || 'James Robinson'}.
Tone guidelines:
- Human-natured, personable, and encouraging.
- Extremely scientific, referencing biomechanics (Ground Contact Time, Vertical Oscillation, Power output).
- Actionable advice: prescribe specific target runs, intervals, or strength drills (e.g. pogo jumps, soleus raises).
- Keep responses relatively brief and highly readable.`
      };

      const fullMessages = [systemPrompt, ...messages];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://runsynergy.com',
          'X-Title': 'RunSynergy Analytics',
        },
        body: JSON.stringify({
          model: 'google/gemini-3.5-flash',
          messages: fullMessages,
        }),
      });

      if (!response.ok) {
        result = await getMockResponse(messages);
      } else {
        const data = await response.json();
        result = NextResponse.json(data);
      }
    }

    // Save AI response
    if (userProfile) {
      const data = await result.clone().json();
      const replyText = data.choices?.[0]?.message?.content;
      if (replyText) {
        await db.insert(coachConversations).values({
          userId: userProfile.id,
          sender: 'coach',
          message: replyText
        });
      }
    }

    return result;
  } catch (err: any) {
    console.error('[AI Coach Route Exception]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

function getMockResponse(messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  let replyText = "I'm analyzing your biometric loads. Continue Zone 2 aerobic progression.";
  const query = lastMessage.toLowerCase();
  if (query.includes('pace') || query.includes('fast')) {
    replyText = "[MOCK MODE] Focus on interval threshold reps at 105% VO2 max to develop anaerobic tolerance.";
  } else if (query.includes('sore') || query.includes('knee') || query.includes('recovery')) {
    replyText = "[MOCK MODE] Your HRV is elevated. Lower training load. Avoid deep squat load to shield patellar tendons.";
  } else if (query.includes('strength')) {
    replyText = "[MOCK MODE] Perform single-leg step ups and box jumps twice a week to improve tendon spring dynamics.";
  }
  
  return NextResponse.json({
    choices: [{ message: { role: 'assistant', content: replyText } }]
  });
}
