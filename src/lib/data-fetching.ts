import { db } from '@/db';
import { activities, users } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, desc, and, gte } from 'drizzle-orm';

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser || !db) {
    return { user: null, recentActivities: [], stats: null, weeklyVolume: [] };
  }

  try {
    // Get user profile from our DB
    const userProfiles = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);
    const userProfile = userProfiles[0];

    if (!userProfile) {
      return { 
        user: { fullName: authUser.email?.split('@')[0] || 'Athlete', email: authUser.email }, 
        recentActivities: [], 
        stats: null,
        weeklyVolume: []
      };
    }

    // Get all activities for this user
    const allActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userProfile.id))
      .orderBy(desc(activities.date));

    // Get recent activities (top 5)
    const recentActivities = allActivities.slice(0, 5);

    // Calculate weekly volume (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const weeklyActivities = allActivities.filter(act => new Date(act.date) >= oneWeekAgo);
    const totalDistance = weeklyActivities.reduce((acc, act) => acc + (act.distance || 0), 0);

    // Group by day for the chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyVolume = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const dayName = days[d.getDay()];
      const distance = allActivities
        .filter(act => {
          const actDate = new Date(act.date);
          return actDate.getDate() === d.getDate() && 
                 actDate.getMonth() === d.getMonth() && 
                 actDate.getFullYear() === d.getFullYear();
        })
        .reduce((acc, act) => acc + (act.distance || 0), 0);
      
      weeklyVolume.push({ day: dayName, distance: parseFloat(distance.toFixed(2)) });
    }

    return {
      user: userProfile,
      recentActivities,
      allActivities,
      stats: {
        weeklyDistance: parseFloat(totalDistance.toFixed(2)),
        activityCount: weeklyActivities.length,
      },
      weeklyVolume
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { 
      user: { fullName: authUser.email?.split('@')[0] || 'Athlete', email: authUser.email }, 
      recentActivities: [], 
      stats: null,
      weeklyVolume: []
    };
  }
}
