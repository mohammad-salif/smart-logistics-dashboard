import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Ban,
  BellRing,
  Clock3,
  History,
  MapPinned,
  PackageCheck,
  Route as RouteIcon,
  ShieldAlert,
  Truck,
} from 'lucide-react';
import type { Selection } from '@/types';
import { getAlerts } from '@/services/alertService';
import { getDeliveries } from '@/services/deliveryService';
import { getFleetVehicles } from '@/services/fleetService';
import { getIncidents, getRoutes, getVehicles } from '@/services/mapService';
import { getRouteRisk } from '@/services/routeService';
import {
  alertSeverityToBadgeVariant,
  alertStatusToBadgeVariant,
  deliveryStatusToBadgeVariant,
  incidentStatusToBadgeVariant,
  riskToBadgeVariant,
  severityToBadgeVariant,
} from '@/lib/badgeMappings';
import { MapCanvas } from '@/components/map/MapCanvas';
import { Legend } from '@/components/map/Legend';
import { DetailPanel } from '@/components/map/DetailPanel';
import { Badge } from '@/components/ui/Badge';

const alertPriority: Record<string, number> = {
  Critical: 4,
  High: 3,
  Warning: 2,
  Info: 1,
};

const deliveryPriority: Record<string, number> = {
  Delayed: 3,
  'At Risk': 2,
  'In Transit': 1,
  Planned: 0,
  Delivered: 0,
};

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  count,
}: {
  icon: typeof MapPinned;
  eyebrow: string;
  title: string;
  count?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {eyebrow}
          </p>
          <h2 className="truncate text-sm font-semibold text-slate-100">{title}</h2>
        </div>
      </div>
      {count && (
        <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-800/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {count}
        </span>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof Truck;
  tone: 'sky' | 'emerald' | 'amber' | 'red';
}) {
  const toneStyles = {
    sky: {
      icon: 'bg-sky-400/10 text-sky-300',
      value: 'text-sky-100',
      rule: 'bg-sky-400',
    },
    emerald: {
      icon: 'bg-emerald-400/10 text-emerald-300',
      value: 'text-emerald-100',
      rule: 'bg-emerald-400',
    },
    amber: {
      icon: 'bg-amber-400/10 text-amber-300',
      value: 'text-amber-100',
      rule: 'bg-amber-400',
    },
    red: {
      icon: 'bg-red-400/10 text-red-300',
      value: 'text-red-100',
      rule: 'bg-red-400',
    },
  }[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 p-4 shadow-[0_12px_28px_rgba(2,8,23,0.14)]">
      <div className={`absolute inset-x-0 top-0 h-px ${toneStyles.rule} opacity-70`} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium leading-5 text-slate-400">{label}</p>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneStyles.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`mt-3 text-3xl font-semibold tracking-tight ${toneStyles.value}`}>{value}</div>
      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function relatedEntity(alert: ReturnType<typeof getAlerts>[number]) {
  return [alert.routeId, alert.vehicleId, alert.deliveryId].filter(Boolean).join(' · ');
}

export function OverviewPage() {
  const vehicles = useMemo(() => getVehicles(), []);
  const routes = useMemo(() => getRoutes(), []);
  const incidents = useMemo(() => getIncidents(), []);
  const fleetVehicles = useMemo(() => getFleetVehicles(), []);
  const alerts = useMemo(() => getAlerts(), []);
  const deliveries = useMemo(() => getDeliveries(), []);
  const [selection, setSelection] = useState<Selection | null>(null);

  const activeFleetCount = fleetVehicles.filter((vehicle) => vehicle.status === 'Active').length;
  const accessibleRoutes = routes.filter((route) => route.status === 'accessible').length;
  const highRiskRoutes = routes.filter(
    (route) => route.riskLevel === 'high' || route.riskLevel === 'critical',
  ).length;
  const blockedRoutes = routes.filter((route) => route.status === 'blocked').length;
  const activeDeliveries = deliveries.filter((delivery) =>
    ['In Transit', 'Delayed', 'At Risk'].includes(delivery.status),
  ).length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === 'Critical').length;

  const priorityAlerts = useMemo(
    () =>
      alerts
        .filter((alert) => alert.status !== 'Resolved')
        .sort(
          (first, second) =>
            alertPriority[second.severity] - alertPriority[first.severity],
        )
        .slice(0, 5),
    [alerts],
  );

  const priorityDeliveries = useMemo(
    () =>
      deliveries
        .filter((delivery) =>
          ['In Transit', 'Delayed', 'At Risk'].includes(delivery.status),
        )
        .sort(
          (first, second) =>
            deliveryPriority[second.status] - deliveryPriority[first.status],
        )
        .slice(0, 5),
    [deliveries],
  );

  const selectedVehicle =
    selection?.type === 'vehicle'
      ? vehicles.find((vehicle) => vehicle.id === selection.id)
      : undefined;
  const selectedIncident =
    selection?.type === 'incident'
      ? incidents.find((incident) => incident.id === selection.id)
      : undefined;
  const selectedRoute =
    selection?.type === 'route'
      ? routes.find((route) => route.id === selection.id)
      : undefined;

  return (
    <div className="min-h-full bg-slate-950 px-4 py-5 text-slate-100 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-5">
        <header className="flex flex-col gap-4 border-b border-slate-800/80 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Overview</h1>
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Scenario snapshot
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Operational posture across the simulated network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2 xl:self-auto">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="text-xs font-medium text-amber-200">
              Simulated operational data — demo environment
            </span>
          </div>
        </header>

        <section aria-label="Operational key performance indicators" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Active Vehicles" value={activeFleetCount} detail="Fleet status: Active" icon={Truck} tone="sky" />
          <KpiCard label="Accessible Routes" value={accessibleRoutes} detail="Route status: accessible" icon={RouteIcon} tone="emerald" />
          <KpiCard label="High-Risk Routes" value={highRiskRoutes} detail="Risk level: high or critical" icon={ShieldAlert} tone="amber" />
          <KpiCard label="Blocked Routes" value={blockedRoutes} detail="Route status: blocked" icon={Ban} tone="red" />
          <KpiCard label="Active Deliveries" value={activeDeliveries} detail="In Transit, Delayed, At Risk" icon={PackageCheck} tone="sky" />
          <KpiCard label="Critical Alerts" value={criticalAlerts} detail="Alert severity: Critical" icon={BellRing} tone="red" />
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.75fr)]">
          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/70 shadow-[0_14px_34px_rgba(2,8,23,0.16)]">
            <SectionHeader icon={MapPinned} eyebrow="Network picture" title="Route accessibility map" count={`${routes.length} routes · ${vehicles.length} vehicles`} />
            <div className="relative h-[440px] p-3 md:h-[520px] md:p-4">
              <MapCanvas
                vehicles={vehicles}
                routes={routes}
                incidents={incidents}
                activeFilter="all"
                selection={selection}
                onSelect={setSelection}
              />
              <Legend />
              <div className="pointer-events-none absolute bottom-6 right-6 hidden rounded-lg border border-slate-700/70 bg-slate-950/90 px-3 py-2 text-right backdrop-blur-sm sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Map scope</p>
                <p className="mt-1 text-xs text-slate-300">Static scenario network</p>
              </div>
              <DetailPanel
                vehicle={selectedVehicle}
                incident={selectedIncident}
                route={selectedRoute}
                onClose={() => setSelection(null)}
              />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/70 shadow-[0_14px_34px_rgba(2,8,23,0.16)]">
            <SectionHeader icon={BellRing} eyebrow="Needs attention" title="Priority alerts" count={`${priorityAlerts.length} unresolved`} />
            <div className="divide-y divide-slate-800/70">
              {priorityAlerts.map((alert) => (
                <div key={alert.id} className="px-4 py-3.5 transition-colors hover:bg-slate-800/25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-100">{alert.type}</p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">{alert.location}</p>
                      </div>
                    </div>
                    <Badge variant={alertSeverityToBadgeVariant(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 pl-6">
                    <div className="min-w-0">
                      <p className="truncate text-[10px] uppercase tracking-wider text-slate-600">Related entity</p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">{relatedEntity(alert)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={alertStatusToBadgeVariant(alert.status)}>{alert.status}</Badge>
                      <p className="mt-1 text-[10px] text-slate-600">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.75fr)]">
          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/70 shadow-[0_14px_34px_rgba(2,8,23,0.16)]">
            <SectionHeader icon={PackageCheck} eyebrow="In motion" title="Priority deliveries" count={`${priorityDeliveries.length} active`} />
            <div className="p-3 md:p-4">
              <div className="hidden grid-cols-[0.72fr_1fr_1.1fr_1.1fr_0.9fr_0.7fr_0.7fr] gap-3 border-b border-slate-800/80 px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600 md:grid">
                <span>Delivery ID</span>
                <span>Commodity</span>
                <span>Origin</span>
                <span>Destination</span>
                <span>Status</span>
                <span>ETA</span>
                <span>Risk</span>
              </div>
              <div className="divide-y divide-slate-800/70">
                {priorityDeliveries.map((delivery) => {
                  const risk = getRouteRisk(delivery.routeId);
                  return (
                    <div key={delivery.id} className="grid grid-cols-2 gap-x-4 gap-y-3 px-2 py-3.5 md:grid-cols-[0.72fr_1fr_1.1fr_1.1fr_0.9fr_0.7fr_0.7fr] md:items-center md:gap-3">
                      <div>
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Delivery ID</span>
                        <span className="font-mono text-xs font-medium text-sky-300">{delivery.id}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Commodity</span>
                        <span className="block truncate text-xs text-slate-300">{delivery.commodity}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Origin</span>
                        <span className="block truncate text-xs text-slate-400">{delivery.origin}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Destination</span>
                        <span className="block truncate text-xs text-slate-400">{delivery.destination}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Status</span>
                        <Badge variant={deliveryStatusToBadgeVariant(delivery.status)}>{delivery.status}</Badge>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">ETA</span>
                        <span className="text-xs text-slate-300">{delivery.eta}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-600 md:hidden">Risk</span>
                        {risk ? (
                          <Badge variant={riskToBadgeVariant(risk.riskLevel)}>{risk.riskLevel}</Badge>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/70 shadow-[0_14px_34px_rgba(2,8,23,0.16)]">
            <SectionHeader icon={History} eyebrow="Signal history" title="Recent incidents" count={`${incidents.length} reports`} />
            <div className="divide-y divide-slate-800/70">
              {incidents.map((incident) => (
                <div key={incident.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-600">{incident.id}</span>
                        <span className="truncate text-xs font-semibold text-slate-200">{incident.type}</span>
                      </div>
                      <p className="mt-1.5 truncate text-[11px] text-slate-500">{incident.location}</p>
                    </div>
                    <Badge variant={severityToBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pl-0.5">
                    <span className="text-[11px] text-slate-500">Reported {incident.timestamp}</span>
                    <Badge variant={incidentStatusToBadgeVariant(incident.status)}>{incident.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex items-start gap-2 border-t border-slate-800/70 pt-4 text-[11px] leading-5 text-slate-600">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/70" />
          <span>
            This overview uses simulated operational records for demonstration only. It does not represent real-time tracking, GPS positions, road conditions, incidents, predictions, or delivery operations.
          </span>
        </footer>
      </div>
    </div>
  );
}