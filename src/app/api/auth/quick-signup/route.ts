import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up with email and password (will require email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3002/auth/callback`,
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Try to immediately confirm the email (for testing)
    const { data: adminData, error: adminError } = await supabase.auth.admin.updateUserById(
      data.user!.id,
      { email_confirm: true }
    );

    return NextResponse.json({
      success: true,
      message: 'User created and email confirmed',
      user: data.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}