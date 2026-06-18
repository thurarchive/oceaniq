import React from 'react';

type BadgeVariant = 'approved' | 'pending' | 'rejected' | 'flagged' | 'hotspot' | 'active' | 'verified' | 'estimated';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const variantConfig: Record<BadgeVariant, { className: string; defaultLabel: string }> = {
  approved: { className: 'confidence-badge', defaultLabel: 'Approved' },
  pending: { className: 'pending-badge', defaultLabel: 'Pending' },
  rejected: { className: 'hotspot-badge', defaultLabel: 'Rejected' },
  flagged: { className: 'pending-badge', defaultLabel: 'Flagged' },
  hotspot: { className: 'hotspot-badge', defaultLabel: 'Hotspot' },
  active: { className: 'confidence-badge', defaultLabel: 'Active' },
  verified: { className: 'confidence-badge', defaultLabel: 'Verified' },
  estimated: {
    className: 'text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 uppercase tracking-wide',
    defaultLabel: 'ML Estimate',
  },
};

export default function StatusBadge({ variant, label, size = 'sm' }: StatusBadgeProps) {
  const config = variantConfig[variant];
  return (
    <span className={config.className}>
      {label ?? config.defaultLabel}
    </span>
  );
}