import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setActiveLocationFilter } from '../store/outageSlice';
import { Home, GraduationCap, Briefcase, Users, Zap, ZapOff, ArrowUpRight, CheckCircle2, AlertOctagon } from 'lucide-react';

export const SavedPlacesNearbyPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedLocations, currentAreaStatus, activeLocationFilter, incidents } = useSelector(
    (state: RootState) => state.outage
  );

  const nearbyStats = currentAreaStatus?.nearbyStats || { offCount: 29, onCount: 8 };
  const totalNearbyReports = nearbyStats.offCount + nearbyStats.onCount;
  const offPercentage = Math.round((nearbyStats.offCount / (totalNearbyReports || 1)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Saved Places Overview Cards (Takes 2 cols on lg) */}
      <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-400" />
              Saved Places Overview
            </h3>
            <span className="text-xs text-slate-400">Quick Switch Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedLocations.map((loc) => {
              const label = `${loc.name}: ${loc.area}`;
              const isSelected = activeLocationFilter === label;

              // Find matching incident status if any
              const matchingInc = incidents.find((inc) => inc.area.includes(loc.area));
              const statusText = matchingInc
                ? matchingInc.status === 'CONFIRMED'
                  ? 'Confirmed Outage'
                  : matchingInc.status === 'POSSIBLE'
                  ? 'Possible Outage'
                  : 'Power Available'
                : 'Normal Grid Status';

              const badgeColor =
                statusText.includes('Confirmed') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                statusText.includes('Possible') ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

              const icon =
                loc.name === 'Home' ? <Home className="w-5 h-5 text-amber-400" /> :
                loc.name === 'University' ? <GraduationCap className="w-5 h-5 text-purple-400" /> :
                <Briefcase className="w-5 h-5 text-blue-400" />;

              return (
                <div
                  key={loc.id}
                  onClick={() => dispatch(setActiveLocationFilter({ label, lat: loc.lat, lng: loc.lng, areaName: loc.area }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-400/40'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-700/60">
                        {icon}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-sm text-white mb-0.5">{loc.name}</h4>
                    <p className="text-xs text-slate-400 mb-3 truncate">{loc.area}</p>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border inline-block ${badgeColor}`}>
                      {statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Nearby Stats Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Nearby Activity Summary
            </h3>
            <span className="text-xs text-slate-400">Live Feedback</span>
          </div>

          {/* Headline Stat */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-4">
            <p className="text-sm text-slate-300 font-medium leading-snug">
              👥 <strong className="text-white">{totalNearbyReports} people nearby</strong> reported:
            </p>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <ZapOff className="w-3.5 h-3.5" /> {nearbyStats.offCount} No Power
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {nearbyStats.onCount} Power Available
              </span>
            </div>

            {/* Ratio Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 mt-3 overflow-hidden flex">
              <div
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${offPercentage}%` }}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${100 - offPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Recent Signal Stream */}
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Recent Community Reports
          </div>
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-red-400">
                <AlertOctagon className="w-3.5 h-3.5" /> Mirpur 10 Block C
              </span>
              <span className="text-[10px] text-slate-500">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Banani Road 11
              </span>
              <span className="text-[10px] text-slate-500">5 mins ago</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
