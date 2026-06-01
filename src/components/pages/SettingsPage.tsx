"use client";

import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsPageProps {
  user?: any;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    checkStravaConnection();
    
    // Check for sync status in URL
    if (isClient) {
      const params = new URLSearchParams(window.location.search);
      const syncStatus = params.get('sync');
      const message = params.get('message');
      
      if (syncStatus === 'success') {
        setSyncMessage({ type: 'success', text: 'Strava account connected and activities synced successfully!' });
      } else if (syncStatus === 'error') {
        setSyncMessage({ type: 'error', text: message || 'Failed to connect Strava account.' });
      }
    }
  }, [isClient]);

  const checkStravaConnection = async () => {
    try {
      const response = await fetch('/api/strava/status');
      if (response.ok) {
        const data = await response.json();
        setStravaConnected(data.connected);
        if (data.lastSync) {
          setLastSyncTime(new Date(data.lastSync).toLocaleString());
        }
      }
    } catch (err) {
      console.error('Error checking Strava connection:', err);
    }
  };

  const handleStravaConnect = () => {
    console.log('Connecting to Strava via /api/strava/connect');
    window.location.href = '/api/strava/connect';
  };

  const handleSyncActivities = async () => {
    setSyncLoading(true);
    setSyncMessage(null);

    try {
      const response = await fetch('/api/strava/sync', {
        method: 'POST',
        credentials: 'include', // send cookies for Supabase auth
      });

      const data = await response.json();

      if (response.ok) {
        setSyncMessage({ type: 'success', text: data.message });
        setLastSyncTime(new Date().toLocaleString());
        checkStravaConnection();
        router.refresh();
      } else {
        setSyncMessage({ type: 'error', text: data.error || 'Sync failed' });
      }
    } catch (error: any) {
      setSyncMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">SETTINGS</h1>
        <p className="text-textSecondary">Manage your RunSynergy integrations and preferences.</p>
      </div>

      {/* Strava Integration */}
      <div className="glass-panel p-8 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <LinkIcon size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">STRAVA INTEGRATION</h2>
              <p className="text-textSecondary text-sm">Connect your Strava account to sync running activities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stravaConnected && <Check size={20} className="text-accent" />}
            <span className={`text-sm font-bold ${stravaConnected ? 'text-accent' : 'text-textSecondary'}`}>
              {stravaConnected ? 'CONNECTED' : 'NOT CONNECTED'}
            </span>
          </div>
        </div>

        {syncMessage && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            syncMessage.type === 'success' 
              ? 'bg-accent/10 border border-accent/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {syncMessage.type === 'success' ? (
              <Check size={18} className="text-accent" />
            ) : (
              <AlertCircle size={18} className="text-red-400" />
            )}
            <p className={syncMessage.type === 'success' ? 'text-accent' : 'text-red-400'}>
              {syncMessage.text}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {!stravaConnected ? (
            <button
              onClick={handleStravaConnect}
              className="w-full px-6 py-4 bg-accent text-brandBg font-black uppercase tracking-wider rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <LinkIcon size={18} />
              Connect Strava
            </button>
          ) : (
            <>
              <button
                onClick={handleSyncActivities}
                disabled={syncLoading}
                className="w-full px-6 py-4 bg-accent text-brandBg font-black uppercase tracking-wider rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {syncLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    SYNCING...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    SYNC ACTIVITIES
                  </>
                )}
              </button>

              {lastSyncTime && (
                <p className="text-textSecondary text-sm text-center">
                  Last synced: {lastSyncTime}
                </p>
              )}

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-textSecondary text-sm">
                  <strong className="text-white">Synced Data:</strong>
                  <br />
                  Your running activities are automatically saved and analyzed to provide personalized coaching insights.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div className="glass-panel p-8 rounded-lg">
        <h2 className="text-xl font-black text-white mb-4">ACCOUNT</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-textSecondary">Email</span>
            <span className="text-white font-semibold">{user?.email || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-textSecondary">Name</span>
            <span className="text-white font-semibold">{user?.fullName || 'Not set'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
