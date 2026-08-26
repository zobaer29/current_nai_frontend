import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Incident,
  AreaStatus,
  SavedLocation,
  MapViewFilter,
  PowerStatus,
  UserRole,
  RadiusFilter,
  HistoricalOutagePoint,
  RegionHierarchy,
} from '../types';

export interface OutageState {
  currentAreaStatus: AreaStatus | null;
  incidents: Incident[];
  savedLocations: SavedLocation[];
  historicalPoints: HistoricalOutagePoint[];
  activeLocationFilter: string;
  selectedCoords: { lat: number; lng: number };
  mapViewMode: MapViewFilter;
  heatmapEnabled: boolean;
  selectedRadius: RadiusFilter;
  timeSliderHour: number;
  isPlaybackPlaying: boolean;
  userRole: UserRole;
  selectedRegion: RegionHierarchy;
  searchQuery: string;
  userReportedState: PowerStatus | null;
  notificationToast: { message: string; type: 'success' | 'error' | 'info' } | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT) || 23.8069,
  lng: Number(import.meta.env.VITE_DEFAULT_LNG) || 90.3687,
};

const initialState: OutageState = {
  currentAreaStatus: null,
  incidents: [],
  savedLocations: [],
  historicalPoints: [],
  activeLocationFilter: 'Current Location',
  selectedCoords: DEFAULT_CENTER,
  mapViewMode: 'NEAR_ME',
  heatmapEnabled: false,
  selectedRadius: '1km',
  timeSliderHour: 24,
  isPlaybackPlaying: false,
  userRole: 'REGISTERED',
  selectedRegion: {
    division: 'All Divisions',
    district: 'All Districts',
    upazila: 'All Upazilas',
    area: 'All Areas',
  },
  searchQuery: '',
  userReportedState: null,
  notificationToast: null,
  loading: false,
  error: null,
};

