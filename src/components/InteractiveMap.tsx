import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setMapViewMode, toggleHeatmap } from '../store/outageSlice';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Flame, Globe } from 'lucide-react';

// Controller component to smoothly adjust Leaflet view when coordinates change
const MapViewController: React.FC<{ coords: { lat: number; lng: number }; zoom: number }> = ({ coords, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([coords.lat, coords.lng], zoom, { duration: 1.2 });
  }, [coords, zoom, map]);
  return null;
};

// Create custom animated Leaflet DivIcons
const createOutageIcon = (isConfirmed: boolean, reports: number) => {
  const colorClass = isConfirmed ? 'bg-red-500' : 'bg-amber-500';
  const pulseClass = isConfirmed ? 'bg-red-400' : 'bg-amber-400';

  return L.divIcon({
    className: 'custom-outage-marker',
    html: `
      <div className="relative flex items-center justify-center w-8 h-8">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full ${pulseClass} opacity-75"></span>
        <span className="relative inline-flex rounded-full h-8 w-8 ${colorClass} border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[11px]">
          ${reports}
        </span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createResolvedIcon = () => {
  return L.divIcon({
    className: 'custom-resolved-marker',
    html: `
      <div className="relative flex items-center justify-center w-7 h-7">
        <span className="inline-flex rounded-full h-7 w-7 bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div className="relative flex items-center justify-center w-7 h-7">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-7 w-7 bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
          <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export const InteractiveMap: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedCoords,
    incidents,
    mapViewMode,
    heatmapEnabled,
  } = useSelector((state: RootState) => state.outage);


  const zoom = mapViewMode === 'WHOLE_BANGLADESH' ? 7 : 13;

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
      
      {/* Map Control Overlay Pills */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
        
        {/* Near Me Filter Pill */}
        <button
          onClick={() => dispatch(setMapViewMode('NEAR_ME'))}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
            mapViewMode === 'NEAR_ME'
              ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/40'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-indigo-300" />
          <span>📍 Near Me</span>
        </button>

        {/* Whole Bangladesh Pill */}
        <button
          onClick={() => dispatch(setMapViewMode('WHOLE_BANGLADESH'))}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
            mapViewMode === 'WHOLE_BANGLADESH'
              ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/40'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>🇧🇩 Whole Bangladesh</span>
        </button>

        {/* Heatmap Toggle Pill */}
        <button
          onClick={() => dispatch(toggleHeatmap())}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
            heatmapEnabled
              ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-300'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${heatmapEnabled ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>🔥 Heatmap {heatmapEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md text-[11px] text-slate-300 space-y-1.5 shadow-xl hidden sm:block">
        <div className="font-bold text-white text-xs mb-1">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Confirmed Outage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Possible Outage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Restored / Power On</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
          <span>Approximate User Area</span>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={[selectedCoords.lat, selectedCoords.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Fly-to view controller */}
        <MapViewController coords={selectedCoords} zoom={zoom} />

        {/* Configurable dark theme tile layer */}
        <TileLayer
          attribution={import.meta.env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com/attributions">CARTO</a>'}
          url={import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
        />


        {/* User Location Marker & Privacy Approximate Radius */}
        <Marker
          position={[selectedCoords.lat, selectedCoords.lng]}
          icon={createUserLocationIcon()}
        >
          <Popup className="dark-popup">
            <div className="p-1 text-slate-900 font-sans">
              <div className="font-bold text-xs flex items-center gap-1 text-indigo-700">
                <Navigation className="w-3.5 h-3.5" /> You Are Here
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Privacy Protected: Exact GPS coordinates are not publicly exposed.
              </p>
            </div>
          </Popup>
        </Marker>

        {/* User Privacy Circle */}
        <Circle
          center={[selectedCoords.lat, selectedCoords.lng]}
          radius={800}
          pathOptions={{
            color: '#6366f1',
            fillColor: '#818cf8',
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '4, 4',
          }}
        />

        {/* Incident Markers */}
        {incidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED';
          const isConfirmed = inc.status === 'CONFIRMED';
          const icon = isResolved
            ? createResolvedIcon()
            : createOutageIcon(isConfirmed, inc.reports);

          return (
            <React.Fragment key={inc.id}>
              {/* Optional Heatmap effect circle */}
              {heatmapEnabled && !isResolved && (
                <Circle
                  center={[inc.lat, inc.lng]}
                  radius={isConfirmed ? 2500 : 1800}
                  pathOptions={{
                    color: isConfirmed ? '#ef4444' : '#f59e0b',
                    fillColor: isConfirmed ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.25,
                    weight: 0,
                  }}
                />
              )}

              <Marker position={[inc.lat, inc.lng]} icon={icon}>
                <Popup>
                  <div className="p-2 text-slate-900 font-sans min-w-[180px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">{inc.area}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                          isConfirmed ? 'bg-red-600' : isResolved ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-700 mt-2 border-t border-slate-200 pt-1.5">
                      <div className="flex justify-between">
                        <span>Reports:</span>
                        <strong className="text-slate-900">{inc.reports}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <strong className="text-slate-900">{inc.confidence}%</strong>
                      </div>
                      {inc.updatedAt && (
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Updated:</span>
                          <span>{inc.updatedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
