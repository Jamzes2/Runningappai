import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users, activities } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfiles = await db.select().from(users).where(eq(users.email, authUser.email!)).limit(1);
    const userProfile = userProfiles[0];
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await db.update(activities)
      .set({ title })
      .where(and(eq(activities.id, id), eq(activities.userId, userProfile.id)));

    return NextResponse.json({ success: true, message: 'Activity updated' });
  } catch (error: any) {
    console.error('Update activity error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !db) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfiles = await db.select().from(users).where(eq(users.email, authUser.email!)).limit(1);
    const userProfile = userProfiles[0];
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.delete(activities)
      .where(and(eq(activities.id, id), eq(activities.userId, userProfile.id)));

    return NextResponse.json({ success: true, message: 'Activity deleted' });
  } catch (error: any) {
    console.error('Delete activity error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete activity' }, { status: 500 });
  }
}
