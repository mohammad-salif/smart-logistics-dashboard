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
            <tr className="border-b border-slate-700/60 bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500">
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
                onClick={() => onSelect(v)}
                className="cursor-pointer border-b border-slate-700/40 transition-colors hover:bg-slate-800/40 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{v.id}</td>
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
                <td className="px-4 py-3 text-slate-300">{v.eta}</td>
                <td className="px-4 py-3 text-slate-500">{v.lastUpdated}</td>
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
            onClick={() => onSelect(v)}
            className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-left transition-colors hover:bg-slate-800/60"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">{v.id}</span>
              <Badge variant={fleetStatusToBadgeVariant(v.status)}>
                {v.status}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>{v.type}</span>
              <span>{v.cargoCategory}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{v.origin} → {v.destination}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge variant={routeStatusToBadgeVariant(v.routeStatus)}>
                {v.routeStatus.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-slate-400">ETA {v.eta}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
