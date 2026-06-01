"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  Dumbbell, 
  Award,
  Video
} from 'lucide-react';

interface ImprovementItem {
  title: string;
  desc: string;
}

interface InjuryInsight {
  title: string;
  desc: string;
}

interface StrengthWorkout {
  title: string;
  routine: string;
}

interface ChatMessage {
  sender: 'user' | 'coach';
  text: string;
}

export default function CoachingPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'coach', text: 'Welcome to the RunSynergy Coaching Portal, James. I have reviewed your biometric data from the last 7 days. Your VO2 max estimate is holding steady at 58.6, and your HRV values indicate high nervous system readiness. Let\'s optimize your plan. Ask me anything about your analytics, upcoming workouts, or biomechanics.' }
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setTyping(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API server rejected AI connection');
      }

      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content || "I am analyzing your data. Keep maintaining target threshold loads.";
      
      setMessages(prev => [...prev, { sender: 'coach', text: replyText }]);
    } catch (err) {
      console.error('AI Coaching query failed:', err);
      setMessages(prev => [...prev, { 
        sender: 'coach', 
        text: "Error: AI Coach is currently offline. Please verify that your OPENROUTER_API_KEY environment variable is configured correctly." 
      }]);
    } finally {
      setTyping(false);
    }
  };

  const improvements: ImprovementItem[] = [
    { title: 'Increase Cadence Target', desc: 'Raise average cadence to 180 spm to reduce ground contact shock and lower loading rates.' },
    { title: 'Neuromuscular Efficiency', desc: 'Perform 4x80m strides at 95% effort after easy runs to stimulate fast-twitch muscle fibers.' }
  ];

  const injuryInsights: InjuryInsight[] = [
    { title: 'Patellar Tendon Loading', desc: 'Knee joint stress is in the moderate category. Avoid excessive downhill repetitions this week.' },
    { title: 'Left GCT Correction', desc: 'Focus on left foot active dorsiflexion during recovery to align Ground Contact balance.' }
  ];

  const strengthWorkouts: StrengthWorkout[] = [
    { title: 'Explosive Plyometrics', routine: '3 sets x 6 reps Box Jumps (max height) // Rest 90s' },
    { title: 'Unilateral Hip Load', routine: '3 sets x 8 reps Bulgarian Split Squats (12kg dumbbell) each leg' }
  ];

  return (
    <div className="grid grid-cols-[1.3fr_1fr] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT: COACH CHAT CONSOLE */}
      <div className="glass-panel flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-5 px-6 border-b border-borderDark flex justify-between items-center bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="icon-frame" style={{ width: '38px', height: '38px' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-[0.95rem] font-extrabold text-white">RS AI Coach</h3>
              <p className="text-[0.65rem] text-accent font-semibold tracking-wider">ACTIVE DATA AGENT</p>
            </div>
          </div>
          <span className="text-[0.7rem] text-textSecondary bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-borderDark font-semibold">
            BIOMETRICS COMPLIANT
          </span>
        </div>

        {/* Message logs */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, i) => (
            <div 
              key={i}
              className={`max-w-[75%] flex flex-col gap-1 ${
                m.sender === 'user' ? 'self-end' : 'self-start'
              }`}
            >
              <span className={`text-[0.62rem] text-textMuted font-bold uppercase tracking-wider ${
                m.sender === 'user' ? 'self-end' : 'self-start'
              }`}>
                {m.sender === 'user' ? 'Athlete (James)' : 'AI Performance Coach'}
              </span>
              <div className={`p-3.5 px-4.5 rounded-2xl text-[0.85rem] leading-relaxed border shadow-md ${
                m.sender === 'user' 
                  ? 'rounded-br-sm bg-brandSecondary border-accent/20 text-white' 
                  : 'rounded-bl-sm bg-white/[0.02] border-borderDark text-textSecondary'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="self-start flex flex-col gap-1">
              <span className="text-[0.62rem] text-textMuted font-bold uppercase">AI Performance Coach</span>
              <div className="p-3 px-4 rounded-2xl rounded-bl-sm bg-white/[0.01] text-textMuted text-[0.8rem] border border-borderDark">
                Formulating training protocol based on fatigue metrics...
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-5 px-6 border-t border-borderDark flex gap-3 bg-black/20">
          <input 
            type="text" 
            placeholder="Type your training question, fatigue symptoms, or target changes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="glass-input flex-1 py-3.5 px-5 text-[0.85rem]"
          />
          <button 
            type="submit" 
            className="btn-pill btn-pill-primary !h-[46px] !w-[46px] !min-w-[46px] !p-0 border-none"
          >
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* RIGHT: SUGGESTED IMPROVEMENTS & EXERCISES */}
      <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
        
        {/* Card: Suggested Improvements */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-accent" />
            <h4 className="text-[0.88rem] font-extrabold tracking-wider text-white">SUGGESTED IMPROVEMENTS</h4>
          </div>
          <div className="flex flex-col gap-3">
            {improvements.map((item, i) => (
              <div key={i} className={`pb-3 ${i < improvements.length - 1 ? 'border-b border-white/[0.02]' : ''}`}>
                <p className="text-[0.82rem] font-bold text-white">{item.title}</p>
                <p className="text-[0.75rem] text-textSecondary mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Injury Prevention */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-[#FF3B30]" />
            <h4 className="text-[0.88rem] font-extrabold tracking-wider text-[#FF3B30]">INJURY PREVENTION INSIGHTS</h4>
          </div>
          <div className="flex flex-col gap-3">
            {injuryInsights.map((item, i) => (
              <div key={i} className={`pb-3 ${i < injuryInsights.length - 1 ? 'border-b border-white/[0.02]' : ''}`}>
                <p className="text-[0.82rem] font-bold text-white">{item.title}</p>
                <p className="text-[0.75rem] text-textSecondary mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Strength Training */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell size={16} className="text-accent" />
            <h4 className="text-[0.88rem] font-extrabold tracking-wider text-white">STRENGTH TRAINING</h4>
          </div>
          <div className="flex flex-col gap-3">
            {strengthWorkouts.map((item, i) => (
              <div key={i} className={`pb-3 ${i < strengthWorkouts.length - 1 ? 'border-b border-white/[0.02]' : ''}`}>
                <p className="text-[0.82rem] font-bold text-white">{item.title}</p>
                <p className="text-[0.74rem] text-accent mt-1 font-semibold">{item.routine}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Video Recommendations */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Video size={16} className="text-accent" />
            <h4 className="text-[0.88rem] font-extrabold tracking-wider text-white font-sans">RECOMMENDED FORM VIDEOS</h4>
          </div>
          <div className="rounded-xl overflow-hidden border border-borderDark bg-[#0a0a0a] relative">
            <div 
              style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=350&auto=format&fit=crop")' }}
              className="h-[130px] bg-cover bg-center flex items-center justify-center cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-accent text-black flex items-center justify-center shadow-glowStrong">
                ▶
              </div>
              <span className="absolute bottom-2.5 left-3 text-[0.75rem] font-bold text-white">
                Hip Dorsiflexion Drill Tutorial
              </span>
              <span className="absolute bottom-2.5 right-3 text-[0.62rem] bg-black/60 px-1.5 py-0.5 rounded text-white">
                3:42
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
