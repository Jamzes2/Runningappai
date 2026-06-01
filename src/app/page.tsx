import React from 'react';
import ClientPage from '@/components/ClientPage';
import { getDashboardData } from '@/lib/data-fetching';

export default async function Home() {
  const data = await getDashboardData();

  return (
    <ClientPage 
      initialUser={data.user} 
      initialRecentActivities={data.recentActivities}
      initialAllActivities={data.allActivities}
      initialStats={data.stats}
      initialWeeklyVolume={data.weeklyVolume}
    />
  );
}
