import { useState } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Truck,
  AlertTriangle,
  Package,
  Settings,
  Radar,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { LiveMapPage } from '@/pages/LiveMapPage';
import { VehiclesPage } from '@/pages/VehiclesPage';

type NavKey = 'overview' | 'live-map' | 'vehicles' | 'incidents' | 'deliveries' | 'settings';

interface NavItem {
  key: NavKey;
  label: string;
  icon: typeof Truck;
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'live-map', label: 'Live Map', icon: MapIcon },
  { key: 'vehicles', label: 'Vehicles', icon: Truck },
  { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { key: 'deliveries', label: 'Deliveries', icon: Package },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const placeholderPages: Record<NavKey, string> = {
  overview: 'Overview',
  'live-map': '',
  vehicles: 'Vehicles',
  incidents: 'Incidents',
  deliveries: 'Deliveries',
  settings: 'Settings',
};

function App() {
  const [activePage, setActivePage] = useState<NavKey>('live-map');

  let content: ReactNode;
  if (activePage === 'live-map') {
    content = <LiveMapPage />;
  } else if (activePage === 'vehicles') {
    content = <VehiclesPage />;
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
      {/* Sidebar */}
      <aside className="flex w-16 flex-col border-r border-slate-800/80 bg-slate-900 lg:w-60">
        <div className="flex items-center gap-2.5 border-b border-slate-800/80 px-4 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
            <Radar className="h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold leading-tight text-white">
              Logistics Intelligence
            </h1>
            <p className="text-[11px] text-slate-500">Operations Platform</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-800/80 p-4 lg:block">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="text-[11px] text-amber-300/80">
              Simulated data — demo environment
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{content}</main>
    </div>
  );
}

export default App;
