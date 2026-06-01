"use client";

import React from 'react';
import { Calendar as CalIcon, CheckCircle2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface CalendarDayItem {
  day: number;
  type: 'completed' | 'planned' | 'rest';
  activity?: string;
  distance?: string;
  actual?: string;
  active?: boolean;
}

const calendarDays: CalendarDayItem[] = [
  { day: 1, type: 'completed', activity: 'Recovery Jog', distance: '6.0 km', actual: '6.0 km' },
  { day: 2, type: 'completed', activity: 'Interval Tempo', distance: '12.0 km', actual: '12.4 km' },
  { day: 3, type: 'rest' },
  { day: 4, type: 'completed', activity: 'Easy Aerobic', distance: '8.0 km', actual: '8.2 km' },
  { day: 5, type: 'completed', activity: 'Threshold Reps', distance: '10.0 km', actual: '10.5 km' },
  { day: 6, type: 'rest' },
  { day: 7, type: 'completed', activity: 'Long Progression', distance: '15.0 km', actual: '15.2 km' },
  { day: 8, type: 'completed', activity: 'Recovery Jog', distance: '6.0 km', actual: '6.0 km' },
  { day: 9, type: 'completed', activity: 'Interval Tempo', distance: '12.0 km', actual: '12.4 km' },
  { day: 10, type: 'rest' },
  { day: 11, type: 'completed', activity: 'Easy Aerobic', distance: '8.0 km', actual: '8.2 km' },
  { day: 12, type: 'completed', activity: 'Threshold Reps', distance: '10.0 km', actual: '10.5 km' },
  { day: 13, type: 'rest' },
  { day: 14, type: 'completed', activity: 'Long Progression', distance: '15.0 km', actual: '15.2 km' },
  { day: 15, type: 'completed', activity: 'Recovery Jog', distance: '6.0 km', actual: '6.0 km' },
  { day: 16, type: 'completed', activity: 'Interval Tempo', distance: '12.0 km', actual: '12.4 km' },
  { day: 17, type: 'rest' },
  { day: 18, type: 'completed', activity: 'Easy Aerobic', distance: '8.0 km', actual: '8.2 km' },
  { day: 19, type: 'completed', activity: 'Threshold Reps', distance: '10.0 km', actual: '10.5 km' },
  { day: 20, type: 'rest' },
  { day: 21, type: 'completed', activity: 'Long Progression', distance: '15.0 km', actual: '15.2 km' },
  { day: 22, type: 'completed', activity: 'Recovery Jog', distance: '6.0 km', actual: '6.0 km' },
  { day: 23, type: 'completed', activity: 'Interval Tempo', distance: '12.0 km', actual: '12.4 km' },
  { day: 24, type: 'rest' },
  { day: 25, type: 'completed', activity: 'Easy Aerobic', distance: '8.0 km', actual: '8.2 km' },
  { day: 26, type: 'completed', activity: 'Threshold Reps', distance: '10.0 km', actual: '10.5 km' },
  { day: 27, type: 'rest' },
  { day: 28, type: 'completed', activity: 'Interval Tempo', distance: '12.0 km', actual: '12.42 km', active: true },
  { day: 29, type: 'completed', activity: 'Recovery Jog', distance: '6.0 km', actual: '6.02 km' },
  { day: 30, type: 'completed', activity: 'Long Progression', distance: '15.0 km', actual: '15.20 km' },
  { day: 31, type: 'planned', activity: 'Active Recovery Strides', distance: '5.0 km' }
];

export default function CalendarPage() {
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="grid grid-cols-[1fr_340px] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT: CALENDAR GRID */}
      <div className="glass-panel p-6 flex flex-col h-full">
        {/* Month selector */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <CalIcon size={16} className="text-accent" />
            <h3 className="text-[1.1rem] font-extrabold text-white tracking-wider">MAY 2026</h3>
          </div>
          <div className="flex gap-2">
            <button className="icon-frame-gray !w-8 !h-8"><ChevronLeft size={14} /></button>
            <button className="icon-frame-gray !w-8 !h-8"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Calendar body */}
        <div className="flex-1 flex flex-col">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2.5 mb-2.5">
            {weekdays.map(d => (
              <span key={d} className="text-[0.65rem] text-textMuted font-extrabold text-center tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5 flex-1">
            {/* Pad the start with empty slots if needed - May 1st 2026 is a Friday (4 empty blocks) */}
            {[...Array(4)].map((_, i) => (
              <div key={`empty-${i}`} className="bg-transparent"></div>
            ))}

            {/* Actual Days */}
            {calendarDays.map(item => {
              const isCompleted = item.type === 'completed';
              const isPlanned = item.type === 'planned';
              const isRest = item.type === 'rest';
              
              return (
                <div 
                  key={item.day}
                  className={`p-2 rounded-xl flex flex-col justify-between cursor-pointer border-2 transition-all hover:border-accent/40 ${
                    item.active 
                      ? 'border-accent' 
                      : isCompleted 
                        ? 'bg-accent/[0.02] border-accent/15' 
                        : isPlanned 
                          ? 'bg-white/[0.01] border-borderDark' 
                          : 'bg-white/[0.005] border-borderDark'
                  }`}
                >
                  <span className={`text-[0.75rem] font-extrabold ${
                    isCompleted ? 'text-accent' : 'text-textSecondary'
                  }`}>
                    {item.day}
                  </span>
                  
                  {isCompleted && (
                    <div className="mt-1">
                      <p className="text-[0.75rem] font-extrabold text-white">{item.actual}</p>
                      <p className="text-[0.55rem] text-textSecondary truncate">{item.activity}</p>
                    </div>
                  )}

                  {isPlanned && (
                    <div className="mt-1">
                      <p className="text-[0.72rem] font-extrabold text-textSecondary italic">{item.distance} (Target)</p>
                      <p className="text-[0.55rem] text-textMuted truncate">{item.activity}</p>
                    </div>
                  )}

                  {isRest && (
                    <span className="text-[0.55rem] text-textMuted font-semibold tracking-wider">REST</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: KM TOTALS & CONSISTENCY */}
      <div className="flex flex-col gap-5 h-full overflow-y-auto">
        
        {/* Aggregates Card */}
        <div className="glass-panel p-5">
          <h3 className="text-[0.9rem] font-extrabold text-accent tracking-wider mb-4">MONTHLY SUMMARY</h3>
          
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-white/[0.02] rounded-xl border border-borderDark">
              <span className="text-[0.62rem] text-textSecondary font-bold block">TOTAL COMPLETED VOLUME</span>
              <p className="text-2xl font-black text-white mt-1">150.32 <span className="text-sm text-textSecondary font-medium">km</span></p>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-xl border border-borderDark">
              <span className="text-[0.62rem] text-textSecondary font-bold block">RUN SESSIONS COMPLETED</span>
              <p className="text-2xl font-black text-white mt-1">17 / 18</p>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-xl border border-borderDark">
              <span className="text-[0.62rem] text-textSecondary font-bold block">CONSISTENCY SCORE</span>
              <p className="text-2xl font-black text-accent mt-1">94%</p>
            </div>
          </div>
        </div>

        {/* Schedule Insights Card */}
        <div className="glass-panel p-5 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-accent" />
            <h4 className="text-[0.82rem] font-extrabold tracking-wider text-white">CALENDAR INSIGHTS</h4>
          </div>
          <div className="flex flex-col gap-3 text-[0.78rem] text-textSecondary">
            <div className="flex gap-2 items-start">
              <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">Weekly volume averaged **38km**, with a safe progressive step-up of 4% per week. Great load management.</p>
            </div>
            <div className="flex gap-2 items-start">
              <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">All Sunday Long runs were executed on plan. Rest day spacing has been optimal for neuromuscular adaptation.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
