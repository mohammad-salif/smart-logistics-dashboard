import { ArrowRight, Package, Route as RouteIcon } from 'lucide-react';
import type { Delivery, RiskLevel } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { deliveryStatusToBadgeVariant, riskToBadgeVariant } from '@/lib/badgeMappings';

const riskLabels: Record<RiskLevel, string> = {
  low: 'Low',
  moderate: 'Medium',
  high: 'High',
  critical: 'Critical',
};

interface DeliveryTableProps {
  deliveries: Delivery[];
  routeRiskById: Record<string, { level: RiskLevel; score: number }>;
  onSelect: (delivery: Delivery) => void;
}

interface DeliveryRowProps {
  delivery: Delivery;
  routeRiskById: Record<string, { level: RiskLevel; score: number }>;
  onSelect: (delivery: Delivery) => void;
}

function DeliveryRow({
  delivery,
  routeRiskById,
  onSelect,
}: DeliveryRowProps) {
  const risk = routeRiskById[delivery.routeId];
  return (
    <tr
      tabIndex={0}
      onClick={() => onSelect(delivery)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(delivery);
        }
      }}
      data-testid={`row-delivery-${delivery.id}`}
      className="cursor-pointer border-b border-slate-700/40 transition-colors last:border-0 hover:bg-slate-800/40 focus:bg-slate-800/40 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-sky-500/60"
      aria-label={`View details for ${delivery.id}`}
    >
      <td className="px-4 py-3.5 font-semibold text-white">{delivery.id}</td>
      <td className="px-4 py-3.5 text-slate-300">{delivery.commodity}</td>
      <td className="px-4 py-3.5 text-slate-400">{delivery.origin}</td>
      <td className="px-4 py-3.5 text-slate-400">{delivery.destination}</td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-300">{delivery.vehicleId}</td>
      <td className="px-4 py-3.5">
        <Badge variant={deliveryStatusToBadgeVariant(delivery.status)}>{delivery.status}</Badge>
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-slate-300">{delivery.eta}</td>
      <td className="px-4 py-3.5">
        {risk ? (
          <Badge variant={riskToBadgeVariant(risk.level)}>
            {riskLabels[risk.level]} <span className="text-[10px] opacity-70">({risk.score})</span>
          </Badge>
        ) : (
          <span className="text-xs text-slate-600">Unavailable</span>
        )}
      </td>
    </tr>
  );
}

export function DeliveryTable({ deliveries, routeRiskById, onSelect }: DeliveryTableProps) {
  if (deliveries.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/30 px-6 text-center" data-testid="empty-deliveries">
        <Package className="h-7 w-7 text-slate-600" />
        <p className="text-sm font-medium text-slate-400">No deliveries match the current view.</p>
        <p className="text-xs text-slate-600">Try another status or search term.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-700/60 lg:block">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              <th className="px-4 py-3 font-medium">Delivery ID</th>
              <th className="px-4 py-3 font-medium">Commodity</th>
              <th className="px-4 py-3 font-medium">Origin</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Vehicle ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">ETA</th>
              <th className="px-4 py-3 font-medium">Route Risk</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <DeliveryRow key={delivery.id} delivery={delivery} routeRiskById={routeRiskById} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {deliveries.map((delivery) => {
          const risk = routeRiskById[delivery.routeId];
          return (
            <button
              key={delivery.id}
              type="button"
              onClick={() => onSelect(delivery)}
              data-testid={`card-delivery-${delivery.id}`}
              className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-left transition-colors hover:bg-slate-800/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{delivery.id}</p>
                  <p className="mt-1 text-sm text-slate-400">{delivery.commodity}</p>
                </div>
                <Badge variant={deliveryStatusToBadgeVariant(delivery.status)}>{delivery.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <span className="truncate">{delivery.origin}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <span className="truncate">{delivery.destination}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-700/50 pt-3 text-xs">
                <div>
                  <p className="text-slate-600">Vehicle</p>
                  <p className="mt-1 font-mono text-slate-300">{delivery.vehicleId}</p>
                </div>
                <div>
                  <p className="text-slate-600">ETA</p>
                  <p className="mt-1 font-mono text-slate-300">{delivery.eta}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <RouteIcon className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-slate-400">{delivery.routeId}</span>
                </div>
                <div className="text-right">
                  {risk ? <Badge variant={riskToBadgeVariant(risk.level)}>{riskLabels[risk.level]} risk</Badge> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}