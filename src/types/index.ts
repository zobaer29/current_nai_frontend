export type PowerStatus = 'POWER_ON' | 'POWER_OFF' | 'VOLTAGE_ISSUE' | 'FLUCTUATION';

export type UserRole = 'GUEST' | 'REGISTERED' | 'ADMIN';

export type RadiusFilter = '500m' | '1km' | '3km' | '5km';

export type MapViewFilter = 'NEAR_ME' | 'WHOLE_BANGLADESH';

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
  district?: string;
  division?: string;
  lat: number;
  lng: number;
  status: 'POSSIBLE' | 'CONFIRMED' | 'RESOLVED';
  problemType?: PowerStatus;
  reports: number;
  confidence: number; // 0-100%
  h3Index?: string;
  feederName?: string;
  substation?: string;
  updatedAt?: string;
  startedAt?: string;
  confirmationsOn?: number;
  confirmationsOff?: number;
}

export type ConfidenceLevel = 'UNKNOWN' | 'POSSIBLE' | 'LIKELY' | 'HIGH';

export interface AreaStatus {
  areaName: string;
  district?: string;
  division?: string;
  status: string;
  reportsCount: number;
  confidenceScore: number;
  activeMinutes: number;
  nearbyStats: {
    offCount: number;
    onCount: number;
  };
}

export interface HistoricalOutagePoint {
  hour: number;
  timeLabel: string;
  activeOutages: number;
  affectedAreas: string[];
}

export interface RegionHierarchy {
  division: string;
  district: string;
  upazila: string;
  area: string;
}