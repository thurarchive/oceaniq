'use client';
import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Users, Loader2, Lock, CheckCircle2,
  Mail, Calendar, Clock, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

type UserRole = 'user' | 'analyst' | 'admin';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
}

const ROLE_OPTIONS: { value: UserRole; label: string; color: string }[] = [
  { value: 'user',     label: 'User',     color: 'text-muted-foreground' },
  { value: 'analyst',  label: 'Analyst',  color: 'text-accent' },
  { value: 'admin',    label: 'Admin',    color: 'text-danger' },
];

function getRoleBadge(role: string) {
  switch (role) {
    case 'admin':
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 uppercase tracking-wider">
          Admin
        </span>
      );
    case 'analyst':
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider">
          Analyst
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border uppercase tracking-wider">
          User
        </span>
      );
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function UserRow({
  user,
  currentUserId,
  onRoleChange,
}: {
  user: AdminUser;
  currentUserId: string;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [saving, setSaving] = useState(false);
  const isSelf = user.id === currentUserId;
  const hasChanged = selectedRole !== user.role;

  const handleSave = async () => {
    setSaving(true);
    await onRoleChange(user.id, selectedRole);
    setSaving(false);
  };

  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group flex items-center gap-4 px-5 py-4 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors duration-150">
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
        {initials}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{user.full_name}</p>
          {isSelf && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              You
            </span>
          )}
          {getRoleBadge(user.role)}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Mail size={10} />
            {user.email}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            Joined {formatDate(user.created_at)}
          </span>
          {user.last_sign_in_at && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              Last seen {formatDate(user.last_sign_in_at)}
            </span>
          )}
        </div>
      </div>

      {/* Role selector + Save */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            disabled={isSelf || saving}
            className="appearance-none bg-background/60 hover:bg-background/80 text-xs font-semibold text-foreground pl-3 pr-7 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanged || saving || isSelf}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <CheckCircle2 size={12} />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');

  // ── Auth check ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/auth'); return; }
      const role = session.user.app_metadata?.role || session.user.user_metadata?.role;
      if (role !== 'admin') { router.replace('/'); return; }
      setCurrentUserId(session.user.id);
      setAccessToken(session.access_token);
      setAuthLoading(false);
    });
  }, [router]);

  // ── Load users ──
  const loadUsers = useCallback(async (token: string) => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to fetch users');
      }
      const json = await res.json();
      setUsers(json.users);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) loadUsers(accessToken);
  }, [accessToken, loadUsers]);

  // ── Role update ──
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast.success(`Role updated to ${newRole}`);
      // Optimistically update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      toast.error('Could not update role');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = {
    admin:   users.filter((u) => u.role === 'admin').length,
    analyst: users.filter((u) => u.role === 'analyst').length,
    user:    users.filter((u) => u.role === 'user').length,
  };

  if (authLoading) {
    return (
      <AppLayout currentPath="/admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentPath="/admin">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 wave-bg min-h-screen">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manage user accounts and role access</p>
          </div>
        </div>

        {/* Role summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 mt-5">
          {[
            { label: 'Total Users', value: users.length, color: 'text-foreground', bg: 'bg-muted/20', border: 'border-border/40' },
            { label: 'Analysts', value: roleCounts.analyst, color: 'text-accent', bg: 'bg-accent/8', border: 'border-accent/20' },
            { label: 'Admins', value: roleCounts.admin, color: 'text-danger', bg: 'bg-danger/8', border: 'border-danger/20' },
          ].map((card) => (
            <div key={card.label} className={`glass-card-elevated border ${card.border} ${card.bg} rounded-xl px-5 py-4`}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
              <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="glass-card-elevated border border-border/40 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-card/20">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                All Accounts
                <span className="ml-2 text-xs text-muted-foreground font-normal">({filtered.length})</span>
              </span>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background/50 border border-border text-xs text-foreground placeholder:text-muted-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 w-56"
            />
          </div>

          {/* Rows */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Lock size={24} className="text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">No users found</p>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <div>
              {filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId}
                  onRoleChange={handleRoleChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Role changes take effect on the user's next login session.
          You cannot change your own role.
        </p>
      </div>
    </AppLayout>
  );
}
