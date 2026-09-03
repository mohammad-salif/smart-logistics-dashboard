import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, ClipboardList, Clock3, Siren } from 'lucide-react';

interface IncidentSummary {
  total: number;
  reported: number;
  underReview: number;
  resolved: number;
  highCritical: number;
}

interface IncidentSummaryCardsProps {
  summary: IncidentSummary;
}

const cards: Array<{
  key: keyof IncidentSummary;
  label: string;
  icon: LucideIcon;
  tone: string;
}> = [
  { key: 'total', label: 'Total Incidents', icon: ClipboardList, tone: 'bg-sky-500/15 text-sky-400' },
  { key: 'reported', label: 'Reported', icon: AlertTriangle, tone: 'bg-red-500/15 text-red-400' },
  { key: 'underReview', label: 'Under Review', icon: Clock3, tone: 'bg-amber-500/15 text-amber-400' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, tone: 'bg-emerald-500/15 text-emerald-400' },
  { key: 'highCritical', label: 'High / Critical', icon: Siren, tone: 'bg-orange-500/15 text-orange-400' },
];

export function IncidentSummaryCards({ summary }: IncidentSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 transition-colors hover:border-slate-600/70"
            data-testid={`card-incident-summary-${card.key}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/40 ${card.tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="font-mono text-xl font-bold tabular-nums text-white" data-testid={`text-incident-count-${card.key}`}>
                {summary[card.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}