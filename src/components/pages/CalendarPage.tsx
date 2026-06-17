"use client";

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalIcon, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  X, 
  Clock, 
  Activity, 
  MapPin, 
  Award,
  Sparkles
} from 'lucide-react';

interface CalendarPageProps {
  initialActivities?: any[];
  plannedActivities?: any[];
  onNavigateToActivity?: (id: string | number) => void;
}

export default function CalendarPage({ initialActivities = [], plannedActivities = [], onNavigateToActivity }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calculate calendar grid
  const { days, padding } = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get day of week (0=Sun, 1=Mon, ..., 6=Sat)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Convert to (0=Mon, ..., 6=Sun)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const totalDays = lastDayOfMonth.getDate();
    const daysArray = [];
    
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      
      // Find completed activities for this day
      const dayActivities = initialActivities.filter(act => {
        const actDate = new Date(act.date);
        return actDate.getFullYear() === currentYear && 
               actDate.getMonth() === currentMonth && 
               actDate.getDate() === i;
      });

      // Find planned activities for this day
      const dayPlanned = plannedActivities.filter(act => {
        if (!act.date) return false;
        const actDate = new Date(act.date);
        return actDate.getFullYear() === currentYear && 
               actDate.getMonth() === currentMonth && 
               actDate.getDate() === i;
      });

      daysArray.push({
        day: i,
        dateStr,
        activities: dayActivities,
        planned: dayPlanned,
        hasActivity: dayActivities.length > 0 || dayPlanned.length > 0
      });
    }

    return { days: daysArray, padding: firstDayOfWeek };
  }, [currentMonth, currentYear, initialActivities, plannedActivities]);

  // Calculate monthly summary
  const summary = useMemo(() => {
    const monthActivities = initialActivities.filter(act => {
      const actDate = new Date(act.date);
      return actDate.getFullYear() === currentYear && actDate.getMonth() === currentMonth;
    });

    const totalDistance = monthActivities.reduce((acc, act) => acc + (act.distance || 0), 0);
    const completedSessions = monthActivities.length;
    
    return {
      totalDistance: totalDistance.toFixed(2),
      sessions: completedSessions
    };
  }, [currentMonth, currentYear, initialActivities]);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-[1fr_340px] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards] relative">
      
      {/* ACTIVITY DETAIL MODAL */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel w-full max-w-[800px] max-h-[90vh] overflow-y-auto flex flex-col p-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-accent/20">
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b border-white/10 ${selectedActivity.isPlanned ? 'bg-blue-500/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`icon-frame-${selectedActivity.isPlanned ? 'blue' : 'accent'} !w-10 !h-10`}>
                  <Activity size={20} className={selectedActivity.isPlanned ? 'text-blue-400' : 'text-accent'} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedActivity.title || (selectedActivity.isPlanned ? `${selectedActivity.workoutType} Session` : 'Run')}</h2>
                  <p className="text-xs text-textSecondary font-semibold uppercase tracking-wider">
                    {selectedActivity.date ? formatDate(selectedActivity.date) : (selectedActivity.dayName || 'Planned Session')}
                    {selectedActivity.isPlanned && <span className="ml-2 text-blue-400 font-black tracking-widest">[PLANNED]</span>}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="icon-frame-gray hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Metrics */}
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-borderDark rounded-xl">
                    <span className="text-[0.62rem] text-textSecondary font-bold block mb-1">TARGET DISTANCE</span>
                    <p className="text-2xl font-black text-white">
                      {selectedActivity.isPlanned 
                        ? (selectedActivity.distance || '--') 
                        : selectedActivity.distance?.toFixed(2)} 
                      <span className="text-sm font-medium text-textSecondary"> km</span>
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-borderDark rounded-xl">
                    <span className="text-[0.62rem] text-textSecondary font-bold block mb-1">TARGET PACE</span>
                    <p className={`text-2xl font-black ${selectedActivity.isPlanned ? 'text-blue-400' : 'text-accent'}`}>
                      {selectedActivity.isPlanned ? (selectedActivity.targetPace || '--') : selectedActivity.avgPace} 
                      <span className="text-sm font-medium text-textSecondary"> /km</span>
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-borderDark rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={12} className="text-textSecondary" />
                      <span className="text-[0.62rem] text-textSecondary font-bold block">DURATION</span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {selectedActivity.isPlanned 
                        ? (selectedActivity.duration || '--') 
                        : formatDuration(selectedActivity.duration)}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-borderDark rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity size={12} className="text-textSecondary" />
                      <span className="text-[0.62rem] text-textSecondary font-bold block">INTENSITY</span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {selectedActivity.isPlanned 
                        ? (selectedActivity.intensity || 'MODERATE') 
                        : (selectedActivity.avgHr ? `${selectedActivity.avgHr} bpm` : '--')}
                    </p>
                  </div>
                </div>

                <div className={`p-5 border rounded-xl ${selectedActivity.isPlanned ? 'bg-blue-500/5 border-blue-500/20' : 'bg-accent/5 border-accent/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className={selectedActivity.isPlanned ? 'text-blue-400' : 'text-accent'} />
                    <h4 className="text-[0.85rem] font-black text-white tracking-wide uppercase">
                      {selectedActivity.isPlanned ? 'COACH INSTRUCTIONS' : 'AI COACH INSIGHT'}
                    </h4>
                  </div>
                  <p className="text-sm text-textSecondary leading-relaxed italic">
                    {selectedActivity.isPlanned 
                      ? selectedActivity.description 
                      : (selectedActivity.aiSummary || "This run shows excellent aerobic efficiency. Your pace was very stable relative to your heart rate.")}
                  </p>
                </div>
              </div>

              {/* Right Column: Visual */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Zap size={14} className={selectedActivity.isPlanned ? 'text-blue-400' : 'text-accent'} />
                  <span className="text-[0.75rem] text-textSecondary font-bold tracking-wider uppercase">
                    {selectedActivity.isPlanned ? 'SESSION FOCUS' : 'ROUTE VISUALIZATION'}
                  </span>
                </div>
                <div className="flex-1 min-h-[250px] bg-gradient-to-b from-[#1b1b1b] to-[#080808] border border-borderDark rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  {selectedActivity.isPlanned ? (
                    <div className="relative z-10 flex flex-col items-center text-center p-8">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 ${selectedActivity.workoutType?.toLowerCase() === 'long' ? 'border-blue-500 bg-blue-500/10' : 'border-accent bg-accent/10'}`}>
                        <Zap size={32} className={selectedActivity.workoutType?.toLowerCase() === 'long' ? 'text-blue-400' : 'text-accent'} />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{selectedActivity.workoutType} SESSION</h4>
                      <p className="text-xs text-textSecondary uppercase font-bold tracking-widest">{selectedActivity.title}</p>
                    </div>
                  ) : (
                    <>
                      {selectedActivity.routeSvg ? (
                        <svg width="90%" height="90%" className="relative z-10">
                          <path 
                            d={selectedActivity.routeSvg} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="5" 
                            strokeLinecap="round"
                            style={{
                              filter: 'drop-shadow(0px 0px 12px rgba(196, 255, 0, 0.4))'
                            }}
                          />
                        </svg>
                      ) : (
                        <div className="text-textSecondary text-sm z-10 flex flex-col items-center gap-2">
                          <MapPin size={24} className="opacity-20" />
                          <span>GPS route data unavailable</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {!selectedActivity.isPlanned && (
                  <div className="flex justify-between items-center text-[0.65rem] text-textMuted px-1">
                    <span className="font-bold">ELEVATION GAIN: {selectedActivity.elevationGained || 0}m</span>
                    <span className="font-bold">CADENCE: {selectedActivity.avgCadence || '--'}spm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="btn-pill btn-pill-dark"
              >
                Close View
              </button>
              {!selectedActivity.isPlanned && (
                <button 
                  onClick={() => {
                    if (onNavigateToActivity) {
                      onNavigateToActivity(selectedActivity.id);
                    }
                  }}
                  className="btn-pill btn-pill-primary"
                >
                  Full Performance Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEFT: CALENDAR GRID */}
      <div className="glass-panel p-6 flex flex-col h-full">
        {/* Month selector */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <CalIcon size={16} className="text-accent" />
            <h3 className="text-[1.1rem] font-extrabold text-white tracking-wider">
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="icon-frame-gray !w-8 !h-8"><ChevronLeft size={14} /></button>
            <button onClick={nextMonth} className="icon-frame-gray !w-8 !h-8"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Calendar body */}
        <div className="flex-1 flex flex-col overflow-y-auto pr-1 custom-scrollbar">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2.5 mb-2.5">
            {weekdays.map(d => (
              <span key={d} className="text-[0.65rem] text-textMuted font-extrabold text-center tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {/* Pad the start with empty slots */}
            {[...Array(padding)].map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] bg-transparent"></div>
            ))}

            {/* Actual Days */}
            {days.map(item => {
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, item.day).toDateString();
              const hasCompleted = item.activities.length > 0;
              const hasPlanned = item.planned.length > 0;
              
              return (
                <div 
                  key={item.day}
                  className={`p-2 min-h-[80px] rounded-xl flex flex-col justify-between cursor-pointer border-2 transition-all hover:border-accent/40 ${
                    isToday 
                      ? 'border-accent' 
                      : hasCompleted
                        ? 'bg-accent/[0.02] border-accent/15'
                        : hasPlanned
                          ? 'bg-blue-500/5 border-blue-500/10'
                          : 'bg-white/[0.005] border-borderDark'
                  }`}
                >
                  <span className={`text-[0.75rem] font-extrabold ${
                    hasCompleted ? 'text-accent' : hasPlanned ? 'text-blue-400' : 'text-textSecondary'
                  }`}>
                    {item.day}
                  </span>
                  
                  <div className="mt-1 flex flex-col gap-1">
                    {/* Completed Activities */}
                    {item.activities.map((act: any, idx: number) => (
                      <div 
                        key={`completed-${idx}`} 
                        className="mb-1 last:mb-0 p-1 rounded-md hover:bg-accent/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivity(act);
                        }}
                      >
                        <p className="text-[0.65rem] font-black text-white">
                          {act.distance ? `${act.distance.toFixed(1)}km` : 'Done'}
                        </p>
                        <p className="text-[0.5rem] text-textSecondary truncate">{act.title || 'Run'}</p>
                      </div>
                    ))}

                    {/* Planned Activities */}
                    {item.planned.map((plan: any, idx: number) => (
                      <div 
                        key={`planned-${idx}`} 
                        className="mb-1 last:mb-0 p-1 rounded-md border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivity({...plan, isPlanned: true});
                        }}
                      >
                        <p className="text-[0.65rem] font-black text-blue-300">
                          {plan.distance || plan.duration || 'Plan'}
                        </p>
                        <p className="text-[0.5rem] text-blue-400/70 truncate uppercase font-bold">{plan.workoutType || 'Run'}</p>
                      </div>
                    ))}
                  </div>

                  {!item.hasActivity && (
                    <span className="text-[0.55rem] text-textMuted font-semibold tracking-wider opacity-0 hover:opacity-100 transition-opacity">REST</span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex gap-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
              <span className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest">Planned</span>
            </div>
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
              <p className="text-2xl font-black text-white mt-1">{summary.totalDistance} <span className="text-sm text-textSecondary font-medium">km</span></p>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-xl border border-borderDark">
              <span className="text-[0.62rem] text-textSecondary font-bold block">RUN SESSIONS COMPLETED</span>
              <p className="text-2xl font-black text-white mt-1">{summary.sessions}</p>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-xl border border-borderDark">
              <span className="text-[0.62rem] text-textSecondary font-bold block">CONSISTENCY SCORE</span>
              <p className="text-2xl font-black text-accent mt-1">
                {summary.sessions > 0 ? Math.min(100, Math.round((summary.sessions / (days.length / 1.5)) * 100)) : 0}%
              </p>
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
              <p className="leading-relaxed">
                {summary.sessions > 0 
                  ? `You've logged ${summary.sessions} sessions this month. Keep maintaining the momentum.`
                  : "Start logging activities to see AI-driven training insights."}
              </p>
            </div>
            {parseFloat(summary.totalDistance) > 0 && (
              <div className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Monthly volume of **{summary.totalDistance}km** is being processed for recovery optimization.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
