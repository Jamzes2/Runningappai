"use client";

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar 
} from 'recharts';
import { Sparkles } from 'lucide-react';

interface VO2Item {
  week: string;
  vo2: number;
  fatigue: number;
}

interface PowerItem {
  duration: string;
  power: number;
}

interface FormItem {
  run: string;
  gctLeft: number;
  osc: number;
}

const vo2Data: VO2Item[] = [
  { week: 'Week 1', vo2: 57.2, fatigue: 78 },
  { week: 'Week 2', vo2: 57.5, fatigue: 82 },
  { week: 'Week 3', vo2: 57.4, fatigue: 88 },
  { week: 'Week 4', vo2: 57.9, fatigue: 72 },
  { week: 'Week 5', vo2: 58.1, fatigue: 75 },
  { week: 'Week 6', vo2: 58.6, fatigue: 80 }
];

const powerCurveData: PowerItem[] = [
  { duration: '1s', power: 720 },
  { duration: '5s', power: 650 },
  { duration: '10s', power: 580 },
  { duration: '30s', power: 480 },
  { duration: '1m', power: 410 },
  { duration: '5m', power: 340 },
  { duration: '10m', power: 315 },
  { duration: '20m', power: 295 },
  { duration: '1h', power: 275 },
  { duration: '2h', power: 250 }
];

const formKineticsData: FormItem[] = [
  { run: 'Run 1', gctLeft: 50.8, osc: 6.8 },
  { run: 'Run 2', gctLeft: 50.4, osc: 6.7 },
  { run: 'Run 3', gctLeft: 50.2, osc: 6.6 },
  { run: 'Run 4', gctLeft: 49.8, osc: 6.4 },
  { run: 'Run 5', gctLeft: 49.5, osc: 6.4 }
];

