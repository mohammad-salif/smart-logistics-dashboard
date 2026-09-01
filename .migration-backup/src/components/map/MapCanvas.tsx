import type { Vehicle, RouteSegment, Incident, MapFilter, Selection } from '@/types';

interface MapCanvasProps {
  vehicles: Vehicle[];
  routes: RouteSegment[];
  incidents: Incident[];
  activeFilter: MapFilter;
  selection: Selection | null;
  onSelect: (selection: Selection) => void;
}

const VIEW_W = 1000;
const VIEW_H = 600;

const routeColors: Record<string, string> = {
  accessible: '#10b981',
  'at-risk': '#f59e0b',
  blocked: '#ef4444',
};

function pointsToPath(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

export function MapCanvas({
  vehicles,
  routes,
  incidents,
  activeFilter,
  selection,
  onSelect,
}: MapCanvasProps) {
  const showVehicles =
    activeFilter === 'all' || activeFilter === 'vehicles';
  const showAccessible =
    activeFilter === 'all' || activeFilter === 'accessible';
  const showAtRisk = activeFilter === 'all' || activeFilter === 'at-risk';
  const showBlocked = activeFilter === 'all' || activeFilter === 'blocked';
  const showIncidents =
    activeFilter === 'all' || activeFilter === 'incidents';

  const routeVisible = (r: RouteSegment): boolean => {
    if (r.status === 'accessible') return showAccessible;
    if (r.status === 'at-risk') return showAtRisk;
    if (r.status === 'blocked') return showBlocked;
    return false;
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />
        <rect width={VIEW_W} height={VIEW_H} fill="url(#glow)" />

        {/* Abstract region zones */}
        <g opacity="0.4">
          <path
            d="M 50 50 L 300 50 L 350 250 L 100 300 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <path
            d="M 400 50 L 750 50 L 800 250 L 450 200 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <path
            d="M 100 350 L 450 300 L 500 550 L 150 550 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <path
            d="M 550 300 L 850 280 L 880 550 L 580 550 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
        </g>

        {/* Zone labels */}
        <g fill="#334155" fontSize="11" fontWeight="600">
          <text x="160" y="140">Sector A</text>
          <text x="560" y="130">Sector B</text>
          <text x="260" y="450">Sector C</text>
          <text x="680" y="430">Sector D</text>
        </g>

        {/* Route segments */}
        <g>
          {routes.map((route) => {
            if (!routeVisible(route)) return null;
            const color = routeColors[route.status];
            const isSelected =
              selection?.type === 'route' && selection.id === route.id;
            const isBlocked = route.status === 'blocked';
            const isAtRisk = route.status === 'at-risk';

            return (
              <g
                key={route.id}
                onClick={() => onSelect({ type: 'route', id: route.id })}
                className="cursor-pointer"
              >
                {/* Hit area */}
                <path
                  d={pointsToPath(route.points)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                />
                {/* Visible route line */}
                <path
                  d={pointsToPath(route.points)}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? 5 : 3.5}
                  strokeDasharray={
                    isBlocked
                      ? '2 6'
                      : isAtRisk
                        ? '10 6'
                        : undefined
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isSelected ? 1 : 0.8}
                />
                {/* Blocked indicator */}
                {isBlocked && (
                  <g
                    transform={`translate(${route.points[Math.floor(route.points.length / 2)].x} ${route.points[Math.floor(route.points.length / 2)].y})`}
                  >
                    <circle
                      r="10"
                      fill="#ef4444"
                      fillOpacity="0.2"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="-5"
                      y1="-5"
                      x2="5"
                      y2="5"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="5"
                      y1="-5"
                      x2="-5"
                      y2="5"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Incidents */}
        {showIncidents &&
          incidents.map((inc) => {
            const isSelected =
              selection?.type === 'incident' && selection.id === inc.id;
            return (
              <g
                key={inc.id}
                onClick={() => onSelect({ type: 'incident', id: inc.id })}
                className="cursor-pointer"
              >
                <circle
                  cx={inc.position.x}
                  cy={inc.position.y}
                  r={isSelected ? 18 : 14}
                  fill="#ef4444"
                  fillOpacity="0.15"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  className="transition-all"
                />
                <g
                  transform={`translate(${inc.position.x - 7} ${inc.position.y - 7})`}
                  fill="#ef4444"
                >
                  <path d="M7 0 L14 12 L0 12 Z" fill="#ef4444" />
                  <rect x="6" y="3" width="2" height="5" fill="#0f172a" rx="1" />
                  <rect x="6" y="9" width="2" height="2" fill="#0f172a" rx="1" />
                </g>
              </g>
            );
          })}

        {/* Vehicles */}
        {showVehicles &&
          vehicles.map((v) => {
            const isSelected =
              selection?.type === 'vehicle' && selection.id === v.id;
            const color =
              v.routeStatus === 'blocked'
                ? '#ef4444'
                : v.routeStatus === 'at-risk'
                  ? '#f59e0b'
                  : '#38bdf8';
            return (
              <g
                key={v.id}
                onClick={() => onSelect({ type: 'vehicle', id: v.id })}
                className="cursor-pointer"
              >
                <circle
                  cx={v.position.x}
                  cy={v.position.y}
                  r={isSelected ? 16 : 12}
                  fill={color}
                  fillOpacity="0.15"
                  stroke={color}
                  strokeWidth="2"
                  className="transition-all"
                />
                <g
                  transform={`translate(${v.position.x - 8} ${v.position.y - 8})`}
                >
                  <rect
                    x="2"
                    y="4"
                    width="12"
                    height="8"
                    rx="1.5"
                    fill={color}
                  />
                  <rect x="3" y="5" width="10" height="4" rx="1" fill="#0f172a" />
                  <circle cx="5" cy="13" r="1.5" fill="#0f172a" />
                  <circle cx="11" cy="13" r="1.5" fill="#0f172a" />
                </g>
              </g>
            );
          })}
      </svg>

      {/* Simulated data label */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 backdrop-blur-sm">
        Simulated view — not live GPS data
      </div>
    </div>
  );
}
