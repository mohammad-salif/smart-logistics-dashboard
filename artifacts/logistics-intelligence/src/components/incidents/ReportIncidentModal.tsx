import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, FileUp, MapPin, X } from 'lucide-react';
import type { Incident, IncidentType, Severity } from '@/types';
import { reportIncident } from '@/services/incidentService';

interface ReportIncidentModalProps {
  onClose: () => void;
  onSubmitted: (incident: Incident) => void;
}

const incidentTypes: IncidentType[] = [
  'Landslide',
  'Flood',
  'Road Damage',
  'Bridge Damage',
  'Other Accessibility Disruption',
];

const severityOptions: Array<{ value: Severity; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function ReportIncidentModal({ onClose, onSubmitted }: ReportIncidentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<IncidentType | ''>('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Severity>('moderate');
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!type || !location.trim() || !description.trim()) {
      setFormError('Complete the incident type, location, and description before submitting.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      const incident = await reportIncident({
        type,
        location,
        severity,
        description,
        photoName: photoName || undefined,
      });
      onSubmitted(incident);
    } catch {
      setFormError('The mock report could not be created. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
      data-testid="modal-report-incident"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-incident-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-700/70 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 id="report-incident-title" className="text-sm font-semibold text-white">Report Incident</h2>
              <p className="text-[11px] text-slate-500">Log a simulated accessibility event</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report incident form"
            data-testid="button-close-report-incident"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Incident Type <span className="text-red-400">*</span>
              </span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as IncidentType)}
                required
                data-testid="select-report-incident-type"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-500/50"
              >
                <option value="">Select type</option>
                {incidentTypes.map((incidentType) => (
                  <option key={incidentType} value={incidentType}>{incidentType}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Severity</span>
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value as Severity)}
                data-testid="select-report-incident-severity"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-500/50"
              >
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Location <span className="text-red-400">*</span>
            </span>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Corridor Delta — Mile 44"
              required
              data-testid="input-report-incident-location"
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-sky-500/50"
            />
          </label>

          <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 px-3 py-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Location / GPS</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  GPS capture is unavailable in this demo. The location above is entered manually.
                </p>
              </div>
              <span className="ml-auto whitespace-nowrap rounded-full border border-slate-600/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                Placeholder
              </span>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Description <span className="text-red-400">*</span>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the accessibility disruption..."
              required
              rows={4}
              data-testid="textarea-report-incident-description"
              className="w-full resize-y rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm leading-5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-sky-500/50"
            />
          </label>

          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Photo</span>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-700/70 bg-slate-800/20 px-3 py-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')}
                data-testid="input-report-incident-photo"
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-choose-incident-photo"
                className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                <Camera className="h-4 w-4" />
                Choose photo
              </button>
              {photoName ? (
                <span className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
                  <FileUp className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                  <span className="max-w-[220px] truncate">{photoName}</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500">Optional UI-only attachment</span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-slate-600">Files stay local to this demo and are never uploaded.</p>
          </div>

          {formError && (
            <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert" data-testid="status-report-incident-error">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-700/50 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              data-testid="button-cancel-report-incident"
              className="rounded-lg border border-slate-700/70 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-report-incident"
              className="rounded-lg border border-sky-400/40 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Recording...' : 'Record incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}