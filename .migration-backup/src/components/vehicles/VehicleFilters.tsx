import { Search, LayoutGrid, CheckCircle, Clock, PowerOff, AlertTriangle, OctagonX, Truck } from 'lucide-react';
import type { VehicleListFilter } from '@/types';

interface VehicleFiltersProps {
  activeFilter: VehicleListFilter;
  onFilterChange: (filter: VehicleListFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const filters: { key: VehicleListFilter; label: string; icon: typeof Truck }[] = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'Active', label: 'Active', icon: CheckCircle },
  { key: 'Delayed', label: 'Delayed', icon: Clock },
  { key: 'Offline', label: 'Offline', icon: PowerOff },
  { key: 'At Risk', label: 'At Risk', icon: AlertTriangle },
  { key: 'Blocked', label: 'Blocked', icon: OctagonX },
];

export function VehicleFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
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

      <div className="relative lg:w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search ID, origin, destination, cargo..."
          className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 py-2 pl-10 pr-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-sky-500/50 focus:bg-slate-800"
        />
      </div>
    </div>
  );
}
