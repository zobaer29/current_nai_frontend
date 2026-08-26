import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { reportPowerStatus } from '../store/outageSlice';
import { MapPin, Zap, ZapOff, Clock, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

export const HeroAreaStatusCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentAreaStatus, userReportedState } = useSelector((state: RootState) => state.outage);

  if (!currentAreaStatus) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-6 animate-pulse flex items-center justify-center min-h-[200px]">
        <span className="text-sm text-slate-400">Loading active area outage status...</span>
      </div>
    );
  }

  const { areaName, status, reportsCount, confidenceScore, activeMinutes } = currentAreaStatus;

  const isOutage = status === 'POSSIBLE_OUTAGE' || status === 'CONFIRMED_OUTAGE';

  return (
    <div
      className={`relative border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${
        isOutage
          ? 'bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)]'
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
                My Active Area
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
            <span className="text-xs text-slate-400 font-medium">Dhaka Metropolitan</span>
          </div>

          {/* Ultra-Attractive Status Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-3 px-4.5 py-2.5 rounded-2xl border font-black text-xs sm:text-sm shadow-xl transition-all ${
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

            {/* Metrics pills */}
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-inner">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <strong className="text-white">{reportsCount}</strong> reports
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <strong className="text-white">{confidenceScore}%</strong> confidence
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <strong className="text-white">{activeMinutes}m</strong> active
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Crowdsourced signal computed from nearby verified users. Report your local status below to improve map precision in real-time.
          </p>
        </div>

        {/* Right Side: Interactive Action Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[290px]">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Report Your Status:</span>
            {userReportedState && (
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                ✓ Recorded
              </span>
            )}
          </div>

          {/* Outage Button with Pulsing Red Dot */}
          <button
            onClick={() => dispatch(reportPowerStatus('POWER_OFF'))}
            className={`w-full py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 group ${
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
            <span>আমার কারেন্ট নেই</span>
          </button>

          {/* Power Available Button */}
          <button
            onClick={() => dispatch(reportPowerStatus('POWER_ON'))}
            className={`w-full py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 group ${
              userReportedState === 'POWER_ON'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/10'
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <Zap className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>আমার কারেন্ট আছে</span>
          </button>
        </div>

      </div>
    </div>
  );
};
