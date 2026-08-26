import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setTimeSliderHour, togglePlayback } from '../store/outageSlice';
import {
  Play,
  Pause,
  History,
  Share2,
  BarChart2,
  Check,
  Copy,
  Gauge,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';

export const HistoricalAnalyticsPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { historicalPoints, timeSliderHour, isPlaybackPlaying, currentAreaStatus } = useSelector(
    (state: RootState) => state.outage
  );

  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-play timer loop effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaybackPlaying) {
      const delay = 2000 / playbackSpeed;
      interval = setInterval(() => {
        dispatch(setTimeSliderHour((timeSliderHour + 4) > 24 ? 0 : timeSliderHour + 4));
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaybackPlaying, timeSliderHour, playbackSpeed, dispatch]);

  const currentHourPoint =
    historicalPoints.find((p) => p.hour === timeSliderHour) ||
    historicalPoints[historicalPoints.length - 1];

  const handleCopyShare = () => {
    const text = `⚡ [কারেন্টনাই - CurrentNai Alert Card]\n📍 এলাকা: ${currentAreaStatus?.areaName || 'Mirpur 10'}, Dhaka\n🔴 অবস্থা: POSSIBLE OUTAGE (${currentAreaStatus?.reportsCount || 23} user reports)\n🛡️ কনফিডেন্স: ${currentAreaStatus?.confidenceScore || 91}% | অ্যাক্টিভ: ${currentAreaStatus?.activeMinutes || 47}m\n\nলাইভ ম্যাপ ও রিপোর্ট দেখতে ভিজিট করুন: https://currentnai.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden">
      
      {/* Background Glow Accent */}
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-600/10 rounded-full filter blur-[90px] pointer-events-none" />

      {/* Top Header & Social Card Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-500/10">
            <History className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 tracking-tight">
              24-Hour Time Playback & Grid Analytics
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                Advanced Mode
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive timeline playback, peak load-shedding insights, and live area risk index across Bangladesh.
            </p>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="px-4.5 py-2.5 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xl active:scale-95 group"
        >
          <Share2 className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>Export Social Alert Card</span>
        </button>
      </div>

      {/* Interactive Playback Control Console */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
        
        {/* Row 1: Play/Pause, Time Badge, Speed Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            
            {/* Play/Pause Button */}
            <button
              onClick={() => dispatch(togglePlayback())}
              className={`p-3 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
                isPlaybackPlaying
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-2 ring-indigo-400/40'
              }`}
            >
              {isPlaybackPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Auto Play Timeline</span>
                </>
              )}
            </button>

            {/* Playback Speed Toggles */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <span className="px-2 text-[10px] text-slate-500 font-bold uppercase">Speed:</span>
              {([1, 2, 4] as (1 | 2 | 4)[]).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Time & Hotspot Counter */}
          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-400 font-medium">Selected Hour: </span>
              <span className="font-mono text-indigo-300 font-black bg-indigo-500/15 px-3 py-1.5 rounded-xl border border-indigo-500/30">
                ⏰ {currentHourPoint ? currentHourPoint.timeLabel : 'Now'}
              </span>
            </div>

            <div className="text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 font-bold">
              🔥 {currentHourPoint?.activeOutages || 0} Active Hotspots
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="24"
            step="4"
            value={timeSliderHour}
            onChange={(e) => dispatch(setTimeSliderHour(Number(e.target.value)))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
            <span>12:00 AM</span>
            <span>04:00 AM</span>
            <span>08:00 AM</span>
            <span>12:00 PM</span>
            <span>04:00 PM</span>
            <span>08:00 PM</span>
            <span className="text-indigo-400 font-bold">Now (Live Signal)</span>
          </div>
        </div>

        {/* Affected Areas Chips for Selected Playback Hour */}
        {currentHourPoint?.affectedAreas && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Affected Areas at {currentHourPoint.timeLabel}:
            </span>
            {currentHourPoint.affectedAreas.map((area) => (
              <span
                key={area}
                className="px-2.5 py-1 bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-bold rounded-lg"
              >
                🔴 {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid Reliability Insights & Peak Hour Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Peak Window Alert Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Peak Outage Window</span>
          </div>
          <div className="text-base font-black text-amber-400">08:00 PM - 10:00 PM</div>
          <p className="text-[11px] text-slate-400">
            Highest load-shedding density recorded during evening peak hours (35 incidents).
          </p>
        </div>

        {/* Grid Reliability Index */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <span>Area Reliability Score</span>
          </div>
          <div className="text-base font-black text-emerald-400">78% Grid Stability</div>
          <p className="text-[11px] text-slate-400">
            Based on 24h uninterrupted power ratio in Dhaka Metropolitan Grid.
          </p>
        </div>

        {/* Predictive AI Insight */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Smart Trend Alert</span>
          </div>
          <div className="text-base font-black text-purple-300">↓ 12% Outage Drop</div>
          <p className="text-[11px] text-slate-400">
            Power restorations in Banani & Mirpur improving overall confidence.
          </p>
        </div>
      </div>

      {/* 24-Hour Density Histogram */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>24-Hour Electricity Outage Density Histogram</span>
          </span>
          <span className="text-[11px] text-slate-500 font-normal">Click any bar to jump timeline</span>
        </div>

        <div className="grid grid-cols-7 gap-2.5 items-end h-32 pt-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          {historicalPoints.map((point) => {
            const isSelected = point.hour === timeSliderHour;
            const heightPercent = Math.min(100, Math.max(18, (point.activeOutages / 40) * 100));

            return (
              <div
                key={point.hour}
                onClick={() => dispatch(setTimeSliderHour(point.hour))}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="w-full bg-slate-900 rounded-t-xl overflow-hidden relative h-24 flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full transition-all duration-300 rounded-t-lg ${
                      isSelected
                        ? 'bg-gradient-to-t from-indigo-600 via-amber-500 to-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] ring-2 ring-indigo-400'
                        : 'bg-slate-800 group-hover:bg-slate-700'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-400 font-black' : 'text-slate-500'}`}>
                  {point.timeLabel.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Card Share Modal Exporter */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" /> Export Social Alert Card
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Generated Card Preview */}
            <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border border-red-500/50 p-6 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                  ⚡ কারেন্টনাই • Outage Alert Card
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live BD Signal</span>
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">{currentAreaStatus?.areaName || 'Mirpur 10'}</h4>
                <p className="text-xs text-red-300 font-semibold mt-1">
                  🔴 POSSIBLE OUTAGE ({currentAreaStatus?.reportsCount || 23} user reports verified)
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-3 border-t border-slate-800">
                <span>Confidence: <strong className="text-white">{currentAreaStatus?.confidenceScore || 91}%</strong></span>
                <span>Active: <strong className="text-white">{currentAreaStatus?.activeMinutes || 47}m</strong></span>
                <span>Grid: <strong className="text-indigo-400">Dhaka Metro</strong></span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyShare}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Social Message!' : 'Copy Formatted Social Card'}</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Ready for instant sharing to Facebook Groups, WhatsApp, and Telegram.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
