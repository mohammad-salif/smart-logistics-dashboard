import { LayoutGrid, Truck, CheckCircle, AlertTriangle, OctagonX, Siren } from 'lucide-react';
import type { MapFilter } from '@/types';

interface FilterBarProps {
  activeFilter: MapFilter;
  onChange: (filter: MapFilter) => void;
}

const filters: { key: MapFilter; label: string; icon: typeof Truck }[] = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'vehicles', label: 'Vehicles', icon: Truck },
  { key: 'accessible', label: 'Accessible Routes', icon: CheckCircle },
  { key: 'at-risk', label: 'At-Risk Routes', icon: AlertTriangle },
  { key: 'blocked', label: 'Blocked Routes', icon: OctagonX },
  { key: 'incidents', label: 'Incidents', icon: Siren },
];

export function FilterBar({ activeFilter, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const Icon = f.icon;
        const isActive = activeFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'border-sky-500/50 bg-sky-500/15 text-sky-300'
                : 'border-slate-700/60 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
