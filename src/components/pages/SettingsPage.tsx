"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link as LinkIcon, RefreshCw, Check, AlertCircle, Upload, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsPageProps {
  user?: any;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [lastUploadTime, setLastUploadTime] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Check local storage for last upload time if available
    const savedTime = localStorage.getItem('last_tcx_upload');
    if (savedTime) {
      setLastUploadTime(new Date(savedTime).toLocaleString());
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.tcx', '.gpx', '.fit'];
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      setStatusMessage({ type: 'error', text: 'Please upload a valid .tcx, .gpx, or .fit file.' });
      return;
    }

    setUploadLoading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/activities/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({ type: 'success', text: `Successfully uploaded: ${file.name}` });
        const now = new Date().toISOString();
        setLastUploadTime(new Date(now).toLocaleString());
        localStorage.setItem('last_activity_upload', now);
        router.refresh();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.message || 'An error occurred during upload' });
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">SETTINGS</h1>
        <p className="text-textSecondary">Manage your RunSynergy data and preferences.</p>
      </div>

      {/* Activity Data Upload */}
      <div className="glass-panel p-8 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Upload size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">DATA IMPORT</h2>
              <p className="text-textSecondary text-sm">Upload activity files from your Garmin, Coros, Wahoo, or Apple Watch</p>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            statusMessage.type === 'success' 
              ? 'bg-accent/10 border border-accent/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {statusMessage.type === 'success' ? (
              <Check size={18} className="text-accent" />
            ) : (
              <AlertCircle size={18} className="text-red-400" />
            )}
            <p className={statusMessage.type === 'success' ? 'text-accent' : 'text-red-400'}>
              {statusMessage.text}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".tcx,.gpx,.fit"
            className="hidden"
          />
          
          <button
            onClick={handleFileSelect}
            disabled={uploadLoading}
            className="w-full px-6 py-8 border-2 border-dashed border-white/10 rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            {uploadLoading ? (
              <>
                <RefreshCw size={32} className="text-accent animate-spin" />
                <span className="text-white font-bold uppercase tracking-wider">PROCESSING FILE...</span>
              </>
            ) : (
              <>
                <FileText size={32} className="text-textSecondary group-hover:text-accent transition-colors" />
                <div className="text-center">
                  <span className="text-white font-bold block uppercase tracking-wider">Select Activity File</span>
                  <span className="text-textSecondary text-xs">Supports .tcx, .gpx, and .fit</span>
                </div>
              </>
            )}
          </button>

          {lastUploadTime && (
            <p className="text-textSecondary text-sm text-center">
              Last upload: {lastUploadTime}
            </p>
          )}

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-textSecondary text-sm">
              <strong className="text-white">Supported Formats:</strong>
              <br />
              We now support TCX, GPX, and FIT files. These formats capture your full GPS, heart rate, and cadence telemetry for deep performance analysis.
            </p>
          </div>
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
