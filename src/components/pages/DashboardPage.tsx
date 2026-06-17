"use client";

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import { 
  Activity, 
  Sparkles, 
  ShieldAlert
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  user?: any;
  recentActivities?: any[];
  stats?: any;
  weeklyVolume?: any[];
}

export default function DashboardPage({ 
  setActiveTab, 
  user, 
  recentActivities = [], 
  stats,
  weeklyVolume = []
}: DashboardPageProps) {
  
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setIsClient(true);
    if (recentActivities.length > 0) {
      const date = new Date(recentActivities[0].date);
      setFormattedDate(date.toLocaleString());
    }
  }, [recentActivities]);
  
  const latestActivity = recentActivities[0];

  // Pace progression data (dummy for now if not in DB, or extract from splits if available)
  const paceData = [
    { km: '1', pace: 4.25 },
    { km: '2', pace: 4.18 },
    { km: '3', pace: 4.12 },
    { km: '4', pace: 4.10 },
    { km: '5', pace: 4.15 },
    { km: '6', pace: 4.08 },
    { km: '7', pace: 4.05 },
    { km: '8', pace: 4.12 },
    { km: '9', pace: 4.02 },
    { km: '10', pace: 3.58 },
    { km: '11', pace: 4.08 },
    { km: '12', pace: 3.55 }
  ];

  // Heart Rate Zones
  const hrZones = [
    { zone: 'Z5 Anaerobic', time: '2 mins', percentage: 4, range: '>182 bpm', color: '#FF3B30' },
    { zone: 'Z4 Threshold', time: '18 mins', percentage: 34, range: '165-182 bpm', color: '#FF9500' },
    { zone: 'Z3 Tempo', time: '22 mins', percentage: 42, range: '148-165 bpm', color: 'var(--accent)' },
    { zone: 'Z2 Aerobic', time: '8 mins', percentage: 16, range: '130-148 bpm', color: '#30D158' },
    { zone: 'Z1 Active Recovery', time: '2 mins', percentage: 4, range: '<130 bpm', color: '#0A84FF' }
  ];

  // AI coach recommendations
  const insights = [
    { id: 1, type: 'recovery', text: 'Fatigue is balanced. Recovery score is optimal (84%). Ready for threshold stress.' },
    { id: 2, type: 'technique', text: 'Average cadence on your tempo run was 179 spm. Good step frequency, keep targeting 180.' },
    { id: 3, type: 'warning', text: 'Ground contact balance is shifting slightly to the left side (50.8% L / 49.2% R). Check footwear wear.' }
  ];

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* Top Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">WELCOME BACK, {user?.fullName?.split(' ')[0].toUpperCase() || 'ATHLETE'}</h2>
          <p className="text-textSecondary text-[0.88rem] mt-1">
            {recentActivities.length > 0 
              ? isClient ? `Last activity uploaded: ${formattedDate}. Your training load is in the ` : "Last activity uploaded: "
              : "No activities uploaded yet. Upload TCX files in Settings to see your progress."}
            {recentActivities.length > 0 && <strong className="text-accent">optimal</strong>} zone.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('coaching')}
          className="btn-pill btn-pill-primary"
        >
          <Sparkles size={16} />
          <span>Ask AI Coach</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        
        {/* RECENT RUN */}
        <div className="glass-panel col-span-8 p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">RECENT SESSION</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{latestActivity?.title || 'No recent activity'}</h3>
              </div>
              <button 
                onClick={() => setActiveTab('activities')}
                className="btn-pill btn-pill-dark !py-1.5 !px-3.5 text-[0.7rem]"
              >
                Full Analytics
              </button>
            </div>
            
            {/* Run Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-white/[0.02] border border-borderDark rounded-xl">
                <p className="text-[0.7rem] text-textSecondary font-semibold">DISTANCE</p>
                <p className="text-2xl font-black text-white mt-1">
                  {latestActivity ? latestActivity.distance.toFixed(2) : '0.00'} 
                  <span className="text-xs text-textSecondary font-medium"> km</span>
                </p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-borderDark rounded-xl">
                <p className="text-[0.7rem] text-textSecondary font-semibold">AVG PACE</p>
                <p className="text-2xl font-black text-accent mt-1">
                  {latestActivity ? latestActivity.avgPace : '0:00'} 
                  <span className="text-xs text-textSecondary font-medium"> /km</span>
                </p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-borderDark rounded-xl">
                <p className="text-[0.7rem] text-textSecondary font-semibold">DURATION</p>
                <p className="text-2xl font-black text-white mt-1">
                  {latestActivity ? formatDuration(latestActivity.duration) : '0:00'}
                </p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-borderDark rounded-xl">
                <p className="text-[0.7rem] text-textSecondary font-semibold">AVG HR</p>
                <p className="text-2xl font-black text-white mt-1">
                  {latestActivity?.avgHr || '--'} <span className="text-xs text-textSecondary font-medium">bpm</span>
                </p>
              </div>
            </div>
          </div>

          {/* SVG Map Path Visualizer */}
          <div className="h-[140px] rounded-xl bg-gradient-to-b from-[#181818] to-[#050505] border border-borderDark relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px]"></div>

            {latestActivity?.routeSvg ? (
              <svg width="100%" height="100%" className="relative z-10">
                <path d={latestActivity.routeSvg} fill="none" stroke="var(--accent)" strokeWidth="4" filter="url(#glow)" />
              </svg>
            ) : (
              <div className="text-textSecondary text-[0.7rem] z-10 text-center px-4">
                {latestActivity ? "GPS route not available for this activity" : "No activity data to display"}
              </div>
            )}
          </div>
        </div>

        {/* RECOVERY SCORE CARD */}
        <div className="glass-panel col-span-4 p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">PHYSIOLOGICAL DATA</span>
            <h3 className="text-xl font-extrabold text-white mt-0.5 mb-4">Recovery Score</h3>
          </div>
          
          <div className="flex justify-center relative my-2.5">
            <svg width="150" height="150">
              <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
              <circle 
                cx="75" cy="75" r="60" stroke="var(--accent)" strokeWidth="10" fill="transparent" 
                strokeDasharray={String(2 * Math.PI * 60)}
                strokeDashoffset={String(2 * Math.PI * 60 * (1 - 0.84))}
                strokeLinecap="round"
                transform="rotate(-90 75 75)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-black text-white tracking-tighter">84<span className="text-sm font-semibold text-textSecondary">%</span></p>
              <p className="text-[0.62rem] text-accent font-extrabold tracking-wider -mt-0.5">OPTIMAL</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-textSecondary leading-relaxed">
              HRV is 86ms (+12% baseline). Resting HR is 48bpm. You are fully prime for high training load today.
            </p>
          </div>
        </div>

        {/* TOTAL WEEKLY KM */}
        <div className="glass-panel col-span-4 p-6 flex flex-col gap-4">
          <div>
            <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">VOLUME PROGRESSION</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Weekly Volume</h3>
          </div>
          
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-black text-white">
                {stats?.weeklyDistance || 0} <span className="text-sm text-textSecondary font-medium">/ 50.0 km</span>
              </span>
              <span className="text-xs text-accent font-bold">
                {Math.min(100, Math.round(((stats?.weeklyDistance || 0) / 50) * 100))}% Goal
              </span>
            </div>
            
            <div className="w-full h-2 bg-brandSecondary rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, ((stats?.weeklyDistance || 0) / 50) * 100)}%` }} 
                className="h-full bg-accent shadow-glowStrong rounded-full"
              ></div>
            </div>
          </div>

          <div className="h-[90px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVolume} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '10px' }} 
                />
                <Bar dataKey="distance" fill="rgba(196, 255, 0, 0.35)" radius={[4, 4, 0, 0]}>
                  {weeklyVolume.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.distance > 10 ? 'var(--accent)' : 'rgba(196, 255, 0, 0.4)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HR ZONES (Keep as dummy for now) */}
        <div className="glass-panel col-span-4 p-6 flex flex-col gap-3">
          <div>
            <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">BIOMETRICS</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Heart Rate Zones</h3>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {hrZones.map(zone => (
              <div key={zone.zone} className="flex flex-col gap-0.5">
                <div className="flex justify-between text-[0.72rem] font-semibold">
                  <span className="text-white">{zone.zone}</span>
                  <span className="text-textSecondary">{zone.time} ({zone.percentage}%)</span>
                </div>
                <div className="w-full h-1 bg-white/[0.03] rounded-sm overflow-hidden">
                  <div style={{ width: `${zone.percentage}%`, backgroundColor: zone.color }} className="h-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="glass-panel col-span-4 p-6 flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">COACH INTELLIGENCE</span>
              <h3 className="text-lg font-bold text-white mt-0.5">AI Performance Insights</h3>
            </div>
            <Sparkles size={16} className="text-accent" />
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {insights.map(item => (
              <div key={item.id} className="flex gap-2.5 p-2 px-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                {item.type === 'warning' ? (
                  <ShieldAlert size={14} className="text-[#FF3B30] shrink-0 mt-0.5" />
                ) : (
                  <Activity size={14} className="text-accent shrink-0 mt-0.5" />
                )}
                <p className="text-xs text-textSecondary leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PACE PROGRESSION (Keep as dummy for now) */}
        <div className="glass-panel col-span-6 p-6 min-h-[260px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">PERFORMANCE CURVE</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Interval Pace Progression</h3>
            </div>
            <div className="text-[0.72rem] text-textSecondary">AVG PACE: {latestActivity?.avgPace || '--'}</div>
          </div>
          
          <div className="h-[140px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="km" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[3.5, 4.5]} stroke="var(--text-muted)" fontSize={10} reversed tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} 
                />
                <Line 
                  type="monotone" dataKey="pace" stroke="var(--accent)" strokeWidth={2} 
                  dot={{ r: 2, fill: 'var(--accent)' }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--accent)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RUNNING FORM (Keep as dummy for now) */}
        <div className="glass-panel col-span-6 p-6 min-h-[260px] flex flex-col justify-between">
          <div>
            <span className="text-[0.7rem] font-extrabold text-accent tracking-widest uppercase">BIOMECHANICS & KINETICS</span>
            <h3 className="text-lg font-bold text-white mt-0.5 mb-4">Running Form & Dynamics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col justify-center p-4 bg-white/[0.01] border border-borderDark rounded-xl text-center">
              <p className="text-[0.65rem] text-textSecondary font-bold tracking-wider">GCT BALANCE</p>
              <p className="text-xl font-extrabold text-white mt-1.5">
                49.5% <span className="text-xs text-textSecondary">L</span> / 50.5% <span className="text-xs text-accent">R</span>
              </p>
              <div className="w-full h-1 bg-white/[0.04] rounded-sm relative mt-2.5">
                <div style={{ left: '49.5%' }} className="absolute top-0 w-1.5 h-1.5 rounded-full bg-accent -translate-x-1/2 -translate-y-[1px] shadow-glowStrong"></div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-4 bg-white/[0.01] border border-borderDark rounded-xl text-center">
              <p className="text-[0.65rem] text-textSecondary font-bold tracking-wider">VERTICAL OSCILLATION</p>
              <p className="text-xl font-extrabold text-accent mt-1.5">6.4 <span className="text-xs text-textSecondary font-normal">cm</span></p>
              <span className="text-[0.62rem] text-textSecondary mt-1.5">Highly Efficient // Low bounce</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
