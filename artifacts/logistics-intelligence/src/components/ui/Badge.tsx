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
  accessible: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'at-risk': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  blocked: 'bg-red-500/15 text-red-300 border-red-500/30',
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  moderate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  critical: 'bg-red-500/15 text-red-300 border-red-500/30',
  'in-transit': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  idle: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  loading: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  delayed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  maintenance: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  reported: 'bg-red-500/15 text-red-300 border-red-500/30',
  'under-review': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  neutral: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  offline: 'bg-slate-700/40 text-slate-400 border-slate-600/40',
};

const dotStyles: Record<BadgeVariant, string> = {
  accessible: 'bg-emerald-400',
  'at-risk': 'bg-amber-400',
  blocked: 'bg-red-400',
  low: 'bg-emerald-400',
  moderate: 'bg-amber-400',
  high: 'bg-orange-400',
  critical: 'bg-red-400',
  'in-transit': 'bg-sky-400',
  idle: 'bg-slate-400',
  loading: 'bg-violet-400',
  delayed: 'bg-amber-400',
  maintenance: 'bg-slate-400',
  reported: 'bg-red-400',
  'under-review': 'bg-amber-400',
  resolved: 'bg-emerald-400',
  neutral: 'bg-slate-400',
  active: 'bg-emerald-400',
  offline: 'bg-slate-500',
};

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
  showDot?: boolean;
}

export function Badge({ variant, children, className = '', showDot = true }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