export default function AnalyticsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'vo2' | 'power' | 'form'>('vo2');

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* Sub tabs header */}
      <div className="flex justify-between items-center border-b border-borderDark pb-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveSubTab('vo2')}
            className={`btn-pill ${activeSubTab === 'vo2' ? 'btn-pill-primary' : 'btn-pill-dark'} !py-2 !px-[18px] text-[0.72rem]`}
          >
            VO2 & Fatigue
          </button>
          <button 
            onClick={() => setActiveSubTab('power')}
            className={`btn-pill ${activeSubTab === 'power' ? 'btn-pill-primary' : 'btn-pill-dark'} !py-2 !px-[18px] text-[0.72rem]`}
          >
            Power Curve
          </button>
          <button 
            onClick={() => setActiveSubTab('form')}
            className={`btn-pill ${activeSubTab === 'form' ? 'btn-pill-primary' : 'btn-pill-dark'} !py-2 !px-[18px] text-[0.72rem]`}
          >
            Form Kinetics
          </button>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] text-textSecondary">
          <Sparkles size={14} className="text-accent" />
          <span>Advanced Telemetry Active</span>
        </div>
      </div>

      {/* RENDER DYNAMIC CHARTS */}
      {activeSubTab === 'vo2' && (
        <div className="flex flex-col gap-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-5">
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">VO2 MAX ESTIMATE</span>
              <p className="text-3xl font-black text-accent mt-1">58.6 <span className="text-xs text-textSecondary font-medium">ml/kg/min</span></p>
              <span className="text-[0.65rem] text-[#30D158]">▲ Top 1.5% of age category (Elite)</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">ACUTE TRAINING LOAD</span>
              <p className="text-3xl font-black text-white mt-1">1.15 <span className="text-xs text-textSecondary font-medium">ACWR</span></p>
              <span className="text-[0.65rem] text-accent">● Optimal (Minimal injury risk zone)</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">LACTATE THRESHOLD</span>
              <p className="text-3xl font-black text-white mt-1">3:55 <span className="text-xs text-textSecondary font-medium">/km @ 172bpm</span></p>
              <span className="text-[0.65rem] text-textSecondary">Updated 2 days ago via Garmin FTP</span>
            </div>
          </div>

          {/* VO2 & Fatigue Chart */}
          <div className="glass-panel p-6 h-[380px] flex flex-col">
            <h3 className="text-base font-extrabold text-white mb-4 tracking-wide">VO2 Max & Fatigue Index Trend</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vo2Data} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="var(--accent)" fontSize={10} domain={[55, 60]} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#FF3B30" fontSize={10} domain={[60, 100]} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="vo2" stroke="var(--accent)" strokeWidth={3} name="VO2 Max" dot={{ r: 3 }} activeDot={{ r: 6 }} style={{ filter: 'drop-shadow(0px 0px 6px rgba(196, 255, 0, 0.4))' }} />
                  <Line yAxisId="right" type="monotone" dataKey="fatigue" stroke="#FF3B30" strokeWidth={1.5} strokeDasharray="4 4" name="Fatigue index" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'power' && (
        <div className="flex flex-col gap-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-5">
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">CRITICAL RUNNING POWER</span>
              <p className="text-3xl font-black text-accent mt-1">310 <span className="text-xs text-textSecondary font-medium">W</span></p>
              <span className="text-[0.65rem] text-textSecondary">4.1 W/kg specific capacity</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">MAX EFFORT PEAK</span>
              <p className="text-3xl font-black text-white mt-1">720 <span className="text-xs text-textSecondary font-medium">W (1s)</span></p>
              <span className="text-[0.65rem] text-textSecondary">Neuromuscular recruit index: high</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">AEROBIC THRESHOLD POWER</span>
              <p className="text-3xl font-black text-white mt-1">255 <span className="text-xs text-textSecondary font-medium">W (Z2)</span></p>
              <span className="text-[0.65rem] text-[#30D158]">▲ Stable (+2% monthly gains)</span>
            </div>
          </div>

          {/* Power Curve Chart */}
          <div className="glass-panel p-6 h-[380px] flex flex-col">
            <h3 className="text-base font-extrabold text-white mb-4 tracking-wide">Athlete Running Power Curve (Force vs Duration)</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={powerCurveData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="duration" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} domain={[200, 800]} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="power" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPower)" name="Power (Watts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'form' && (
        <div className="flex flex-col gap-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-5">
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">AVG GROUND CONTACT BALANCE</span>
              <p className="text-3xl font-black text-accent mt-1">49.5% L / 50.5% R</p>
              <span className="text-[0.65rem] text-accent">● Balanced (Target: 50.0%)</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">AVG VERTICAL OSCILLATION</span>
              <p className="text-3xl font-black text-white mt-1">6.4 <span className="text-xs text-textSecondary font-medium">cm</span></p>
              <span className="text-[0.65rem] text-[#30D158]">▲ High vertical efficiency (Low bounce)</span>
            </div>
            <div className="glass-panel p-5">
              <span className="text-[0.62rem] text-textSecondary font-bold tracking-wider block">AVG STRIDE LENGTH</span>
              <p className="text-3xl font-black text-white mt-1">1.38 <span className="text-xs text-textSecondary font-medium">m</span></p>
              <span className="text-[0.65rem] text-textSecondary">Highly correlated with tempo/rep speeds</span>
            </div>
          </div>

          {/* Form Kinetics Chart */}
          <div className="glass-panel p-6 h-[380px] flex flex-col">
            <h3 className="text-base font-extrabold text-white mb-4 tracking-wide">Ground Contact Time Balance & Vertical bounce</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formKineticsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="run" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="var(--accent)" fontSize={10} domain={[45, 55]} name="Left Balance %" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#0A84FF" fontSize={10} domain={[5, 8]} name="Vertical Osc" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="gctLeft" fill="rgba(196, 255, 0, 0.45)" radius={[4, 4, 0, 0]} name="GCT Balance (Left %)" />
                  <Bar yAxisId="right" dataKey="osc" fill="rgba(10, 132, 255, 0.45)" radius={[4, 4, 0, 0]} name="Vert. Osc (cm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
