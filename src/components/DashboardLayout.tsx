"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Sparkles, 
  LineChart, 
  Calendar, 
  Dumbbell, 
  Settings, 
  Bell, 
  Search, 
  RefreshCw, 
  User, 
  X,
  MessageSquare,
  Send,
  Zap
} from 'lucide-react';
import Logo from './Logo';

export interface NotificationItem {
  id: string;
  type: string;
  time: string;
  title: string;
  description: string;
  read: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  user?: any;
}

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab,
  notifications,
  setNotifications,
  user
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [floatingAiOpen, setFloatingAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Floating AI chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: 'Hey James! Ready to crush your training today? I noticed your fatigue index is low, perfect day for an interval run.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'coaching', label: 'Coaching', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'strength', label: 'Strength Training', icon: Dumbbell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    const currentMessages = [...chatMessages, userMsg];
    setChatMessages(currentMessages);
    setChatInput('');
    setIsTyping(true);

    try {
      // Fetch from our Next.js API route connecting to OpenRouter
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API server rejected AI connection');
      }

      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content || "I couldn't process your running load trends right now. Keep pushing your baseline.";
      
      setChatMessages(prev => [...prev, { sender: 'coach', text: replyText }]);
    } catch (err) {
      console.error('Failed to communicate with OpenRouter coach API:', err);
      setChatMessages(prev => [...prev, { 
        sender: 'coach', 
        text: "Connection offline. Please ensure your OPENROUTER_API_KEY is configured in your local environment." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen w-screen bg-brandBg overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside 
        style={{ width: sidebarCollapsed ? '70px' : '260px' }}
        className="bg-black/95 border-r border-borderDark flex flex-col transition-all duration-300 z-40 relative"
      >
        {/* Sidebar Header / Logo */}
        <div 
          className="p-6 flex items-center gap-3 border-b border-borderDark cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          {sidebarCollapsed ? (
            <div className="icon-frame" style={{ width: '32px', height: '32px', borderWidth: '1px' }}>
              <span className="font-extrabold italic text-[0.8rem] text-accent">RS</span>
            </div>
          ) : (
            <Logo width={160} height={36} color="var(--accent)" />
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 w-full rounded-xl border-none cursor-pointer text-left transition-all duration-150 font-sans text-[0.9rem] border-l-[3px] ${
                  isActive 
                    ? 'bg-accent/10 text-accent font-bold border-accent' 
                    : 'bg-transparent text-textSecondary font-medium border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-textSecondary'} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Profile & Subscription */}
        <div className="p-4 border-t border-borderDark bg-white/[0.01] flex flex-col gap-3">
          {/* Subscription Badge */}
          {!sidebarCollapsed && (
            <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] text-textSecondary font-semibold">MEMBERSHIP STATUS</p>
                <p className="text-[0.75rem] text-accent font-extrabold tracking-wider">RUNSYNERGY PRO</p>
              </div>
              <Zap size={14} className="text-accent" />
            </div>
          )}

          {/* User profile card */}
          <div className="flex flex-col gap-2">
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-[38px] h-[38px] rounded-full bg-brandSecondary border-[1.5px] border-accent flex items-center justify-center overflow-hidden shadow-glow">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[0.95rem] font-extrabold text-accent">
                    {(user?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1">
                  <p className="text-[0.85rem] font-bold text-white truncate">{user?.fullName || 'Elite Athlete'}</p>
                  <p className="text-[0.7rem] text-textSecondary">{user?.email || 'Analytics Active'}</p>
                </div>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <button 
                onClick={async () => {
                  const { createClient } = await import('@/lib/supabase/client');
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/login';
                }}
                className="text-[0.65rem] font-bold text-textMuted hover:text-red-500 transition-colors uppercase tracking-widest text-left px-1.5"
              >
                Terminate Session
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP FLOATING NAVIGATION */}
        <header className="glass-header h-[70px] flex items-center justify-between px-8 z-30 flex-shrink-0">
          {/* Left Title */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="background-none border-none text-textSecondary cursor-pointer text-[1.25rem] flex items-center p-1"
            >
              ☰
            </button>
            <h1 className="text-[1.2rem] font-extrabold capitalize tracking-wide text-white">
              {activeTab === 'strength' ? 'Strength Training' : activeTab}
            </h1>
          </div>

          {/* Center Search Bar */}
          <div className="relative w-[320px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input 
              type="text" 
              placeholder="Search telemetry, workouts, routes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9.5 pr-3 text-[0.8rem]"
            />
          </div>

          {/* Right Control Bar */}
          <div className="flex items-center gap-5">
            {/* Sync status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] rounded-full border border-borderDark">
              <RefreshCw size={12} className="text-accent" />
              <span className="text-[0.72rem] text-textSecondary font-semibold">GARMIN CONNECTED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block shadow-glowStrong"></span>
            </div>

            {/* Notification trigger */}
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="bg-transparent border-none cursor-pointer relative text-white flex items-center justify-center p-1"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-black text-[0.62rem] font-extrabold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-glowStrong">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Trigger */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full bg-brandSecondary cursor-pointer flex items-center justify-center border border-borderDark overflow-hidden"
            >
              <User size={16} className="text-textSecondary" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-8 overflow-y-auto bg-brandBg relative">
          {children}
        </main>
      </div>

      {/* NOTIFICATIONS PANEL (SLIDE-OUT DRAWERS) */}
      {notificationsOpen && (
        <div className="fixed top-0 right-0 w-[380px] h-screen bg-[#0a0a0a]/96 backdrop-blur-[20px] border-l border-borderDark z-50 flex flex-col animate-slideInRight shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-borderDark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell size={18} className="text-accent" />
              <h2 className="text-[1.1rem] font-bold text-white">Notifications</h2>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="bg-transparent border-none text-accent text-[0.72rem] font-bold cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button 
                onClick={() => setNotificationsOpen(false)}
                className="bg-transparent border-none text-textSecondary cursor-pointer flex items-center"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
            {notifications.length === 0 ? (
              <p className="text-textSecondary text-[0.85rem] text-center mt-5">No notifications</p>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    n.read 
                      ? 'bg-white/[0.02] border-borderDark' 
                      : 'bg-accent/[0.04] border-accent/20'
                  } relative`}
                >
                  {!n.read && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent shadow-glowStrong"></span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.65rem] font-extrabold uppercase tracking-wide ${
                      n.type === 'warning' ? 'text-[#FF3B30]' : n.type === 'insight' ? 'text-accent' : 'text-[#0A84FF]'
                    }`}>
                      {n.type}
                    </span>
                    <span className="text-[0.65rem] text-textMuted">{n.time}</span>
                  </div>
                  <h4 className="text-[0.85rem] font-bold text-white mt-1">{n.title}</h4>
                  <p className="text-[0.78rem] text-textSecondary mt-1 leading-relaxed">{n.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT PANEL */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end gap-3">
        {/* Floating Chat Box */}
        {floatingAiOpen && (
          <div className="w-[360px] h-[450px] bg-[#0c0c0c]/95 backdrop-blur-[20px] border border-borderDark shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="p-4 border-b border-borderDark flex items-center justify-between bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full border border-accent flex items-center justify-center bg-accent/5">
                  <Sparkles size={13} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-[0.85rem] font-bold text-white">RunSynergy AI Coach</h3>
                  <span className="text-[0.62rem] text-accent font-semibold">● ONLINE & ANALYZING</span>
                </div>
              </div>
              <button 
                onClick={() => setFloatingAiOpen(false)}
                className="bg-transparent border-none text-textSecondary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`max-w-[80%] p-2.5 px-3.5 text-[0.78rem] leading-relaxed border ${
                    msg.sender === 'user' 
                      ? 'self-end rounded-t-xl rounded-bl-xl bg-brandSecondary border-borderDark text-white' 
                      : 'self-start rounded-t-xl rounded-br-xl bg-white/[0.03] border-white/[0.05] text-textSecondary'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="self-start p-2.5 px-3.5 rounded-t-xl rounded-br-xl bg-white/[0.03] text-[0.75rem] text-textMuted">
                  Analyzing biometric load...
                </div>
              )}
            </div>

            {/* Chat Footer */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-borderDark flex gap-2 bg-black/20">
              <input 
                type="text" 
                placeholder="Ask about your metrics or schedules..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-borderDark rounded-full px-4 py-2 text-white text-[0.78rem] font-sans focus:outline-none focus:border-accent"
              />
              <button 
                type="submit" 
                className="btn-pill btn-pill-primary !p-2 !w-9 !h-9 !min-w-9 border-none"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        )}

        {/* Floating Bubble Trigger */}
        <button 
          onClick={() => setFloatingAiOpen(!floatingAiOpen)}
          className="w-[54px] h-[54px] rounded-full bg-accent text-black border-none cursor-pointer flex items-center justify-center shadow-glowStrong hover:scale-105 transition-transform"
        >
          {floatingAiOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>

    </div>
  );
}
