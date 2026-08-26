export type PowerStatus = 'POWER_ON' | 'POWER_OFF' | 'VOLTAGE_ISSUE';

export interface SavedLocation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  status?: string;
  reportsCount?: number;
}

export interface Incident {
  id: string;
  area: string;
  lat: number;
  lng: number;
  status: 'POSSIBLE' | 'CONFIRMED' | 'RESOLVED';
  reports: number;
  confidence: number;
  h3Index?: string;
  updatedAt?: string;
}

export interface AreaStatus {
  areaName: string;
  status: string;
  reportsCount: number;
  confidenceScore: number;
  activeMinutes: number;
  nearbyStats: {
    offCount: number;
    onCount: number;
  };
}

export type MapViewFilter = 'NEAR_ME' | 'WHOLE_BANGLADESH';