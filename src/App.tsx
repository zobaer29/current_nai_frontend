import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { fetchMockOutageData } from './store/outageSlice';
import { Navbar } from './components/Navbar';
import { HeroAreaStatusCard } from './components/HeroAreaStatusCard';
import { InteractiveMap } from './components/InteractiveMap';
import { SavedPlacesNearbyPanel } from './components/SavedPlacesNearbyPanel';
import { HistoricalAnalyticsPanel } from './components/HistoricalAnalyticsPanel';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NotificationToast } from './components/NotificationToast';
import { Activity, ShieldCheck, Zap, Heart, ShieldAlert } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, userRole } = useSelector((state: RootState) => state.outage);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMockOutageData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenAdminConsole={() => setIsAdminModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {loading && (
          <div className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400 animate-spin" />
              Loading real-time crowdsourced outage data...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-600/20 border border-red-500/30 rounded-2xl text-xs text-red-300">
            ⚠ Failed to load initial outage data: {error}
          </div>
        )}

        {/* Admin Bar Trigger Banner if in ADMIN mode */}
        {userRole === 'ADMIN' && (
          <div className="bg-red-950/40 border border-red-500/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-red-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Administrator Mode Active (SRS FR-24 / FR-25 / FR-26)</span>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition cursor-pointer"
            >
              Open Admin Moderation Console
            </button>
          </div>
        )}

        {/* 1. Hero Section - Personal "My Area" Status Card */}
        <section>
          <HeroAreaStatusCard />
        </section>

        {/* 2. Interactive Leaflet Map Component */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Live Outage Map & Grid Radar
              </h2>
              <p className="text-xs text-slate-400">
                Interactive real-time map displaying confirmed outages, possible disruptions, and power restoration statuses.
              </p>
            </div>
          </div>

          <InteractiveMap />
        </section>

        {/* 3. Saved Places & Nearby Stats Panel */}
        <section className="space-y-3">
          <SavedPlacesNearbyPanel />
        </section>

        {/* 4. SRS Historical Analytics & 24-Hour Timeline Playback */}
        <section className="space-y-3">
          <HistoricalAnalyticsPanel />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">⚡ কারেন্টনাই (CurrentNai v1.0)</span>
            <span>—</span>
            <span>Bangladesh Community-Powered Electricity Outage Detection Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy Protected
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for BD
            </span>
          </div>
        </div>
      </footer>

      {/* SRS Admin Moderation Console Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Floating Action Feedback Notification */}
      <NotificationToast />
    </div>
  );
}
