import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { reportPowerStatus } from '../store/outageSlice';
import type { PowerStatus } from '../types';
import { MapPin, Zap, ZapOff, Clock, ShieldCheck, Activity, AlertTriangle, AlertCircle, ActivitySquare } from 'lucide-react';

export const HeroAreaStatusCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentAreaStatus, userReportedState } = useSelector((state: RootState) => state.outage);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentAreaStatus) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-6 animate-pulse flex items-center justify-center min-h-[200px]">
        <span className="text-sm text-slate-400">Loading active area outage status...</span>
      </div>
    );
  }

  const { areaName, status, reportsCount, confidenceScore, activeMinutes, nearbyStats } = currentAreaStatus;

  const isOutage = status === 'POSSIBLE_OUTAGE' || status === 'CONFIRMED_OUTAGE';

  // SRS Confidence Rating Level
  const getConfidenceLevel = (score: number) => {
    if (score >= 76) return { label: 'High Confidence', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (score >= 56) return { label: 'Likely Outage', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    if (score >= 31) return { label: 'Possible Outage', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' };
    return { label: 'Unknown Signal', color: 'text-slate-400 border-slate-700 bg-slate-800' };
  };

  const confidenceBadge = getConfidenceLevel(confidenceScore);

  const handleReport = (type: PowerStatus) => {
    dispatch(reportPowerStatus(type));
    setIsModalOpen(false);
  };

  return (
    <div
      className={`relative border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${
        isOutage
          ? 'bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-red-500/50 shadow-[0_0_45px_rgba(239,68,68,0.25)]'
          : 'bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 border-slate-700/70'
      }`}
    >
      {/* Background Ambient Glow */}
      <div
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full filter blur-[100px] opacity-30 pointer-events-none transition-all duration-700 ${
          isOutage ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Side: Area Name & Status Badge */}
        <div className="space-y-4 max-w-2xl">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-indigo-400">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                My Active Area • SRS v1.0 Live
              </span>
            </div>

            {/* Outage Live Banner */}
            {isOutage && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] font-bold rounded-full animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Outage Alert Active
              </span>
            )}
          </div>

          {/* Area Name */}
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {areaName}
            </h2>
            <span className="text-xs text-slate-400 font-medium">Dhaka Metropolitan Grid</span>
          </div>

          {/* Status Badge & Confidence Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border font-black text-xs sm:text-sm shadow-xl transition-all ${
                isOutage
                  ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-1 ring-red-500/40'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
              }`}
            >
              {/* Multi-ring Pulsing Red Beacon */}
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span
                  className={`animate-radar absolute inline-flex h-full w-full rounded-full opacity-80 ${
                    isOutage ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                ></span>
                <span
                  className={`animate-ping absolute inline-flex h-3/4 w-3/4 rounded-full opacity-75 ${
                    isOutage ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 shadow-md ${
                    isOutage ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                ></span>
              </span>
              <span className="tracking-wide">
                {isOutage ? '🔴 POSSIBLE OUTAGE' : '🟢 POWER AVAILABLE'}
              </span>
            </div>

            {/* SRS Confidence Score Badge */}
            <span className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold font-mono flex items-center gap-1.5 ${confidenceBadge.color}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{confidenceScore}% ({confidenceBadge.label})</span>
            </span>

            {/* Metrics pills */}
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-inner">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <strong className="text-white">{reportsCount}</strong> reports
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <strong className="text-white">{activeMinutes}m</strong> active
              </span>
              {nearbyStats && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-red-400 font-semibold">{nearbyStats.offCount} OFF</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-emerald-400 font-semibold">{nearbyStats.onCount} ON</span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Crowdsourced signal computed from nearby verified users. Report your local status below to improve map precision in real-time.
          </p>
        </div>

        {/* Right Side: One-Tap Reporting & SRS Report Modal Trigger */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[290px]">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>One-Tap Status Report:</span>
            {userReportedState && (
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                ✓ Recorded
              </span>
            )}
          </div>

          {/* Outage Quick Button with Pulsing Red Dot */}
          <button
            onClick={() => handleReport('POWER_OFF')}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 group ${
              userReportedState === 'POWER_OFF'
                ? 'bg-red-600 text-white ring-4 ring-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-500/10'
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <ZapOff className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>🔴 আমার কারেন্ট নেই</span>
          </button>

          {/* Power Available Quick Button */}
          <button
            onClick={() => handleReport('POWER_ON')}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 group ${
              userReportedState === 'POWER_ON'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/10'
            }`}
          >
            <Zap className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>🟢 আমার কারেন্ট আছে</span>
          </button>

          {/* More Report Options (FR-05: Voltage / Fluctuation) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ActivitySquare className="w-4 h-4 text-amber-400" />
            <span>Detailed Issue (Voltage / Fluctuation)</span>
          </button>
        </div>

      </div>

      {/* FR-05: Detailed Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" /> FR-05 Report Type Selector
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select the exact electrical status at your current location ({areaName}):
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => handleReport('POWER_OFF')}
                className="p-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 rounded-2xl text-left flex items-center justify-between transition cursor-pointer text-red-400 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ZapOff className="w-5 h-5 text-red-500" />
                  <div>
                    <div>🔴 Electricity Unavailable (Total Outage)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Complete load shedding / line cut</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReport('POWER_ON')}
                className="p-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-left flex items-center justify-between transition cursor-pointer text-emerald-400 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div>🟢 Electricity Available (Restored)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Power line is fully operational</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReport('VOLTAGE_ISSUE')}
                className="p-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-2xl text-left flex items-center justify-between transition cursor-pointer text-amber-400 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div>🟡 Voltage Drop / Low Voltage Issue</div>
                    <div className="text-[10px] text-slate-400 font-normal">Dim lights / heavy equipment won't turn on</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReport('FLUCTUATION')}
                className="p-3.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 rounded-2xl text-left flex items-center justify-between transition cursor-pointer text-purple-400 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <div>
                    <div>⚠️ Frequent Fluctuation</div>
                    <div className="text-[10px] text-slate-400 font-normal">Tripping on & off every few minutes</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
