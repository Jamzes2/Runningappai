"use client";

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis
} from 'recharts';
import { 
  Calendar as CalIcon, 
  Award, 
  Sparkles
} from 'lucide-react';

interface ActivitiesPageProps {
  initialActivities?: any[];
}

export default function ActivitiesPage({ initialActivities = [] }: ActivitiesPageProps) {
  const [activities, setActivities] = useState<any[]>(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Load activities from the backend when the component mounts
  useEffect(() => {
    setIsClient(true);
    // If we already have initial activities (e.g., from server‑side props) use them
    if (initialActivities.length > 0) {
      setActivities(initialActivities);
      setSelectedActivity(initialActivities[0]);
      return;
    }
    // Otherwise fetch from the API
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/strava/activities', {
          credentials: 'include', // ensure Supabase session cookie is sent
        });
        if (!res.ok) {
          console.log('Auth endpoint failed, trying demo endpoint...');
          // Fallback to demo endpoint
          const demoRes = await fetch('/api/demo/activities');
          if (!demoRes.ok) {
            console.error('Failed to fetch activities', demoRes.status);
            return;
          }
          const data = await demoRes.json();
          setActivities(data.activities || []);
          if (data.activities && data.activities.length > 0) {
            setSelectedActivity(data.activities[0]);
          }
          return;
        }
        const data = await res.json();
        setActivities(data.activities || []);
        if (data.activities && data.activities.length > 0) {
          setSelectedActivity(data.activities[0]);
        }
      } catch (err) {
        console.error('Error fetching activities', err);
      }
    };
    fetchActivities();
  }, []);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] glass-panel p-8 text-center">
        <Award size={48} className="text-textSecondary mb-4 opacity-20" />
        <h2 className="text-2xl font-black text-white mb-2">NO ACTIVITIES FOUND</h2>
        <p className="text-textSecondary max-w-md">
          Connect your Strava account in the Settings tab to sync your running activities and see your detailed analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT SIDEBAR: ACTIVITIES LIST */}
      <div className="glass-panel flex flex-col h-full overflow-y-auto p-4">
        <h3 className="text-[1rem] font-extrabold mb-4 tracking-wider text-accent font-sans">RECENT RUNS</h3>
        <div className="flex flex-col gap-2.5">
          {activities.map(act => {
            const isSelected = selectedActivity?.id === act.id;
            return (
              <div 
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  isSelected ? 'bg-accent/5 border-accent' : 'bg-white/[0.01] border-borderDark'
                }`}
              >
                <p className="text-[0.62rem] text-textSecondary font-semibold">{new Date(act.date).toLocaleDateString()}</p>
                <h4 className="text-[0.85rem] font-bold text-white mt-1 truncate">{act.title}</h4>
                <div className="flex justify-between items-baseline mt-3">
                  <span className="text-[1.1rem] font-extrabold text-white">
                    {act.distance.toFixed(2)} <span className="text-[0.7rem] text-textSecondary font-medium">km</span>
                  </span>
                  <span className="text-[0.75rem] color-accent font-semibold text-accent">{act.avgPace} /km</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: ACTIVITY METRICS DETAILS */}
      <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
        
        {/* TOP PANEL: METRICS & MAP ROUTE */}
        {selectedActivity && (
          <div className="glass-panel p-6 grid grid-cols-[1.2fr_1fr] gap-6">
            
            {/* Summary Text / Core Stats */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalIcon size={14} className="text-accent" />
                  <span className="text-[0.75rem] text-textSecondary font-semibold">{formatDate(selectedActivity.date)}</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1.5">{selectedActivity.title}</h2>
              </div>
              
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">DISTANCE</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.distance.toFixed(2)} km</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">AVG PACE</span>
                  <p className="text-[1.1rem] font-black text-accent mt-0.5">{selectedActivity.avgPace} /km</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">TIME</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{formatDuration(selectedActivity.duration)}</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">AVG HEART RATE</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.avgHr || '--'} bpm</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">ELEVATION</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.elevationGained || 0} m</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">MAX HEART RATE</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.maxHr || '--'} bpm</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award size={16} className="text-accent" />
                <span className="text-[0.75rem] text-textSecondary font-semibold">
                  Workout Intensity: <span className="text-white font-bold">Threshold (Aerobic Focus)</span>
                </span>
              </div>
            </div>

            {/* Map display */}
            <div className="min-h-[220px] rounded-xl bg-gradient-to-b from-[#1b1b1b] to-[#080808] border border-borderDark relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              {selectedActivity.routeSvg ? (
                <svg width="90%" height="90%" className="relative z-10">
                  <path 
                    d={selectedActivity.routeSvg} 
                    fill="none" 
                    stroke="var(--accent)" 
                    strokeWidth="4.5" 
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0px 0px 8px rgba(196, 255, 0, 0.5))'
                    }}
                  />
                </svg>
              ) : (
                <div className="text-textSecondary text-sm z-10">Map data unavailable</div>
              )}
              <span className="absolute top-2.5 left-3 text-[0.62rem] text-textSecondary font-bold">
                GPS SAT CONNECT: GALILEO (3D FIX)
              </span>
            </div>

          </div>
        )}

        {/* MIDDLE: CHARTS & SPLITS (Using dummy telemetry/splits for now as it's not in DB yet) */}
        {selectedActivity && (
          <div className="grid grid-cols-[1.2fr_1fr] gap-5">
            
            <div className="glass-panel p-6 flex flex-col h-[360px]">
              <h3 className="text-[0.95rem] font-extrabold mb-4 tracking-wider text-accent">PERFORMANCE CHART</h3>
              <div className="flex-1 w-full flex items-center justify-center border border-white/5 rounded-xl bg-white/[0.01]">
                <p className="text-textSecondary text-sm">Detailed telemetry chart coming soon</p>
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col h-[360px] overflow-y-auto">
              <h3 className="text-[0.95rem] font-extrabold mb-4 tracking-wider text-accent">KM SPLITS</h3>
              <div className="flex-1 flex items-center justify-center border border-white/5 rounded-xl bg-white/[0.01]">
                <p className="text-textSecondary text-sm">Individual splits data coming soon</p>
              </div>
            </div>

          </div>
        )}

        {/* BOTTOM: AI SUMMARY & REC WORKOUTS */}
        {selectedActivity && (
          <div className="glass-panel p-6 grid grid-cols-[1.2fr_1fr] gap-6">
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent" />
                <h3 className="text-[0.95rem] font-extrabold tracking-wider text-white">AI Coach Session Analysis</h3>
              </div>
              <p className="text-[0.82rem] text-textSecondary leading-relaxed">
                {selectedActivity.aiSummary || "Your AI coach is analyzing this session. Check back shortly for insights on your performance, form, and recovery metrics."}
              </p>
            </div>

            <div className="border-l border-borderDark pl-6 flex flex-col justify-center">
              <span className="text-[0.62rem] text-accent font-extrabold tracking-wider">RECOMMENDED NEXT WORKOUT</span>
              <h4 className="text-base font-extrabold text-white mt-1">VO2 Max Interval Prep</h4>
              <p className="text-[0.78rem] text-textSecondary mt-2 leading-relaxed">
                {selectedActivity.aiWorkoutRecommendation || "Based on this run, we recommend an active recovery session tomorrow followed by a threshold interval workout on Tuesday."}
              </p>
              <div className="flex gap-2.5 mt-4">
                <button className="btn-pill btn-pill-primary !py-2 !px-4 text-[0.72rem]">
                  Add to Calendar
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
