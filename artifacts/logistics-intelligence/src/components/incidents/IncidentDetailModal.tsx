import { AlertTriangle, ImageOff, MapPin, X } from 'lucide-react';
import type { Incident } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { incidentStatusToBadgeVariant, severityToBadgeVariant } from '@/lib/badgeMappings';

interface IncidentDetailModalProps {
  incident: Incident;
  onClose: () => void;
}

const severityLabels: Record<Incident['severity'], string> = {
  low: 'Low',
  moderate: 'Medium',
  high: 'High',
  critical: 'Critical',
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-700/50 py-2.5 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-sm text-slate-200">{children}</span>
    </div>
  );
}

export function IncidentDetailModal({ incident, onClose }: IncidentDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      data-testid="modal-incident-detail"
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/60 bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Incident Details</h2>
              <p className="text-xs text-slate-500">Simulated event record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close incident details"
            data-testid="button-close-incident-detail"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-2">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-lg font-bold text-white" data-testid={`text-detail-incident-id-${incident.id}`}>
                {incident.id}
              </p>
              <p className="text-xs text-slate-500">{incident.type}</p>
            </div>
            <Badge variant={incidentStatusToBadgeVariant(incident.status)}>{incident.status}</Badge>
          </div>

          <DetailRow label="Incident Type">{incident.type}</DetailRow>
          <DetailRow label="Location">
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              {incident.location}
            </span>
          </DetailRow>
          <DetailRow label="Severity">
            <Badge variant={severityToBadgeVariant(incident.severity)}>
              {severityLabels[incident.severity]}
            </Badge>
          </DetailRow>
          <DetailRow label="Report Timestamp">{incident.timestamp}</DetailRow>
          <DetailRow label="Current Status">
            <Badge variant={incidentStatusToBadgeVariant(incident.status)}>{incident.status}</Badge>
          </DetailRow>

          <div className="border-b border-slate-700/50 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-6 text-slate-300" data-testid={`text-description-${incident.id}`}>
              {incident.description}
            </p>
          </div>

          <div className="py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Photo</p>
            {incident.photoName ? (
              <div className="mt-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-3 text-sm text-slate-300">
                <p>{incident.photoName}</p>
                <p className="mt-1 text-xs text-slate-500">Mock attachment — not uploaded</p>
              </div>
            ) : (
              <div
                className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-700/70 bg-slate-800/20 px-3 py-4 text-sm text-slate-500"
                data-testid={`empty-photo-${incident.id}`}
              >
                <ImageOff className="h-4 w-4 shrink-0" />
                <span>No photo available</span>
              </div>
            )}
          </div>
        </div>

        <p className="border-t border-slate-700/50 px-5 py-3 text-xs text-slate-500">
          Simulated incident data — demo environment
        </p>
      </div>
    </div>
  );
}