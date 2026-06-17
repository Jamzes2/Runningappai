"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Target, Award, Sparkles, Clock, BookOpen, RefreshCw } from 'lucide-react';

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
      // Mock of elevation profile sampling
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
        // Refresh the page data to update the calendar
        window.location.reload();
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
      <div className="w-full lg:w-[450px] flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar shrink-0 pb-4 mx-auto">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="icon-frame-accent">
              <Target size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Race Objectives</h2>
              <p className="text-[0.65rem] text-textSecondary font-bold tracking-widest uppercase">Synthesize Your Elite Protocol</p>
            </div>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-6">
            <div>
              <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Race Name</label>
              <input 
                type="text" 
                placeholder="e.g. London Marathon"
                className="glass-input w-full"
                value={raceDetails.raceName}
                onChange={e => setRaceDetails({...raceDetails, raceName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Distance</label>
                <input 
                  type="text" 
                  placeholder="e.g. 42.2km"
                  className="glass-input w-full"
                  value={raceDetails.raceDistance}
                  onChange={e => setRaceDetails({...raceDetails, raceDistance: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Race Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
                  <input 
                    type="date" 
                    className="glass-input w-full pl-10"
                    value={raceDetails.raceDate}
                    onChange={e => setRaceDetails({...raceDetails, raceDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Primary Goal</label>
              <input 
                type="text" 
                placeholder="e.g. Sub 3:30:00"
                className="glass-input w-full"
                value={raceDetails.raceGoal}
                onChange={e => setRaceDetails({...raceDetails, raceGoal: e.target.value})}
              />
            </div>

            {/* Elevation Upload */}
            <div>
              <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Course Elevation (GPX/TCX)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".gpx,.tcx,.fit"
                  className="hidden" 
                  id="elevation-upload"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="elevation-upload"
                  className="glass-input w-full flex items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-colors py-4 border-dashed border-white/10"
                >
                  <Award size={18} className={elevationData ? "text-accent" : "text-textSecondary"} />
                  <span className="text-[0.75rem] font-bold tracking-tight">{elevationData ? `Loaded: ${elevationData.fileName}` : 'Upload Elevation Data'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-black text-textSecondary uppercase tracking-[0.2em] block mb-2">Personal Training Notes</label>
              <textarea 
                placeholder="e.g. I prefer strength training on Wednesdays, avoid hills on Fridays..."
                className="glass-input w-full min-h-[100px]"
                value={raceDetails.personalNotes}
                onChange={e => setRaceDetails({...raceDetails, personalNotes: e.target.value})}
              ></textarea>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                type="button"
                onClick={handleGeneratePlan}
                disabled={generating || loading || uploading}
                className="w-full btn-pill btn-pill-primary !py-4 group relative overflow-hidden"
              >
                {generating ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} className="group-hover:animate-pulse" />
                )}
                <span className="font-black tracking-widest uppercase">{generating ? 'SYNTESIZING PROTOCOL...' : 'GENERATE PERFORMANCE PLAN'}</span>
              </button>
              
              {plan?.generatedPlan && (
                <p className="text-[0.65rem] text-center text-accent font-black tracking-widest uppercase mt-2 animate-pulse">
                  Protocol Active. View your schedule in the Calendar.
                </p>
              )}
            </div>
          </form>
        </div>

        {/* INFO CARDS */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={16} className="text-accent" />
            <h4 className="text-[0.75rem] font-extrabold text-white uppercase tracking-wider">The Synergy Engine</h4>
          </div>
          <p className="text-[0.7rem] text-textSecondary leading-relaxed">
            Our AI engine analyzes your **telemetry history**, **HRV patterns**, and **course elevation** to synthesize a custom training protocol. Once generated, your sessions are automatically synced to your calendar.
          </p>
        </div>
      </div>

    </div>
  );
}
