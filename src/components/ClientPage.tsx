"use client";

import React, { useState } from 'react';
import DashboardLayout, { NotificationItem } from '@/components/DashboardLayout';
import DashboardPage from '@/components/pages/DashboardPage';
import ActivitiesPage from '@/components/pages/ActivitiesPage';
import CoachingPage from '@/components/pages/CoachingPage';
import CalendarPage from '@/components/pages/CalendarPage';
import StrengthPage from '@/components/pages/StrengthPage';
import SettingsPage from '@/components/pages/SettingsPage';
import PerformancePlanPage from '@/components/pages/PerformancePlanPage';

interface ClientPageProps {
  initialUser: any;
  initialRecentActivities: any[];
  initialAllActivities: any[];
  initialStats: any;
  initialWeeklyVolume: any[];
  initialPerformancePlan: any;
}

export default function ClientPage({ 
  initialUser, 
  initialRecentActivities, 
  initialAllActivities,
  initialStats,
  initialWeeklyVolume,
  initialPerformancePlan
}: ClientPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preSelectedActivityId, setPreSelectedActivityId] = useState<string | number | undefined>(undefined);
  
  // Check for tab parameter in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const [user, setUser] = useState(initialUser);
  const [recentActivities, setRecentActivities] = useState(initialRecentActivities);
  const [allActivities, setAllActivities] = useState(initialAllActivities);
  const [stats, setStats] = useState(initialStats);
  const [weeklyVolume, setWeeklyVolume] = useState(initialWeeklyVolume);
  const [performancePlan, setPerformancePlan] = useState(initialPerformancePlan);

  // Update state when props change (e.g., after router.refresh())
  React.useEffect(() => {
    setUser(initialUser);
    setRecentActivities(initialRecentActivities);
    setAllActivities(initialAllActivities);
    setStats(initialStats);
    setWeeklyVolume(initialWeeklyVolume);
    setPerformancePlan(initialPerformancePlan);
  }, [initialUser, initialRecentActivities, initialAllActivities, initialStats, initialWeeklyVolume, initialPerformancePlan]);

  const navigateToActivity = (id: string | number) => {
    setPreSelectedActivityId(id);
    setActiveTab('activities');
  };

  const plannedActivities = React.useMemo(() => {
    if (!performancePlan?.generatedPlan) return [];
    try {
      const parsed = JSON.parse(performancePlan.generatedPlan);
      if (!parsed.weeks) return [];
      
      const activities: any[] = [];
      parsed.weeks.forEach((week: any) => {
        if (week.days) {
          week.days.forEach((day: any) => {
            if (day.workoutType && day.workoutType.toLowerCase() !== 'rest' && day.date) {
              activities.push({
                ...day,
                isPlanned: true,
                // Map fields to match Activity interface if needed
                distance: day.distance ? parseFloat(day.distance.replace(/[^\d.]/g, '')) : 0,
              });
            }
          });
        }
      });
      return activities;
    } catch (e) {
      return [];
    }
  }, [performancePlan]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'insight',
      time: '2m ago',
      title: 'New PR Detected',
      description: 'You crushed your 5km interval split with a 3:55/km pace.',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      time: '1h ago',
      title: 'High Fatigue Index',
      description: 'Your HRV is 15% below baseline. Consider a recovery session.',
      read: false
    }
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage 
            setActiveTab={setActiveTab} 
            user={user} 
            recentActivities={recentActivities}
            stats={stats}
            weeklyVolume={weeklyVolume}
          />
        );
      case 'activities':
        return <ActivitiesPage initialActivities={allActivities} preSelectedId={preSelectedActivityId} />;
      case 'coaching':
        return <CoachingPage />;
      case 'calendar':
        return (
          <CalendarPage 
            initialActivities={allActivities} 
            plannedActivities={plannedActivities}
            onNavigateToActivity={navigateToActivity} 
          />
        );
      case 'strength':
        return <StrengthPage />;
      case 'performance-plan':
        return <PerformancePlanPage />;
      case 'settings':
        return <SettingsPage user={user} />;
      default:
        return (
          <DashboardPage 
            setActiveTab={setActiveTab} 
            user={user} 
            recentActivities={recentActivities}
            stats={stats}
            weeklyVolume={weeklyVolume}
          />
        );
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      notifications={notifications}
      setNotifications={setNotifications}
      user={user}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
