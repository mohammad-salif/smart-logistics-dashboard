import { ArrowRight, Clock3, MapPin, Route as RouteIcon, Truck } from 'lucide-react';
import type { Alert } from '@/types';
import { alertSeverityToBadgeVariant, alertStatusToBadgeVariant } from '@/lib/badgeMappings';
import { Badge } from '@/components/ui/Badge';

interface AlertTableProps {
  alerts: Alert[];
  onSelect: (alert: Alert) => void;
}

function AlertRow({ alert, onSelect }: { alert: Alert; onSelect: (alert: Alert) => void }) {
  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={() => onSelect(alert)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(alert);
        }
      }}
      className="cursor-pointer border-b border-slate-700/40 transition-colors last:border-0 hover:bg-slate-800/45 focus-visible:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-500/60"
      aria-label={`View details for alert ${alert.id}`}
      data-testid={`row-alert-${alert.id}`}
    >
      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-white">{alert.id}</td>
      <td className="px-4 py-3.5">
        <span className="font-medium text-slate-200">{alert.type}</span>
      </td>
      <td className="px-4 py-3.5">
        <Badge variant={alertSeverityToBadgeVariant(alert.severity)}>{alert.severity}</Badge>
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-300">{alert.routeId ?? 'No route linked'}</td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{alert.vehicleId ?? 'No vehicle linked'}</td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{alert.deliveryId ?? 'No delivery linked'}</td>
      <td className="max-w-[14rem] px-4 py-3.5 text-slate-400">
        <span className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />{alert.location}</span>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-400">{alert.timestamp}</td>
      <td className="px-4 py-3.5"><Badge variant={alertStatusToBadgeVariant(alert.status)}>{alert.status}</Badge></td>
    </tr>
  );
}

export function AlertTable({ alerts, onSelect }: AlertTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/30 px-5 text-center">
        <AlertTriangleIcon />
        <p className="text-sm font-medium text-slate-300">No alerts match the current view.</p>
        <p className="text-xs text-slate-500">Try clearing the search or selecting a different filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-700/60 lg:block">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">Alert ID</th>
              <th className="px-4 py-3 font-medium">Alert Type</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Related Route</th>
              <th className="px-4 py-3 font-medium">Related Vehicle</th>
              <th className="px-4 py-3 font-medium">Related Delivery</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>{alerts.map((alert) => <AlertRow key={alert.id} alert={alert} onSelect={onSelect} />)}</tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => onSelect(alert)}
            data-testid={`card-alert-${alert.id}`}
            className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-left transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold text-white">{alert.id}</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{alert.type}</p>
              </div>
              <Badge variant={alertSeverityToBadgeVariant(alert.severity)}>{alert.severity}</Badge>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span>{alert.location}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-700/50 pt-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400"><RouteIcon className="h-3.5 w-3.5 text-slate-500" />{alert.routeId ?? 'No route linked'}</span>
              <span className="flex items-center gap-1.5 text-slate-400"><Truck className="h-3.5 w-3.5 text-slate-500" />{alert.vehicleId ?? 'No vehicle linked'}</span>
              <span className="flex items-center gap-1.5 text-slate-500"><Clock3 className="h-3.5 w-3.5" />{alert.timestamp}</span>
              <span className="flex items-center justify-end gap-1.5 text-right"><Badge variant={alertStatusToBadgeVariant(alert.status)}>{alert.status}</Badge><ArrowRight className="h-3.5 w-3.5 text-slate-600" /></span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function AlertTriangleIcon() {
  return <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-500"><Clock3 className="h-4 w-4" /></span>;
}