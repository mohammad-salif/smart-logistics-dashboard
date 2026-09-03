import { useEffect } from 'react';
import { Truck, AlertTriangle, Route as RouteIcon, X } from 'lucide-react';
import type { Vehicle, Incident, RouteSegment } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  statusToBadgeVariant,
  riskToBadgeVariant,
  incidentStatusToBadgeVariant,
  severityToBadgeVariant,
  routeStatusToBadgeVariant,
} from '@/lib/badgeMappings';

interface DetailPanelProps {
  vehicle?: Vehicle;
  incident?: Incident;
  route?: RouteSegment;
  onClose: () => void;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-2.5 border-b border-slate-700/50 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="text-sm text-slate-200">{children}</span>
    </div>
  );
}

export function DetailPanel({
  vehicle,
  incident,
  route,
  onClose,
}: DetailPanelProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vehicle && !incident && !route) return null;

  return (
    <div
      role="region"
      aria-label="Details panel"
      className="absolute right-4 top-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-md shadow-2xl z-20"
    >
      <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          {vehicle && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                <Truck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Vehicle Details</h3>
            </>
          )}
          {incident && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Incident Details</h3>
            </>
          )}
          {route && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <RouteIcon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Route Details</h3>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-2">
        {vehicle && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-lg font-bold text-white">{vehicle.id}</span>
              <Badge variant={statusToBadgeVariant(vehicle.status)}>
                {vehicle.status.replace('-', ' ')}
              </Badge>
            </div>
            <DetailRow label="Cargo Category">{vehicle.cargoCategory}</DetailRow>
            <DetailRow label="Current Status">
              <span className="capitalize">{vehicle.status.replace('-', ' ')}</span>
            </DetailRow>
            <DetailRow label="Origin">{vehicle.origin}</DetailRow>
            <DetailRow label="Destination">{vehicle.destination}</DetailRow>
            <DetailRow label="Estimated Arrival">{vehicle.estimatedArrival}</DetailRow>
            <DetailRow label="Current Route Status">
              <Badge variant={routeStatusToBadgeVariant(vehicle.routeStatus)}>
                {vehicle.routeStatus.replace('-', ' ')}
              </Badge>
            </DetailRow>
          </>
        )}

        {incident && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-lg font-bold text-white">{incident.id}</span>
              <Badge variant={severityToBadgeVariant(incident.severity)}>
                {incident.severity}
              </Badge>
            </div>
            <DetailRow label="Incident Type">{incident.type}</DetailRow>
            <DetailRow label="Location">{incident.location}</DetailRow>
            <DetailRow label="Severity">
              <span className="capitalize">{incident.severity}</span>
            </DetailRow>
            <DetailRow label="Report Status">
              <Badge variant={incidentStatusToBadgeVariant(incident.status)}>
                {incident.status}
              </Badge>
            </DetailRow>
            <DetailRow label="Timestamp">{incident.timestamp}</DetailRow>
          </>
        )}

        {route && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-lg font-bold text-white">{route.id}</span>
              <Badge variant={routeStatusToBadgeVariant(route.status)}>
                {route.status.replace('-', ' ')}
              </Badge>
            </div>
            <DetailRow label="Route Label">{route.label}</DetailRow>
            <DetailRow label="Route Status">
              <Badge variant={routeStatusToBadgeVariant(route.status)}>
                {route.status.replace('-', ' ')}
              </Badge>
            </DetailRow>
            <DetailRow label="Risk Level">
              <Badge variant={riskToBadgeVariant(route.riskLevel)}>
                {route.riskLevel}
              </Badge>
            </DetailRow>
            <DetailRow label="Estimated Travel Time">
              {route.estimatedTravelTime}
            </DetailRow>
            <DetailRow label="Alternative Available">
              {route.alternativeAvailable ? (
                <span className="text-emerald-400">Yes — alternate route exists</span>
              ) : (
                <span className="text-red-400">No — no alternate available</span>
              )}
            </DetailRow>
          </>
        )}
      </div>
    </div>
  );
}
