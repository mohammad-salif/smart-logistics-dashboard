import { useState, useMemo } from 'react';
import { Truck } from 'lucide-react';
import type { FleetVehicle, VehicleListFilter } from '@/types';
import { getFleetVehicles } from '@/services/fleetService';
import { SummaryCards } from '@/components/vehicles/SummaryCards';
import { VehicleFilters } from '@/components/vehicles/VehicleFilters';
import { VehicleTable } from '@/components/vehicles/VehicleTable';
import { VehicleDetailModal } from '@/components/vehicles/VehicleDetailModal';

export function VehiclesPage() {
  const allVehicles = useMemo(() => getFleetVehicles(), []);

  const [activeFilter, setActiveFilter] = useState<VehicleListFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(
    null,
  );

  const summary = useMemo(() => {
    const active = allVehicles.filter((v) => v.status === 'Active').length;
    const atRisk = allVehicles.filter(
      (v) => v.routeStatus === 'at-risk' || v.routeStatus === 'blocked',
    ).length;
    const delayed = allVehicles.filter((v) => v.status === 'Delayed').length;
    const offline = allVehicles.filter((v) => v.status === 'Offline').length;
    return {
      total: allVehicles.length,
      active,
      atRisk,
      delayed,
      offline,
    };
  }, [allVehicles]);

  const filteredVehicles = useMemo(() => {
    let result = allVehicles;

    if (activeFilter === 'Active') {
      result = result.filter((v) => v.status === 'Active');
    } else if (activeFilter === 'Delayed') {
      result = result.filter((v) => v.status === 'Delayed');
    } else if (activeFilter === 'Offline') {
      result = result.filter((v) => v.status === 'Offline');
    } else if (activeFilter === 'At Risk') {
      result = result.filter((v) => v.routeStatus === 'at-risk');
    } else if (activeFilter === 'Blocked') {
      result = result.filter((v) => v.routeStatus === 'blocked');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.id.toLowerCase().includes(q) ||
          v.origin.toLowerCase().includes(q) ||
          v.destination.toLowerCase().includes(q) ||
          v.cargoCategory.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allVehicles, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Vehicles</h1>
            <p className="text-sm text-slate-400">
              Fleet monitoring — simulated operational data
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards {...summary} />

      {/* Filters + search */}
      <VehicleFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Vehicle list */}
      <VehicleTable
        vehicles={filteredVehicles}
        onSelect={setSelectedVehicle}
      />

      {/* Simulated data notice */}
      <p className="text-center text-xs text-slate-600">
        Simulated fleet data — not live vehicle tracking
      </p>

      {/* Detail modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
