"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ComposedChart,
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Area
} from 'recharts';
import { 
  Calendar as CalIcon, 
  Award, 
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface ActivitiesPageProps {
  initialActivities?: any[];
  preSelectedId?: string | number;
}

export default function ActivitiesPage({ initialActivities = [], preSelectedId }: ActivitiesPageProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Renaming state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Chart toggles
  const [showPace, setShowPace] = useState(true);
  const [showHR, setShowHR] = useState(true);
  const [showCadence, setShowCadence] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const [showTemp, setShowTemp] = useState(false);
  const [showVO, setShowVO] = useState(false);
  const [showGCT, setShowGCT] = useState(false);

  // Load activities from the backend when the component mounts
  useEffect(() => {
    setIsClient(true);
    
    const initializeActivities = (data: any[]) => {
      setActivities(data);
      if (data.length > 0) {
        if (preSelectedId) {
          const preSelected = data.find(a => a.id === preSelectedId || String(a.id) === String(preSelectedId));
          setSelectedActivity(preSelected || data[0]);
        } else {
          setSelectedActivity(data[0]);
        }
      }
    };

    if (initialActivities.length > 0) {
      initializeActivities(initialActivities);
      return;
    }
    
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities', {
          credentials: 'include',
        });
        if (!res.ok) {
          const demoRes = await fetch('/api/demo/activities');
          if (!demoRes.ok) return;
          const data = await demoRes.json();
          initializeActivities(data.activities || []);
          return;
        }
        const data = await res.json();
        initializeActivities(data.activities || []);
      } catch (err) {
        console.error('Error fetching activities', err);
      }
    };
    fetchActivities();
  }, [initialActivities, preSelectedId]);

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const remaining = activities.filter(a => a.id !== id);
        setActivities(remaining);
        if (remaining.length > 0) {
          setSelectedActivity(remaining[0]);
        } else {
          setSelectedActivity(null);
        }
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete activity', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameActivity = async () => {
    if (!editTitle.trim() || !selectedActivity) return;
    
    try {
      const res = await fetch(`/api/activities/${selectedActivity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });
      if (res.ok) {
        const updated = activities.map(a => 
          a.id === selectedActivity.id ? { ...a, title: editTitle } : a
        );
        setActivities(updated);
        setSelectedActivity({ ...selectedActivity, title: editTitle });
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to rename activity', err);
    }
  };

  const startEditing = () => {
    setEditTitle(selectedActivity?.title || '');
    setIsEditing(true);
  };

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

  // Process chart data from telemetry
  const chartData = useMemo(() => {
    const telemetry = selectedActivity?.telemetry;
    
    if (telemetry && telemetry.length > 0) {
      return telemetry.map((t: any) => ({
        dist: t.d,
        pace: t.p,
        hr: t.h,
        cadence: t.c,
        power: t.w,
        altitude: t.a,
        temp: t.t,
        vo: (t.vo !== undefined && t.vo !== null) ? t.vo / 10 : null, // Convert mm to cm
        gct: t.gct !== undefined ? t.gct : null
      }));
    }

    // Fallback to mock continuous data if none exist
    if (selectedActivity) {
      const distance = selectedActivity.distance || 10;
      const points = 300;
      return Array.from({ length: points }, (_, i) => {
        const d = (distance / points) * i;
        const basePaceStr = selectedActivity.avgPace || "5:00";
        const [m_base, s_base] = basePaceStr.split(':').map(Number);
        const basePace = m_base + (s_base / 60);
        
        return {
          dist: parseFloat(d.toFixed(3)),
          pace: parseFloat((basePace + (Math.random() * 0.4 - 0.2)).toFixed(2)),
          hr: (selectedActivity.avgHr || 150) + Math.floor(Math.random() * 10 - 5),
          cadence: (selectedActivity.avgCadence || 170) + Math.floor(Math.random() * 6 - 3),
          power: (selectedActivity.avgPower || 250) + Math.floor(Math.random() * 20 - 10),
          altitude: Math.floor(Math.random() * 50),
          temp: (selectedActivity.avgTemp || 20) + (Math.random() * 2 - 1),
          vo: 10 + (Math.random() * 2 - 1),
          gct: 240 + (Math.random() * 20 - 10)
        };
      });
    }

    return [];
  }, [selectedActivity]);

  const formatPace = (decimalPace: number) => {
    const mins = Math.floor(decimalPace);
    const secs = Math.round((decimalPace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] glass-panel p-8 text-center">
        <Award size={48} className="text-textSecondary mb-4 opacity-20" />
        <h2 className="text-2xl font-black text-white mb-2">NO ACTIVITIES FOUND</h2>
        <p className="text-textSecondary max-w-md">
          Upload your TCX files in the Settings tab to see your detailed analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 h-[calc(100vh-120px)] overflow-hidden animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT SIDEBAR: ACTIVITIES LIST */}
      <div className="glass-panel flex flex-col h-full overflow-y-auto p-4 custom-scrollbar">
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
      <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1 custom-scrollbar">
        
        {/* TOP PANEL: METRICS & MAP ROUTE */}
        {selectedActivity && (
          <div className="glass-panel p-6 grid grid-cols-[1.2fr_1fr] gap-6">
            
            {/* Summary Text / Core Stats */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalIcon size={14} className="text-accent" />
                    <span className="text-[0.75rem] text-textSecondary font-semibold">{formatDate(selectedActivity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={startEditing}
                      className="p-1.5 rounded-lg bg-white/[0.03] border border-borderDark hover:border-accent/50 text-textSecondary hover:text-accent transition-all"
                      title="Rename Activity"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteActivity(selectedActivity.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg bg-white/[0.03] border border-borderDark hover:border-red-500/50 text-textSecondary hover:text-red-500 transition-all disabled:opacity-50"
                      title="Delete Activity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-brandSecondary border border-accent rounded-lg px-3 py-1.5 text-white font-bold text-lg flex-1 outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameActivity();
                        if (e.key === 'Escape') setIsEditing(false);
                      }}
                    />
                    <button 
                      onClick={handleRenameActivity}
                      className="p-2 bg-accent text-brandBg rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-white/[0.05] text-textSecondary rounded-lg hover:bg-white/[0.1] transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-black text-white mt-1.5">{selectedActivity.title}</h2>
                )}
              </div>
              
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-4 gap-3 my-5">
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
                  <span className="text-[0.62rem] text-textSecondary font-bold block">AVG HR</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.avgHr || '--'} bpm</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">CADENCE</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.avgCadence || '--'} spm</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">ELEVATION</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.elevationGained || 0} m</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">POWER</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.avgPower || '--'} W</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-borderDark rounded-lg">
                  <span className="text-[0.62rem] text-textSecondary font-bold block">TEMP</span>
                  <p className="text-[1.1rem] font-black text-white mt-0.5">{selectedActivity.avgTemp || '--'} °C</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award size={16} className="text-accent" />
                <span className="text-[0.75rem] text-textSecondary font-semibold">
                  Workout Intensity: <span className="text-white font-bold">{selectedActivity.metadata?.intensityFactor ? `${(selectedActivity.metadata.intensityFactor * 100).toFixed(0)}% IF` : 'Threshold (Aerobic Focus)'}</span>
                </span>
              </div>
            </div>

            {/* Advanced Metrics / Training Load */}
            {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-accent" />
                  <h4 className="text-[0.75rem] font-black text-white uppercase tracking-widest">Training Impact</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  {selectedActivity.metadata.aerobicTrainingEffect !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase">Aerobic TE</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent" 
                            style={{ width: `${(selectedActivity.metadata.aerobicTrainingEffect / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[0.85rem] font-black text-white">{selectedActivity.metadata.aerobicTrainingEffect.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {selectedActivity.metadata.anaerobicTrainingEffect !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase">Anaerobic TE</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400" 
                            style={{ width: `${(selectedActivity.metadata.anaerobicTrainingEffect / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[0.85rem] font-black text-white">{selectedActivity.metadata.anaerobicTrainingEffect.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {selectedActivity.metadata.trainingStressScore !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">TSS</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.trainingStressScore)}</span>
                    </div>
                  )}
                  {selectedActivity.metadata.calories !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">Calories</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.calories)} kcal</span>
                    </div>
                  )}
                  {selectedActivity.metadata.recoveryTime !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">Recovery</span>
                      <span className="text-[0.9rem] font-black text-accent">{Math.round(selectedActivity.metadata.recoveryTime)}h</span>
                    </div>
                  )}
                  {selectedActivity.metadata.vo2Max !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">VO2 Max</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.vo2Max)}</span>
                    </div>
                  )}
                  {selectedActivity.metadata.totalAscent !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">Total Ascent</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.totalAscent)}m</span>
                    </div>
                  )}
                  {selectedActivity.metadata.totalDescent !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">Total Descent</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.totalDescent)}m</span>
                    </div>
                  )}
                  {selectedActivity.metadata.totalWork !== undefined && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[0.6rem] text-textSecondary font-bold uppercase">Work</span>
                      <span className="text-[0.9rem] font-black text-white">{Math.round(selectedActivity.metadata.totalWork / 1000)} kJ</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Running Dynamics Section */}
            {selectedActivity.metadata && (
              selectedActivity.metadata.avgStrideLength !== undefined || 
              selectedActivity.metadata.avgVerticalOscillation !== undefined || 
              selectedActivity.metadata.avgGroundContactTime !== undefined
            ) && (
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col justify-center mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-blue-400" />
                  <h4 className="text-[0.75rem] font-black text-white uppercase tracking-widest">Running Dynamics</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedActivity.metadata.avgStrideLength !== undefined && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase block mb-1">Stride Length</span>
                      <p className="text-[1rem] font-black text-white">
                        {(selectedActivity.metadata.avgStrideLength / 100).toFixed(2)} 
                        <span className="text-[0.6rem] text-textSecondary ml-1">m</span>
                      </p>
                    </div>
                  )}
                  {selectedActivity.metadata.avgVerticalOscillation !== undefined && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase block mb-1">Vertical Osc.</span>
                      <p className="text-[1rem] font-black text-white">
                        {(selectedActivity.metadata.avgVerticalOscillation / 10).toFixed(1)} 
                        <span className="text-[0.6rem] text-textSecondary ml-1">cm</span>
                      </p>
                    </div>
                  )}
                  {selectedActivity.metadata.avgGroundContactTime !== undefined && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase block mb-1">GCT</span>
                      <p className="text-[1rem] font-black text-white">
                        {Math.round(selectedActivity.metadata.avgGroundContactTime)} 
                        <span className="text-[0.6rem] text-textSecondary ml-1">ms</span>
                      </p>
                    </div>
                  )}
                  {selectedActivity.metadata.avgGroundContactBalance !== undefined && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                      <span className="text-[0.55rem] text-textMuted font-bold uppercase block mb-1">GCT Balance</span>
                      <p className="text-[1rem] font-black text-white">
                        {(selectedActivity.metadata.avgGroundContactBalance / 100).toFixed(1)}
                        <span className="text-[0.6rem] text-textSecondary ml-1">% L/R</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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

        {/* MIDDLE: CHARTS & SPLITS */}
        {selectedActivity && (
          <div className="grid grid-cols-[1.2fr_1fr] gap-5">
            
            <div className="glass-panel p-6 flex flex-col h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[0.95rem] font-extrabold tracking-wider text-accent uppercase flex items-center gap-2">
                  <TrendingUp size={16} />
                  Performance Chart
                </h3>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button 
                    onClick={() => setShowPace(!showPace)}
                    className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                      showPace ? 'bg-accent text-black border-accent' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                    }`}
                  >
                    PACE
                  </button>
                  {(selectedActivity.avgHr || selectedActivity.maxHr) && (
                    <button 
                      onClick={() => setShowHR(!showHR)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showHR ? 'bg-[#FF3B30] text-white border-[#FF3B30]' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      HR
                    </button>
                  )}
                  {selectedActivity.avgCadence && (
                    <button 
                      onClick={() => setShowCadence(!showCadence)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showCadence ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      CADENCE
                    </button>
                  )}
                  {selectedActivity.avgPower && (
                    <button 
                      onClick={() => setShowPower(!showPower)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showPower ? 'bg-purple-500 text-white border-purple-500' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      POWER
                    </button>
                  )}
                  {selectedActivity.avgTemp !== undefined && selectedActivity.avgTemp !== null && (
                    <button 
                      onClick={() => setShowTemp(!showTemp)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showTemp ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      TEMP
                    </button>
                  )}
                  {selectedActivity.metadata?.avgVerticalOscillation !== undefined && selectedActivity.metadata?.avgVerticalOscillation !== null && (
                    <button 
                      onClick={() => setShowVO(!showVO)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showVO ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      VO
                    </button>
                  )}
                  {selectedActivity.metadata?.avgGroundContactTime !== undefined && selectedActivity.metadata?.avgGroundContactTime !== null && (
                    <button 
                      onClick={() => setShowGCT(!showGCT)}
                      className={`px-2.5 py-1 rounded-md text-[0.65rem] font-black tracking-widest uppercase transition-all border ${
                        showGCT ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent text-textMuted border-white/10 hover:border-white/20'
                      }`}
                    >
                      GCT
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPace" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="dist" 
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        type="number"
                        domain={[0, 'dataMax']}
                        tickFormatter={(val) => `${val.toFixed(1)}`}
                        label={{ value: 'DISTANCE (KM)', position: 'insideBottom', offset: -5, fontSize: 8, fill: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}
                      />
                      {/* Left Axis: Pace */}
                      <YAxis 
                        yAxisId="pace"
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        reversed
                        hide={!showPace}
                        domain={['dataMin - 0.2', 'dataMax + 0.2']}
                        tickFormatter={formatPace}
                      />
                      
                      {/* Right Axis: HR, Cadence, Power, Temp, VO, GCT */}
                      <YAxis 
                        yAxisId="metrics"
                        orientation="right"
                        stroke="rgba(255,255,255,0.3)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        hide={!showHR && !showCadence && !showPower && !showTemp && !showVO && !showGCT}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
                        formatter={(value: any, name: string, props: any) => {
                          const dist = props.payload.dist;
                          if (name === 'pace') return [`${formatPace(value)} /km`, `Pace @ ${dist}km`];
                          if (name === 'hr') return [`${value} bpm`, `Heart Rate @ ${dist}km`];
                          if (name === 'cadence') return [`${value} spm`, `Cadence @ ${dist}km`];
                          if (name === 'power') return [`${value} W`, `Power @ ${dist}km`];
                          if (name === 'temp') return [`${value.toFixed(1)} °C`, `Temperature @ ${dist}km`];
                          if (name === 'vo') return [`${value.toFixed(1)} cm`, `Vertical Oscillation @ ${dist}km`];
                          if (name === 'gct') return [`${value} ms`, `Ground Contact Time @ ${dist}km`];
                          return [value, name];
                        }}
                      />
                      {showPace && (
                        <Area 
                          yAxisId="pace"
                          type="monotone" 
                          dataKey="pace" 
                          stroke="var(--accent)" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorPace)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent)' }}
                        />
                      )}

                      {showHR && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="hr" 
                          stroke="#FF3B30" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#FF3B30' }}
                        />
                      )}
                      
                      {showCadence && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="cadence" 
                          stroke="#3B82F6" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#3B82F6' }}
                        />
                      )}
                      
                      {showPower && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="power" 
                          stroke="#A855F7" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#A855F7' }}
                        />
                      )}

                      {showTemp && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="temp" 
                          stroke="#F97316" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#F97316' }}
                        />
                      )}

                      {showVO && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="vo" 
                          stroke="#22D3EE" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#22D3EE' }}
                        />
                      )}

                      {showGCT && (
                        <Line 
                          yAxisId="metrics"
                          type="monotone" 
                          dataKey="gct" 
                          stroke="#10B981" 
                          strokeWidth={2} 
                          dot={false}
                          connectNulls
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#10B981' }}
                        />
                      )}

                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-white/5 rounded-xl bg-white/[0.01] text-center p-6">
                    <TrendingUp size={32} className="text-textMuted mb-3 opacity-20" />
                    <p className="text-textSecondary text-sm font-medium">Detailed continuous telemetry is being processed</p>
                    <p className="text-textMuted text-[0.7rem] mt-1">Re-upload your activity to see granular performance data</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 flex flex-col h-[360px]">
              <h3 className="text-[0.95rem] font-extrabold mb-6 tracking-wider text-accent uppercase flex items-center gap-2">
                <Clock size={16} />
                Kilometer Splits
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {selectedActivity.splits && selectedActivity.splits.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 px-3 py-2 text-[0.65rem] font-black text-textMuted tracking-widest uppercase border-b border-white/5 mb-2">
                      <span>KM</span>
                      <span>PACE</span>
                      <span>HR</span>
                      <span>CAD</span>
                      <span className="text-right">ELEV</span>
                    </div>
                    
                    {selectedActivity.splits.map((s: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="grid grid-cols-5 px-3 py-3 rounded-lg hover:bg-white/[0.03] transition-colors items-center border-b border-white/[0.02] last:border-0"
                      >
                        <span className="text-sm font-black text-white">{s.split}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-accent">{s.pace}</span>
                        </div>
                        <span className="text-sm font-semibold text-textSecondary">{s.avg_hr ? `${s.avg_hr}` : '--'}</span>
                        <span className="text-sm font-semibold text-textSecondary">{s.avg_cadence ? `${s.avg_cadence}` : '--'}</span>
                        <span className={`text-xs font-bold text-right ${s.elevation_difference > 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                          {s.elevation_difference > 0 ? '+' : ''}{Math.round(s.elevation_difference)}m
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-white/5 rounded-xl bg-white/[0.01] text-center p-6">
                    <Clock size={32} className="text-textMuted mb-3 opacity-20" />
                    <p className="text-textSecondary text-sm font-medium">Split data not available for this session</p>
                    <p className="text-textMuted text-[0.7rem] mt-1">Check back once your training device finishes syncing</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* BOTTOM: AI SUMMARY & REC WORKOUTS */}
        {selectedActivity && (
          <div className="glass-panel p-6 grid grid-cols-[1.2fr_1fr] gap-6 mb-5">
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent" />
                <h3 className="text-[0.95rem] font-extrabold tracking-wider text-white uppercase">AI Session Intelligence</h3>
              </div>
              <p className="text-[0.82rem] text-textSecondary leading-relaxed">
                {selectedActivity.aiSummary || "Your RunSynergy AI coach is processing this session. We're looking at your heart rate decoupling, vertical oscillation efficiency, and ground contact time balance to provide you with elite-level biomechanical feedback."}
              </p>
            </div>

            <div className="border-l border-borderDark pl-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-accent" />
                <span className="text-[0.62rem] text-accent font-extrabold tracking-wider uppercase">Adaptive Training Suggestion</span>
              </div>
              <h4 className="text-base font-extrabold text-white">VO2 Max Progression Intervals</h4>
              <p className="text-[0.78rem] text-textSecondary mt-2 leading-relaxed">
                {selectedActivity.aiWorkoutRecommendation || "Based on the fatigue index from this run, we recommend 48 hours of recovery followed by a high-intensity interval session to peak your aerobic ceiling."}
              </p>
              <div className="flex gap-2.5 mt-5">
                <button className="btn-pill btn-pill-primary !py-2 !px-5 text-[0.72rem]">
                  Update Training Plan
                </button>
                <button className="btn-pill btn-pill-dark !py-2 !px-5 text-[0.72rem]">
                  More Details
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
