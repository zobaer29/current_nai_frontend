import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Incident, AreaStatus, SavedLocation, MapViewFilter } from '../types';

export interface LocationFilterPayload {
  label: string;
  lat?: number;
  lng?: number;
  areaName?: string;
}

interface OutageState {
  currentAreaStatus: AreaStatus | null;
  incidents: Incident[];
  savedLocations: SavedLocation[];
  activeLocationFilter: string;
  selectedCoords: { lat: number; lng: number };
  mapViewMode: MapViewFilter;
  heatmapEnabled: boolean;
  searchQuery: string;
  userReportedState: 'POWER_OFF' | 'POWER_ON' | null;
  userFeedbackToast: { message: string; type: 'off' | 'on' } | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_CENTER = { lat: 23.8069, lng: 90.3687 };

const initialState: OutageState = {
  currentAreaStatus: null,
  incidents: [],
  savedLocations: [],
  activeLocationFilter: 'Current Location',
  selectedCoords: DEFAULT_CENTER,
  mapViewMode: 'NEAR_ME',
  heatmapEnabled: false,
  searchQuery: '',
  userReportedState: null,
  userFeedbackToast: null,
  loading: false,
  error: null,
};

// Fetch mock data from public/data/mockData.json using VITE_USE_MOCK_DATA logic
export const fetchMockOutageData = createAsyncThunk(
  'outage/fetchMockData',
  async () => {
    const isMock = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;
    const dataUrl = isMock ? '/data/mockData.json' : `${import.meta.env.VITE_API_BASE_URL}/outages`;
    
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error('Failed to fetch outage data');
    return await response.json();
  }
);

const outageSlice = createSlice({
  name: 'outage',
  initialState,
  reducers: {
    setActiveLocationFilter: (state, action: PayloadAction<LocationFilterPayload | string>) => {
      if (typeof action.payload === 'string') {
        state.activeLocationFilter = action.payload;
      } else {
        state.activeLocationFilter = action.payload.label;
        if (action.payload.lat && action.payload.lng) {
          state.selectedCoords = { lat: action.payload.lat, lng: action.payload.lng };
        }
        if (action.payload.areaName && state.currentAreaStatus) {
          state.currentAreaStatus.areaName = action.payload.areaName;
        }
      }
    },
    setSelectedCoords: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.selectedCoords = action.payload;
    },
    setMapViewMode: (state, action: PayloadAction<MapViewFilter>) => {
      state.mapViewMode = action.payload;
      if (action.payload === 'WHOLE_BANGLADESH') {
        state.selectedCoords = { lat: 23.6850, lng: 90.3563 };
      } else {
        state.selectedCoords = DEFAULT_CENTER;
      }
    },
    toggleHeatmap: (state) => {
      state.heatmapEnabled = !state.heatmapEnabled;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    reportPowerStatus: (state, action: PayloadAction<'POWER_OFF' | 'POWER_ON' | { status: string; area: string }>) => {
      let statusStr: 'POWER_OFF' | 'POWER_ON' = 'POWER_OFF';
      if (typeof action.payload === 'string') {
        statusStr = action.payload;
      } else if (action.payload.status === 'POWER_ON' || action.payload.status === 'POWER_OFF') {
        statusStr = action.payload.status;
      }

      const isOff = statusStr === 'POWER_OFF';
      state.userReportedState = statusStr;

      if (state.currentAreaStatus) {
        if (isOff) {
          state.currentAreaStatus.reportsCount += 1;
          state.currentAreaStatus.nearbyStats.offCount += 1;
          state.currentAreaStatus.status = 'POSSIBLE_OUTAGE';
          state.currentAreaStatus.confidenceScore = Math.min(99, state.currentAreaStatus.confidenceScore + 1);
        } else {
          state.currentAreaStatus.nearbyStats.onCount += 1;
          if (state.currentAreaStatus.nearbyStats.onCount > 15) {
            state.currentAreaStatus.status = 'POWER_AVAILABLE';
          }
        }
      }

      const currentArea = state.currentAreaStatus?.areaName || 'Mirpur 10';
      const existingInc = state.incidents.find(i => i.area === currentArea);
      if (existingInc) {
        if (isOff) {
          existingInc.reports += 1;
          existingInc.status = 'CONFIRMED';
          existingInc.updatedAt = 'Just now';
        } else {
          existingInc.status = 'RESOLVED';
          existingInc.updatedAt = 'Just now';
        }
      } else {
        state.incidents.push({
          id: `inc_${Date.now()}`,
          area: currentArea,
          lat: state.selectedCoords.lat,
          lng: state.selectedCoords.lng,
          status: isOff ? 'POSSIBLE' : 'RESOLVED',
          reports: 1,
          confidence: 85,
          updatedAt: 'Just now'
        });
      }

      state.userFeedbackToast = {
        message: isOff 
          ? '🔴 আপনার রিপোর্ট জমা হয়েছে! তথ্য আপডেটেড রাখা হচ্ছে।' 
          : '🟢 পাওয়ার রিস্টোর রিপোর্ট জমা হয়েছে! ধন্যবাদ।',
        type: isOff ? 'off' : 'on'
      };
    },
    dismissToast: (state) => {
      state.userFeedbackToast = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockOutageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMockOutageData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAreaStatus = action.payload.currentArea;
        state.incidents = action.payload.incidents;
        state.savedLocations = action.payload.currentUser.savedLocations;
      })
      .addCase(fetchMockOutageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading outage data';
      });
  },
});

export const {
  setActiveLocationFilter,
  setSelectedCoords,
  setMapViewMode,
  toggleHeatmap,
  setSearchQuery,
  reportPowerStatus,
  dismissToast,
} = outageSlice.actions;

export default outageSlice.reducer;