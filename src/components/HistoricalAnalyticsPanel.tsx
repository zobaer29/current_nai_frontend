import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setTimeSliderHour, togglePlayback } from '../store/outageSlice';
import { Play, Pause, History, Share2, BarChart2, Check, Copy } from 'lucide-react';

export const HistoricalAnalyticsPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { historicalPoints, timeSliderHour, isPlaybackPlaying, currentAreaStatus } = useSelector(
    (state: RootState) => state.outage
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentHourPoint = historicalPoints.find((p) => p.hour === timeSliderHour) || historicalPoints[historicalPoints.length - 1];

  const handleCopyShare = () => {
    const text = `⚡ [কারেন্টনাই - CurrentNai Alert]\nএলাকা: ${currentAreaStatus?.areaName || 'Mirpur 10'}\nঅবস্থা: 🔴 কারেন্ট নেই (POSSIBLE OUTAGE)\nরিপোর্ট: ${currentAreaStatus?.reportsCount || 23} জন | কনফিডেন্স: ${currentAreaStatus?.confidenceScore || 91}%\n\nলাইভ লাইভ আপডেট দেখতে ভিসিট করুন: https://currentnai.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Time-Based Outage Playback & Analytics
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                FR-21 / FR-23
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag the timeline slider to playback historical electricity outage progression across Bangladesh over 24 hours.
            </p>
          </div>
        </div>

        {/* Social Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Share Status Card</span>
        </button>
      </div>

      {/* 24-Hour Interactive Timeline Playback Slider */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(togglePlayback())}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition cursor-pointer shadow-md"
            >
              {isPlaybackPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <span className="font-bold text-white">Playback Time:</span>
            <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30">
              {currentHourPoint ? currentHourPoint.timeLabel : 'Now'}
            </span>
          </div>

          <div className="text-slate-400 font-medium">
            Active Outage Hotspots: <strong className="text-amber-400">{currentHourPoint?.activeOutages || 0} areas</strong>
          </div>
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max="24"
          step="4"
          value={timeSliderHour}
          onChange={(e) => dispatch(setTimeSliderHour(Number(e.target.value)))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span>00:00 AM</span>
          <span>04:00 AM</span>
          <span>08:00 AM</span>
          <span>12:00 PM</span>
          <span>04:00 PM</span>
          <span>08:00 PM</span>
          <span className="text-indigo-400 font-bold">Now</span>
        </div>
      </div>

      {/* Outage Density Bar Chart Visualization */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-3">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>24-Hour Outage Density & Peak Hours</span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4">
          {historicalPoints.map((point) => {
            const isSelected = point.hour === timeSliderHour;
            const heightPercent = Math.min(100, Math.max(15, (point.activeOutages / 40) * 100));

            return (
              <div
                key={point.hour}
                onClick={() => dispatch(setTimeSliderHour(point.hour))}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="w-full bg-slate-800 rounded-t-xl overflow-hidden relative h-20 flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full transition-all duration-300 rounded-t-lg ${
                      isSelected
                        ? 'bg-gradient-to-t from-indigo-600 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                        : 'bg-slate-700 group-hover:bg-slate-600'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                  {point.timeLabel.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Card Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" /> Social Card Exporter
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Generated Card Preview */}
            <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border border-red-500/40 p-5 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                  ⚡ কারেন্টনাই • Alert Card
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live BD Signal</span>
              </div>

              <div>
                <h4 className="text-xl font-black text-white">{currentAreaStatus?.areaName || 'Mirpur 10'}</h4>
                <p className="text-xs text-red-300 font-semibold mt-1">
                  🔴 POSSIBLE OUTAGE ({currentAreaStatus?.reportsCount || 23} user reports)
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Confidence: <strong className="text-white">{currentAreaStatus?.confidenceScore || 91}%</strong></span>
                <span>Active: <strong className="text-white">{currentAreaStatus?.activeMinutes || 47}m</strong></span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyShare}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Social Alert Message'}</span>
              </button>
              
              <p className="text-[11px] text-slate-400 text-center">
                Ready for posting to Facebook Groups, WhatsApp, and Twitter.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
