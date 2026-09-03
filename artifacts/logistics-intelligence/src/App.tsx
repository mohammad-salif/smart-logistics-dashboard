import { useState } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Truck,
  AlertTriangle,
  BellRing,
  Package,
  Route as RouteIcon,
  Settings,
  Radar,
  BarChart3,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { LiveMapPage } from '@/pages/LiveMapPage';
import { RoutesPage } from '@/pages/RoutesPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { DeliveriesPage } from '@/pages/DeliveriesPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { OverviewPage } from '@/pages/OverviewPage';

type NavKey =
  | 'overview'
  | 'live-map'
  | 'routes'
  | 'vehicles'
  | 'incidents'
  | 'alerts'
  | 'deliveries'
  | 'analytics'
  | 'settings';

interface NavItem {
  key: NavKey;
  label: string;
  icon: typeof Truck;
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'live-map', label: 'Live Map', icon: MapIcon },
  { key: 'routes', label: 'Routes', icon: RouteIcon },
  { key: 'vehicles', label: 'Vehicles', icon: Truck },
  { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { key: 'alerts', label: 'Alerts', icon: BellRing },
  { key: 'deliveries', label: 'Deliveries', icon: Package },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const placeholderPages: Record<NavKey, string> = {
  overview: 'Overview',
  'live-map': '',
  routes: 'Routes',
  vehicles: 'Vehicles',
  incidents: 'Incidents',
  alerts: 'Alerts',
  deliveries: 'Deliveries',
  analytics: '',
  settings: 'Settings',
};

function App() {
  const [activePage, setActivePage] = useState<NavKey>('overview');

  let content: ReactNode;
  if (activePage === 'live-map') {
    content = <LiveMapPage />;
  } else if (activePage === 'overview') {
    content = <OverviewPage />;
  } else if (activePage === 'routes') {
    content = <RoutesPage />;
  } else if (activePage === 'vehicles') {
    content = <VehiclesPage />;
  } else if (activePage === 'incidents') {
    content = <IncidentsPage />;
  } else if (activePage === 'alerts') {
    content = <AlertsPage />;
  } else if (activePage === 'deliveries') {
    content = <DeliveriesPage />;
  } else if (activePage === 'analytics') {
    content = <AnalyticsPage />;
  } else {
    content = (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
        <h2 className="text-xl font-semibold text-slate-400">
          {placeholderPages[activePage]}
        </h2>
        <p className="text-sm">This page has not been built yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <aside
        aria-label="Operations Navigation"
        className="flex w-16 flex-col border-r border-slate-800/80 bg-slate-900 lg:w-60"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-800/80 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/15 text-sky-400 shadow-sm">
            <Radar className="h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold leading-tight text-white">
              Logistics Intelligence
            </h1>
            <p className="text-[11px] font-medium tracking-wide text-slate-400">
              Operations Platform
            </p>
          </div>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActivePage(item.key)}
                aria-current={isActive ? 'page' : undefined}
                title={item.label}
                aria-label={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isActive
                    ? 'border border-sky-500/30 bg-sky-500/15 text-sky-200 shadow-sm'
                    : 'border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-2 lg:p-4">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-2 lg:justify-start lg:px-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="hidden text-[11px] font-medium text-amber-300/90 lg:inline">
              Simulated data — demo environment
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-y-auto focus:outline-none" tabIndex={-1}>
        {content}
      </main>
    </div>
  );
}

export default App;
