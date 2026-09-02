import { mockIncidents } from '@/data/mockData';
import type { Incident, IncidentType, Severity } from '@/types';

export interface ReportIncidentInput {
  type: IncidentType;
  location: string;
  severity: Severity;
  description: string;
  photoName?: string;
}

let nextIncidentNumber =
  Math.max(
    ...mockIncidents.map((incident) => Number(incident.id.replace('INC-', ''))),
  ) + 1;

/**
 * Frontend-only boundary for the future incident submission API.
 * This intentionally returns a local object and never sends a request or file.
 */
export async function reportIncident(
  input: ReportIncidentInput,
): Promise<Incident> {
  const incident: Incident = {
    id: `INC-${nextIncidentNumber++}`,
    type: input.type,
    location: input.location.trim(),
    severity: input.severity,
    status: 'Reported',
    timestamp: 'Just now',
    position: { x: 500, y: 300 },
    description: input.description.trim(),
    photoName: input.photoName,
  };

  return Promise.resolve(incident);
}