export const fetchMockOutageData = createAsyncThunk(
  'outage/fetchMockData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/mockData.json');
      if (!response.ok) {
        throw new Error('Failed to fetch mock data');
      }
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const outageSlice = createSlice({
  name: 'outage',
  initialState,
  reducers: {
    setActiveLocationFilter: (
      state,
      action: PayloadAction<{ label: string; lat?: number; lng?: number; areaName?: string }>
    ) => {
      const { label, lat, lng, areaName } = action.payload;
      state.activeLocationFilter = label;
      if (lat !== undefined && lng !== undefined) {
        state.selectedCoords = { lat, lng };
      }
      if (areaName && state.currentAreaStatus) {
        state.currentAreaStatus.areaName = areaName;
      }
    },
    setMapViewMode: (state, action: PayloadAction<MapViewFilter>) => {
      state.mapViewMode = action.payload;
    },
    toggleHeatmap: (state) => {
      state.heatmapEnabled = !state.heatmapEnabled;
    },
    setSelectedRadius: (state, action: PayloadAction<RadiusFilter>) => {
      state.selectedRadius = action.payload;
      state.notificationToast = {
        message: `Filter radius updated to ${action.payload}`,
        type: 'info',
      };
    },
    setTimeSliderHour: (state, action: PayloadAction<number>) => {
      state.timeSliderHour = action.payload;
    },
    togglePlayback: (state) => {
      state.isPlaybackPlaying = !state.isPlaybackPlaying;
    },
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.userRole = action.payload;
      state.notificationToast = {
        message: `Switched view mode to ${action.payload}`,
        type: 'info',
      };
    },
    setSelectedRegion: (state, action: PayloadAction<Partial<RegionHierarchy>>) => {
      state.selectedRegion = { ...state.selectedRegion, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    reportPowerStatus: (state, action: PayloadAction<PowerStatus>) => {
      state.userReportedState = action.payload;
      const area = state.currentAreaStatus?.areaName || 'Your Area';

      if (action.payload === 'POWER_OFF') {
        state.notificationToast = {
          message: `🔴 Report recorded for ${area}! Community confidence updated.`,
          type: 'error',
        };
        if (state.currentAreaStatus) {
          state.currentAreaStatus.reportsCount += 1;
          state.currentAreaStatus.confidenceScore = Math.min(100, state.currentAreaStatus.confidenceScore + 3);
          state.currentAreaStatus.status = 'CONFIRMED_OUTAGE';
        }
      } else if (action.payload === 'POWER_ON') {
        state.notificationToast = {
          message: `🟢 Power restoration reported for ${area}! Thank you.`,
          type: 'success',
        };
        if (state.currentAreaStatus) {
          state.currentAreaStatus.reportsCount = Math.max(0, state.currentAreaStatus.reportsCount - 1);
          state.currentAreaStatus.confidenceScore = Math.max(10, state.currentAreaStatus.confidenceScore - 15);
          if (state.currentAreaStatus.reportsCount === 0) {
            state.currentAreaStatus.status = 'POWER_AVAILABLE';
          }
        }
      } else if (action.payload === 'VOLTAGE_ISSUE') {
        state.notificationToast = {
          message: `🟡 Voltage issue reported for ${area}.`,
          type: 'info',
        };
      } else if (action.payload === 'FLUCTUATION') {
        state.notificationToast = {
          message: `⚠️ Frequent fluctuation reported for ${area}.`,
          type: 'info',
        };
      }
    },
    confirmIncident: (
      state,
      action: PayloadAction<{ incidentId: string; confirmType: 'NO_POWER' | 'HAS_POWER' }>
    ) => {
      const { incidentId, confirmType } = action.payload;
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (incident) {
        if (confirmType === 'NO_POWER') {
          incident.confirmationsOff = (incident.confirmationsOff || 0) + 1;
          incident.reports += 1;
          incident.confidence = Math.min(100, incident.confidence + 4);
          state.notificationToast = {
            message: `Confirmed outage for ${incident.area}. Confidence +4%`,
            type: 'error',
          };
        } else {
          incident.confirmationsOn = (incident.confirmationsOn || 0) + 1;
          incident.confidence = Math.max(0, incident.confidence - 8);
          if (incident.confidence < 30) {
            incident.status = 'RESOLVED';
          }
          state.notificationToast = {
            message: `Confirmed power restored for ${incident.area}.`,
            type: 'success',
          };
        }
      }
    },
    adminDeleteIncident: (state, action: PayloadAction<string>) => {
      state.incidents = state.incidents.filter((inc) => inc.id !== action.payload);
      state.notificationToast = {
        message: 'Admin: Incident removed successfully.',
        type: 'info',
      };
    },
    adminMergeIncidents: (state, action: PayloadAction<{ targetId: string; sourceId: string }>) => {
      const target = state.incidents.find((i) => i.id === action.payload.targetId);
      const source = state.incidents.find((i) => i.id === action.payload.sourceId);
      if (target && source) {
        target.reports += source.reports;
        target.confidence = Math.min(100, target.confidence + 5);
        state.incidents = state.incidents.filter((i) => i.id !== action.payload.sourceId);
        state.notificationToast = {
          message: `Admin: Merged incident ${source.area} into ${target.area}`,
          type: 'info',
        };
      }
    },
    clearToast: (state) => {
      state.notificationToast = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockOutageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMockOutageData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAreaStatus = action.payload.currentAreaStatus;
        state.incidents = action.payload.incidents;
        state.savedLocations = action.payload.savedLocations;
        state.historicalPoints = action.payload.historicalPoints || [];
      })
      .addCase(fetchMockOutageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveLocationFilter,
  setMapViewMode,
  toggleHeatmap,
  setSelectedRadius,
  setTimeSliderHour,
  togglePlayback,
  setUserRole,
  setSelectedRegion,
  setSearchQuery,
  reportPowerStatus,
  confirmIncident,
  adminDeleteIncident,
  adminMergeIncidents,
  clearToast,
} = outageSlice.actions;

export default outageSlice.reducer;