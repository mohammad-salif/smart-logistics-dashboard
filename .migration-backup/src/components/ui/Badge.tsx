import type { ReactNode } from 'react';

type BadgeVariant =
  | 'accessible'
  | 'at-risk'
  | 'blocked'
  | 'low'
  | 'moderate'
  | 'high'
  | 'critical'
  | 'in-transit'
  | 'idle'
  | 'loading'
  | 'delayed'
  | 'maintenance'
  | 'reported'
  | 'under-review'
  | 'resolved'
  | 'neutral'
  | 'active'
  | 'offline';

const variantStyles: Record<BadgeVariant, string> = {
  accessible: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'at-risk': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  blocked: 'bg-red-500/15 text-red-400 border-red-500/30',
  low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  'in-transit': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  idle: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  loading: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  delayed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  maintenance: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  reported: 'bg-red-500/15 text-red-400 border-red-500/30',
  'under-review': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  neutral: 'bg-slate-600/20 text-slate-300 border-slate-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  offline: 'bg-slate-600/20 text-slate-500 border-slate-500/30',
};

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
