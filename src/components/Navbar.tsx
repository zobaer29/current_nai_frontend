import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setActiveLocationFilter, setSearchQuery } from '../store/outageSlice';
import { Zap, MapPin, Search, ChevronDown, Check, Home, GraduationCap, Briefcase, Navigation } from 'lucide-react';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedLocations, activeLocationFilter, searchQuery, incidents } = useSelector(
    (state: RootState) => state.outage
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLocationSelect = (label: string, lat?: number, lng?: number, areaName?: string) => {
    dispatch(setActiveLocationFilter({ label, lat, lng, areaName }));
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Search autocomplete options based on incidents & saved locations
  const searchSuggestions = incidents.filter((inc) =>
    searchQuery.trim() !== '' && inc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleLocationSelect('Current Location', 23.8069, 90.3687, 'Mirpur 10')}>
              <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl shadow-lg shadow-red-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 fill-red-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                    ⚡ কারেন্টনাই
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">
                    Live BD
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Crowdsourced Outage Intelligence
                </p>
              </div>
            </div>

            {/* Mobile Badge */}
            <div className="md:hidden flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            </div>
          </div>

          {/* Controls: Search & Location Picker */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1 max-w-2xl justify-end">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 md:w-72">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search area (e.g. Mirpur, Banani)..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-700/50">
                    Matching Outage Areas
                  </div>
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleLocationSelect(item.area, item.lat, item.lng, item.area);
                        dispatch(setSearchQuery(''));
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/70 flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {item.area}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.status === 'CONFIRMED' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'POSSIBLE' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.reports} reports
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Dropdown Picker */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto px-3.5 py-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 flex items-center justify-between sm:justify-start gap-2.5 transition shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium truncate max-w-[150px]">
                    {activeLocationFilter}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    Select Location
                  </div>

                  {/* Current Location Option */}
                  <button
                    onClick={() => handleLocationSelect('Current Location', 23.8069, 90.3687, 'Mirpur 10')}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${
                      activeLocationFilter === 'Current Location'
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                        : 'text-slate-200 hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Navigation className="w-4 h-4 text-indigo-400" />
                      <div>
                        <div>Current Location</div>
                        <div className="text-[10px] text-slate-400">GPS Approximate</div>
                      </div>
                    </div>
                    {activeLocationFilter === 'Current Location' && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>

                  <div className="my-1 border-t border-slate-700/50"></div>

                  {/* Saved Locations */}
                  {savedLocations.map((loc) => {
                    const icon =
                      loc.name === 'Home' ? <Home className="w-4 h-4 text-amber-400" /> :
                      loc.name === 'University' ? <GraduationCap className="w-4 h-4 text-purple-400" /> :
                      <Briefcase className="w-4 h-4 text-blue-400" />;
                    
                    const label = `${loc.name}: ${loc.area}`;

                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationSelect(label, loc.lat, loc.lng, loc.area)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${
                          activeLocationFilter === label
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                            : 'text-slate-200 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {icon}
                          <div>
                            <div>{loc.name}</div>
                            <div className="text-[10px] text-slate-400">{loc.area}</div>
                          </div>
                        </div>
                        {activeLocationFilter === label && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
