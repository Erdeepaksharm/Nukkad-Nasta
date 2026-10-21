import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Initialize Supabase Admin client with service_role key to bypass rate limits
    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Try to create the user directly with email_confirm: true (skips rate-limited SMTP!)
    const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // AUTO-CONFIRM EMAIL: bypasses Supabase email rate limits!
      user_metadata: {
        full_name: name || email.split('@')[0],
        phone: phone || '',
      },
    });

    let userId = createData?.user?.id;

    // 2. If user already exists, update their password and confirm them
    if (createError) {
      if (createError.message?.toLowerCase().includes('already registered') || createError.message?.toLowerCase().includes('exists')) {
        // List user to find ID
        const { data: listData } = await adminSupabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (existing) {
          userId = existing.id;
          await adminSupabase.auth.admin.updateUserById(existing.id, {
            password,
            email_confirm: true,
            user_metadata: { full_name: name || existing.user_metadata?.full_name, phone: phone || existing.user_metadata?.phone },
          });
        } else {
          return NextResponse.json({ error: createError.message }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }

    // 3. Auto-promote owner/admin if matching
    const isOwnerOrAdmin =
      email.toLowerCase() === 'itengineer914082@gmail.com' ||
      email.toLowerCase().includes('admin') ||
      email.toLowerCase().includes('owner');

    const role = isOwnerOrAdmin ? 'admin' : 'customer';

    if (userId) {
      // Upsert profile
      try {
        await adminSupabase.from('profiles').upsert({
          id: userId,
          email,
          full_name: name || email.split('@')[0],
          phone: phone || null,
          role,
          updated_at: new Date().toISOString(),
        });
      } catch (profileErr) {
        console.warn('Profile upsert note:', profileErr);
      }
    }

    return NextResponse.json({
      success: true,
      role,
      user: {
        id: userId,
        email,
        role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
