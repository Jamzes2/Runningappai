import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length === 0) {
      // Create a new user directly in the database (without Supabase email verification)
      const newUser = await db.insert(users).values({
        email: email,
        fullName: email.split('@')[0],
      }).returning();

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: newUser[0]
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: existingUsers[0]
      });
    }
  } catch (error: any) {
    console.error('Test create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}