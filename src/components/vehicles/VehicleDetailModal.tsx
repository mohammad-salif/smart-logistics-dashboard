import { Truck, X } from 'lucide-react';
import type { FleetVehicle } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  fleetStatusToBadgeVariant,
  routeStatusToBadgeVariant,
} from '@/lib/badgeMappings';

interface VehicleDetailModalProps {
  vehicle: FleetVehicle;
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

export function VehicleDetailModal({
  vehicle,
  onClose,
}: VehicleDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Vehicle Details</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-2">
          <div className="flex items-center justify-between py-3">
            <span className="text-lg font-bold text-white">{vehicle.id}</span>
            <Badge variant={fleetStatusToBadgeVariant(vehicle.status)}>
              {vehicle.status}
            </Badge>
          </div>
          <DetailRow label="Vehicle Type">{vehicle.type}</DetailRow>
          <DetailRow label="Cargo Category">{vehicle.cargoCategory}</DetailRow>
          <DetailRow label="Origin">{vehicle.origin}</DetailRow>
          <DetailRow label="Destination">{vehicle.destination}</DetailRow>
          <DetailRow label="Current Status">
            <Badge variant={fleetStatusToBadgeVariant(vehicle.status)}>
              {vehicle.status}
            </Badge>
          </DetailRow>
          <DetailRow label="Route Status">
            <Badge variant={routeStatusToBadgeVariant(vehicle.routeStatus)}>
              {vehicle.routeStatus.replace('-', ' ')}
            </Badge>
          </DetailRow>
          <DetailRow label="ETA">{vehicle.eta}</DetailRow>
          <DetailRow label="Last Updated">{vehicle.lastUpdated}</DetailRow>
          <DetailRow label="Current Operational Note">
            {vehicle.operationalNote}
          </DetailRow>
        </div>
      </div>
    </div>
  );
}
