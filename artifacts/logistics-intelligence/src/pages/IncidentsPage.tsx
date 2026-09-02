import { useMemo, useState } from 'react';
import { AlertTriangle, Clock3, Plus } from 'lucide-react';
import type { Incident } from '@/types';
import { getIncidents } from '@/services/mapService';
import { IncidentDetailModal } from '@/components/incidents/IncidentDetailModal';
import { IncidentFilters, type IncidentFilter } from '@/components/incidents/IncidentFilters';
import { IncidentSummaryCards } from '@/components/incidents/IncidentSummaryCards';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { ReportIncidentModal } from '@/components/incidents/ReportIncidentModal';

export function IncidentsPage() {
  const initialIncidents = useMemo(() => getIncidents(), []);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [activeFilter, setActiveFilter] = useState<IncidentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const summary = useMemo(
    () => ({
      total: incidents.length,
      reported: incidents.filter((incident) => incident.status === 'Reported').length,
      underReview: incidents.filter((incident) => incident.status === 'Under Review').length,
      resolved: incidents.filter((incident) => incident.status === 'Resolved').length,
      highCritical: incidents.filter(
        (incident) => incident.severity === 'high' || incident.severity === 'critical',
      ).length,
    }),
    [incidents],
  );

  const filteredIncidents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return incidents.filter((incident) => {
      const matchesFilter =
        activeFilter === 'all' ||
        incident.status === activeFilter ||
        incident.severity === activeFilter;
      const matchesSearch =
        !query ||
        incident.id.toLowerCase().includes(query) ||
        incident.type.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, incidents, searchQuery]);

  function handleSubmitted(incident: Incident) {
    setIncidents((current) => [incident, ...current]);
    setIsReportModalOpen(false);
    setSelectedIncident(incident);
  }

  return (
    <div className="flex min-h-full flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Incidents</h1>
            <p className="text-sm text-slate-400">
              Accessibility disruption log — simulated operational data
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          data-testid="button-open-report-incident"
          className="flex items-center justify-center gap-2 rounded-lg border border-sky-400/40 bg-sky-500/15 px-3.5 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/25 sm:shrink-0"
        >
          <Plus className="h-4 w-4" />
          Report incident
        </button>
      </div>

      <IncidentSummaryCards summary={summary} />

      <IncidentFilters
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
      />

      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Showing <span className="text-slate-300" data-testid="text-filtered-incident-count">{filteredIncidents.length}</span> of {incidents.length} incidents
        </p>
        <span className="hidden items-center gap-1.5 text-xs text-slate-600 sm:flex">
          <Clock3 className="h-3.5 w-3.5" />
          Latest reports first
        </span>
      </div>

      <IncidentTable incidents={filteredIncidents} onSelect={setSelectedIncident} />

      <div className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-slate-600">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Simulated incident data — demo environment</span>
      </div>

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {isReportModalOpen && (
        <ReportIncidentModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}