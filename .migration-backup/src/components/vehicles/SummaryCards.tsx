import { Truck, CheckCircle, AlertTriangle, Clock, PowerOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardsProps {
  total: number;
  active: number;
  atRisk: number;
  delayed: number;
  offline: number;
}

interface CardDef {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
}

export function SummaryCards({
  total,
  active,
  atRisk,
  delayed,
  offline,
}: SummaryCardsProps) {
  const cards: CardDef[] = [
    {
      label: 'Total Vehicles',
      value: total,
      icon: Truck,
      iconClass: 'bg-sky-500/15 text-sky-400',
    },
    {
      label: 'Active',
      value: active,
      icon: CheckCircle,
      iconClass: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      label: 'At Risk',
      value: atRisk,
      icon: AlertTriangle,
      iconClass: 'bg-amber-500/15 text-amber-400',
    },
    {
      label: 'Delayed',
      value: delayed,
      icon: Clock,
      iconClass: 'bg-orange-500/15 text-orange-400',
    },
    {
      label: 'Offline',
      value: offline,
      icon: PowerOff,
      iconClass: 'bg-slate-600/20 text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
