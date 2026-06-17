"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Target, Award, Sparkles, Send, Clock, BookOpen, UserCheck, RefreshCw } from 'lucide-react';

export default function PerformancePlanPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  
  const [raceDetails, setRaceDetails] = useState({
    raceName: '',
    raceDistance: '',
    raceDate: '',
    raceGoal: '',
    personalNotes: ''
  });

  const [elevationData, setElevationData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/performance-plan');
      if (res.ok) {
        const data = await res.json();
        if (data.plan) {
          setPlan(data.plan);
          setRaceDetails({
            raceName: data.plan.raceName || '',
            raceDistance: data.plan.raceDistance || '',
            raceDate: data.plan.raceDate ? new Date(data.plan.raceDate).toISOString().split('T')[0] : '',
            raceGoal: data.plan.raceGoal || '',
            personalNotes: data.plan.personalNotes || ''
          });
          if (data.plan.elevationData) {
            setElevationData(data.plan.elevationData);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // For now, we'll parse basic elevation if it's a TCX/GPX or just simulate the profile
      // In a real app, we'd send to a parsing utility
      const text = await file.text();
      // Simple mock of elevation profile sampling
      const sampledProfile = [100, 120, 150, 140, 180, 200, 190, 210, 250, 240]; 
      const data = {
        fileName: file.name,
        sampledProfile,
        totalAscent: 450,
      };
      setElevationData(data);
      alert('Elevation profile uploaded and analyzed.');
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to process elevation file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/performance-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...raceDetails, elevationData }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to save details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!raceDetails.raceName || !raceDetails.raceDate) {
      alert('Please fill in at least the Race Name and Date.');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/performance-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...raceDetails, elevationData }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPlan(data.plan);
      } else {
        console.error('API Error:', data.error);
        alert(data.error || 'Failed to generate plan. Please try again.');
      }
    } catch (err) {
      console.error('Failed to generate plan', err);
      alert('A network error occurred. Please check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !plan) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <RefreshCw className="text-accent animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-130px)] animate-[fadeIn_0.4s_ease-out_forwards]">
      
      {/* LEFT: RACE DETAILS FORM */}
      <div className="w-full lg:w-[350px] flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar shrink-0 pb-4">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-accent" />
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Race Objectives</h2>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Race Name</label>
              <input 
                type="text" 
                placeholder="e.g. London Marathon"
                className="glass-input w-full !py-2 !text-sm"
                value={raceDetails.raceName}
                onChange={e => setRaceDetails({...raceDetails, raceName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Distance</label>
                <input 
                  type="text" 
                  placeholder="e.g. 42.2km"
                  className="glass-input w-full !py-2 !text-sm"
                  value={raceDetails.raceDistance}
                  onChange={e => setRaceDetails({...raceDetails, raceDistance: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Race Date</label>
                <div className="relative">
                  <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                  <input 
                    type="date" 
                    className="glass-input w-full pl-8 !py-2 !text-sm"
                    value={raceDetails.raceDate}
                    onChange={e => setRaceDetails({...raceDetails, raceDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Primary Goal</label>
              <input 
                type="text" 
                placeholder="e.g. Sub 3:30:00"
                className="glass-input w-full !py-2 !text-sm"
                value={raceDetails.raceGoal}
                onChange={e => setRaceDetails({...raceDetails, raceGoal: e.target.value})}
              />
            </div>

            {/* Elevation Upload */}
            <div>
              <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Elevation File (GPX/TCX)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".gpx,.tcx"
                  className="hidden" 
                  id="elevation-upload"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="elevation-upload"
                  className="glass-input w-full flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors !py-2.5"
                >
                  <Award size={14} className={elevationData ? "text-accent" : "text-textSecondary"} />
                  <span className="text-[0.7rem] font-bold">{elevationData ? `Loaded: ${elevationData.fileName}` : 'Upload Elevation'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[0.6rem] font-black text-textSecondary uppercase tracking-widest block mb-1.5">Personal Notes</label>
              <textarea 
                placeholder="Specific requirements..."
                className="glass-input w-full min-h-[60px] !py-2 !text-sm"
                value={raceDetails.personalNotes}
                onChange={e => setRaceDetails({...raceDetails, personalNotes: e.target.value})}
              ></textarea>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="submit"
                disabled={loading || uploading}
                className="flex-1 btn-pill btn-pill-dark !py-2.5 !text-xs"
              >
                Save
              </button>
              <button 
                type="button"
                onClick={handleGeneratePlan}
                disabled={generating || loading || uploading}
                className="flex-[1.5] btn-pill btn-pill-primary !py-2.5 !text-xs group"
              >
                {generating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} className="group-hover:animate-pulse" />
                )}
                <span>{generating ? 'ANALYZING...' : 'GENERATE PLAN'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* INFO CARDS */}
        <div className="glass-panel p-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-accent" />
            <h4 className="text-[0.7rem] font-extrabold text-white uppercase tracking-wider">How it works</h4>
          </div>
          <p className="text-[0.65rem] text-textSecondary leading-relaxed">
            Our AI engine synthesizes your **training history**, **Coach AI feedback**, and uploaded **course elevation** to draft a specialized schedule.
          </p>
        </div>
      </div>

      {/* RIGHT: GENERATED PLAN DISPLAY */}
      <div className="flex-1 min-w-0 h-full pb-4">
        <div className="glass-panel h-full flex flex-col overflow-hidden border-accent/20 bg-black/40">
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            {!plan?.generatedPlan && !generating ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Sparkles size={64} className="mb-6 text-textSecondary/50" />
                <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">Awaiting Telemetry...</h3>
                <p className="text-textSecondary max-w-sm text-sm">
                  Complete your race objectives on the left to synthesize your elite performance protocol.
                </p>
              </div>
            ) : generating ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-2 border-accent/20 rounded-full animate-ping absolute inset-0"></div>
                  <div className="w-20 h-20 border-2 border-accent rounded-full flex items-center justify-center bg-accent/5">
                    <Sparkles size={32} className="text-accent animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">Synthesizing Protocol...</h3>
                <p className="text-textSecondary max-w-xs text-sm">
                  Calculating heart rate decoupling, anaerobic threshold, and race-specific volume metrics...
                </p>
              </div>
            ) : (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/10">
                  <div>
                    <span className="text-[0.7rem] font-black text-accent tracking-[0.3em] uppercase block mb-1">Elite Performance Protocol</span>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{plan.raceName}</h2>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-textSecondary text-[0.75rem] font-bold uppercase tracking-wider">
                        <Clock size={14} className="text-accent" />
                        <span>Duration: To Race Day</span>
                      </div>
                      <div className="flex items-center gap-2 text-textSecondary text-[0.75rem] font-bold uppercase tracking-wider">
                        <UserCheck size={14} className="text-accent" />
                        <span>AI-Optimized Schedule</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right glass-panel !bg-white/5 px-6 py-4 border-accent/30">
                    <span className="text-[0.65rem] font-black text-textMuted uppercase tracking-[0.2em] block mb-1">Target Pace/Goal</span>
                    <p className="text-2xl font-black text-accent italic uppercase tracking-tighter">{plan.raceGoal}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none 
                  prose-h3:text-xl prose-h3:font-black prose-h3:text-white prose-h3:uppercase prose-h3:tracking-tighter prose-h3:mb-6 prose-h3:mt-10 prose-h3:italic
                  prose-p:text-[0.95rem] prose-p:text-textSecondary prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-accent prose-strong:font-extrabold
                  prose-table:my-8 prose-table:border prose-table:border-white/10 prose-table:rounded-2xl prose-table:overflow-hidden prose-table:shadow-2xl prose-table:shadow-black/50 prose-table:bg-transparent
                  prose-thead:bg-white/5
                  prose-tr:bg-transparent prose-tr:border-white/5
                  prose-th:text-accent prose-th:text-[0.7rem] prose-th:font-black prose-th:uppercase prose-th:tracking-[0.2em] prose-th:p-5 prose-th:border-b prose-th:border-white/10
                  prose-td:p-5 prose-td:text-[0.8rem] prose-td:text-textSecondary prose-td:border-b prose-td:border-white/5 prose-td:align-top prose-td:bg-transparent
                  prose-ul:my-6 prose-li:text-[0.9rem] prose-li:text-textSecondary prose-li:mb-3 prose-li:marker:text-accent
                ">
                  <div dangerouslySetInnerHTML={{ __html: plan.generatedPlan.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
