import type { FleetVehicle } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  fleetStatusToBadgeVariant,
  routeStatusToBadgeVariant,
} from '@/lib/badgeMappings';

interface VehicleTableProps {
  vehicles: FleetVehicle[];
  onSelect: (vehicle: FleetVehicle) => void;
}

export function VehicleTable({ vehicles, onSelect }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/30 py-16">
        <p className="text-sm text-slate-500">No vehicles match the current filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-700/60 lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">Vehicle ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Origin</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">ETA</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr
                key={v.id}
                tabIndex={0}
                role="button"
                aria-label={`View details for vehicle ${v.id}`}
                onClick={() => onSelect(v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(v);
                  }
                }}
                className="cursor-pointer border-b border-slate-700/40 transition-colors hover:bg-slate-800/40 focus-visible:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-500/60 last:border-0"
              >
                <td className="px-4 py-3 font-mono font-semibold text-slate-100">{v.id}</td>
                <td className="px-4 py-3 text-slate-300">{v.type}</td>
                <td className="px-4 py-3 text-slate-300">{v.cargoCategory}</td>
                <td className="px-4 py-3 text-slate-400">{v.origin}</td>
                <td className="px-4 py-3 text-slate-400">{v.destination}</td>
                <td className="px-4 py-3">
                  <Badge variant={fleetStatusToBadgeVariant(v.status)}>
                    {v.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={routeStatusToBadgeVariant(v.routeStatus)}>
                    {v.routeStatus.replace('-', ' ')}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{v.eta}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{v.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {vehicles.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v)}
            className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-left transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-white">{v.id}</span>
              <Badge variant={fleetStatusToBadgeVariant(v.status)}>
                {v.status}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>{v.type}</span>
              <span>·</span>
              <span>{v.cargoCategory}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-slate-400">
              <span>{v.origin}</span>
              <span className="text-slate-600">→</span>
              <span>{v.destination}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-700/40 pt-2.5">
              <Badge variant={routeStatusToBadgeVariant(v.routeStatus)}>
                {v.routeStatus.replace('-', ' ')}
              </Badge>
              <span className="font-mono text-xs text-slate-300">ETA {v.eta}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
