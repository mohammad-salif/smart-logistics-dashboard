import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Siren,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AlertSummary {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  highCritical: number;
}

interface AlertSummaryCardsProps {
  summary: AlertSummary;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 transition-colors hover:border-slate-600/70">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/40 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="font-mono text-xl font-bold tabular-nums text-white" data-testid={`text-alert-summary-${label.toLowerCase().replaceAll(' ', '-')}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function AlertSummaryCards({ summary }: AlertSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <SummaryCard label="Total Alerts" value={summary.total} icon={Activity} tone="bg-sky-500/15 text-sky-400" />
      <SummaryCard label="Active" value={summary.active} icon={AlertTriangle} tone="bg-red-500/15 text-red-400" />
      <SummaryCard label="Acknowledged" value={summary.acknowledged} icon={CircleAlert} tone="bg-amber-500/15 text-amber-400" />
      <SummaryCard label="Resolved" value={summary.resolved} icon={CheckCircle2} tone="bg-emerald-500/15 text-emerald-400" />
      <SummaryCard label="High/Critical" value={summary.highCritical} icon={Siren} tone="bg-orange-500/15 text-orange-400" />
    </div>
  );
}