"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import ActivitiesPage from '@/components/pages/ActivitiesPage';

export default function DemoPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [afterDate, setAfterDate] = useState('2026-05-12');
  const [beforeDate, setBeforeDate] = useState('2026-05-31');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch from the demo endpoint
        const res = await fetch('/api/demo/activities');
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/demo/sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          after: `${afterDate}T00:00:00Z`, 
          before: `${beforeDate}T23:59:59Z` 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSyncMessage(`✅ ${data.message}`);
        // Refetch activities after sync
        setTimeout(() => {
          fetch('/api/demo/activities').then(r => r.json()).then(d => {
            setActivities(d.activities || []);
          });
        }, 1000);
      } else {
        setSyncMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setSyncMessage(`❌ Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brandBg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-black text-white mb-2">Demo: Your Synced Activities</h1>
          <p className="text-textSecondary mb-4">These are your real Strava activities synced from your account</p>
          
          {syncMessage && (
            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent mb-4">
              {syncMessage}
            </div>
          )}
          
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSecondary uppercase">Sync After</label>
            <input 
              type="date" 
              value={afterDate} 
              onChange={(e) => setAfterDate(e.target.value)}
              className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSecondary uppercase">Sync Before</label>
            <input 
              type="date" 
              value={beforeDate} 
              onChange={(e) => setBeforeDate(e.target.value)}
              className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-6 py-2 bg-accent text-brandBg font-black uppercase rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all h-[42px]"
          >
            {syncing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                SYNCING...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                SYNC RANGE
              </>
            )}
          </button>
        </div>
        </div>
        <ActivitiesPage initialActivities={activities} />
      </div>
    </div>
  );
}
