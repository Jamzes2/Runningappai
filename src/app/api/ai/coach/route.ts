import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array provided' }, { status: 400 });
    }

    if (!apiKey || apiKey === 'mock-openrouter-key') {
      return getMockResponse(messages);
    }

    // System prompt instructing the model on athlete biometrics, personality, and styling rules
    const systemPrompt = {
      role: 'system',
      content: `You are the RunSynergy AI Coach—a premium, scientific performance running assistant built to help elite athletes crush personal records.
Your athlete is James Robinson.
Biometrics:
- Age: 28
- VO2 Max: 58.6 ml/kg/min (Elite status)
- HRV: 86ms (Highly responsive nervous system)
- Resting HR: 48 bpm
- Target: Sub 17:30 5k, Sub 35:00 10k, Sub 1:18 Half Marathon.

Tone guidelines:
- Human-natured, personable, and encouraging.
- Extremely scientific, referencing biomechanics (Ground Contact Time, Vertical Oscillation, Power output).
- Actionable advice: prescribe specific target runs, intervals, or strength drills (e.g. pogo jumps, soleus raises).
- Keep responses relatively brief and highly readable.`
    };

    // Prepare full messages array
    const fullMessages = [systemPrompt, ...messages];

    // Connect to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://runsynergy.com', // Site URL for OpenRouter ranking
        'X-Title': 'RunSynergy Analytics',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Recommended model for speed & quality
        messages: fullMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[OpenRouter API Error]', errorText);
      
      // Fallback to mock data if API call fails (e.g. 402 Payment Required)
      return getMockResponse(messages);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[AI Coach Route Exception]', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' }, 
      { status: 500 }
    );
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
