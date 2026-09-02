import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock3,
  Package,
  ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DeliverySummary {
  total: number;
  planned: number;
  inTransit: number;
  delayed: number;
  delivered: number;
  atRisk: number;
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}

function SummaryCard({ label, value, icon: Icon, tone }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <p className="text-xl font-bold text-white" data-testid={`text-summary-${label.toLowerCase().replaceAll(' ', '-')}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function DeliverySummaryCards({ summary }: { summary: DeliverySummary }) {
  const cards: SummaryCardProps[] = [
    { label: 'Total Deliveries', value: summary.total, icon: Package, tone: 'bg-sky-500/15 text-sky-400' },
    { label: 'Planned', value: summary.planned, icon: CircleDot, tone: 'bg-slate-600/30 text-slate-300' },
    { label: 'In Transit', value: summary.inTransit, icon: Clock3, tone: 'bg-sky-500/15 text-sky-400' },
    { label: 'Delayed', value: summary.delayed, icon: AlertTriangle, tone: 'bg-amber-500/15 text-amber-400' },
    { label: 'Delivered', value: summary.delivered, icon: CheckCircle2, tone: 'bg-emerald-500/15 text-emerald-400' },
    { label: 'At Risk', value: summary.atRisk, icon: ShieldAlert, tone: 'bg-orange-500/15 text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}