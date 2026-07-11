import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client — uses service role key, NEVER exposed to browser
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Verify the caller is an admin via their JWT
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];

  const adminClient = getAdminClient();
  const { data: { user }, error } = await adminClient.auth.getUser(token);
  if (error || !user) return false;

  const role = user.app_metadata?.role || user.user_metadata?.role;
  return role === 'admin';
}

// GET /api/admin/users — list all users
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const adminClient = getAdminClient();
  const { data, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shape the response — only expose what the UI needs
  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    full_name: u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'Unknown',
    role: (u.app_metadata?.role || u.user_metadata?.role || 'user') as string,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return NextResponse.json({ users });
}

// PATCH /api/admin/users — update a user's role
export async function PATCH(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { userId, role } = body as { userId: string; role: string };

  if (!userId || !['user', 'analyst', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid userId or role' }, { status: 400 });
  }

  const adminClient = getAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
