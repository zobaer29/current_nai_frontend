import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { adminDeleteIncident, adminMergeIncidents } from '../store/outageSlice';
import { ShieldAlert, Trash2, GitMerge, CheckCircle, Server, ShieldCheck, Activity } from 'lucide-react';

export const AdminDashboardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { incidents } = useSelector((state: RootState) => state.outage);

  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleMerge = () => {
    if (selectedForMerge.length === 2) {
      dispatch(adminMergeIncidents({ targetId: selectedForMerge[0], sourceId: selectedForMerge[1] }));
      setSelectedForMerge([]);
    }
  };

  const toggleSelectForMerge = (id: string) => {
    if (selectedForMerge.includes(id)) {
      setSelectedForMerge(selectedForMerge.filter((item) => item !== id));
    } else {
      if (selectedForMerge.length < 2) {
        setSelectedForMerge([...selectedForMerge, id]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-4xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                System Administrator Moderation Console
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full">
                  FR-24 / FR-25 / FR-26
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage live reports, merge duplicate spatial clusters, review confidence engine scores, and monitor abuse filters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* System Health & Anti-Spam Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>System Health</span>
            </div>
            <div className="text-xl font-black text-emerald-400">99.98% Uptime</div>
            <p className="text-[10px] text-slate-500">Node.js API + PostGIS Spatial Indexing</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Anti-Spam & Throttling</span>
            </div>
            <div className="text-xl font-black text-indigo-400">0 Flags Active</div>
            <p className="text-[10px] text-slate-500">IP rate limiting & Device Fingerprinting</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Active Clusters</span>
            </div>
            <div className="text-xl font-black text-amber-400">{incidents.length} Outage Incidents</div>
            <p className="text-[10px] text-slate-500">Clustered across 4 Bangladesh Divisions</p>
          </div>
        </div>

        {/* Incident Moderation Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Live Incident Moderation Queue</h4>
            {selectedForMerge.length === 2 && (
              <button
                onClick={handleMerge}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <GitMerge className="w-4 h-4" />
                <span>Merge Selected Incidents (2)</span>
              </button>
            )}
          </div>

          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-700">
                <tr>
                  <th className="p-3">Select</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Electrical Grid</th>
                  <th className="p-3">Reports</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {incidents.map((inc) => {
                  const isSelected = selectedForMerge.includes(inc.id);
                  return (
                    <tr key={inc.id} className={`hover:bg-slate-900/60 transition ${isSelected ? 'bg-indigo-950/40' : ''}`}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectForMerge(inc.id)}
                          className="rounded border-slate-700 accent-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-bold text-white">
                        {inc.area}
                        <div className="text-[10px] text-slate-400 font-normal">{inc.district || 'Dhaka'}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-indigo-300 font-semibold">{inc.substation || 'Substation N/A'}</div>
                        <div className="text-[10px] text-slate-400">{inc.feederName || 'Feeder Line'}</div>
                      </td>
                      <td className="p-3 font-bold">{inc.reports}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono font-bold">
                          {inc.confidence}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.status === 'CONFIRMED' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          inc.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => dispatch(adminDeleteIncident(inc.id))}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                          title="Remove Incident"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" /> Real-time Confidence Engine Active
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
