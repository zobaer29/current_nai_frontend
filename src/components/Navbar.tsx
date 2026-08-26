import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import {
  setActiveLocationFilter,
  setSearchQuery,
  setUserRole,
  setSelectedRegion,
} from '../store/outageSlice';
import { searchLocationIQ, reverseGeocodeLocationIQ } from '../services/geocoding';
import type { GeocodingResult } from '../services/geocoding';
import type { UserRole } from '../types';
import { BD_REGIONS } from '../data/bangladeshRegions';
import {
  Zap,
  MapPin,
  Search,
  ChevronDown,
  Check,
  Home,
  GraduationCap,
  Briefcase,
  Navigation,
  Loader2,
  ShieldAlert,
  User,
  UserCheck,
  Globe2,
  Building2,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenAdminConsole?: () => void }> = ({ onOpenAdminConsole }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedLocations, activeLocationFilter, searchQuery, incidents, userRole, selectedRegion } = useSelector(
    (state: RootState) => state.outage
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isDivisionMenuOpen, setIsDivisionMenuOpen] = useState(false);
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);

  // Active division info object
  const activeDivInfo =
    BD_REGIONS.divisions.find((d) => d.name === selectedRegion.division) ||
    BD_REGIONS.divisions[0];

  const handleLocationSelect = (label: string, lat?: number, lng?: number, areaName?: string) => {
    dispatch(setActiveLocationFilter({ label, lat, lng, areaName }));
    setIsDropdownOpen(false);
  };

  const handleDivisionChange = (divName: string) => {
    const divInfo = BD_REGIONS.divisions.find((d) => d.name === divName);
    const firstDistrict = divInfo?.districts[0]?.name || 'All Districts';
    
    dispatch(setSelectedRegion({ division: divName, district: firstDistrict }));
    setIsDivisionMenuOpen(false);

    if (divInfo) {
      dispatch(
        setActiveLocationFilter({
          label: `${divInfo.bnName}`,
          lat: divInfo.coords.lat,
          lng: divInfo.coords.lng,
          areaName: divInfo.name,
        })
      );
    }
  };

  const handleDistrictChange = (distName: string) => {
    const distInfo = activeDivInfo.districts.find((d) => d.name === distName);
    dispatch(setSelectedRegion({ district: distName }));
    setIsDistrictMenuOpen(false);

    if (distInfo) {
      dispatch(
        setActiveLocationFilter({
          label: `${distInfo.bnName}`,
          lat: distInfo.coords.lat,
          lng: distInfo.coords.lng,
          areaName: distInfo.name,
        })
      );
    }
  };

  const handleUseDeviceLocation = () => {
    setIsGettingGps(true);
    setIsDropdownOpen(false);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const detectedArea = await reverseGeocodeLocationIQ(latitude, longitude);
          dispatch(
            setActiveLocationFilter({
              label: 'Current Location',
              lat: latitude,
              lng: longitude,
              areaName: detectedArea || 'My Area',
            })
          );
          setIsGettingGps(false);
        },
        (_error) => {
          dispatch(
            setActiveLocationFilter({
              label: 'Current Location',
              lat: 23.8069,
              lng: 90.3687,
              areaName: 'Mirpur 10',
            })
          );
          setIsGettingGps(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      dispatch(
        setActiveLocationFilter({
          label: 'Current Location',
          lat: 23.8069,
          lng: 90.3687,
          areaName: 'Mirpur 10',
        })
      );
      setIsGettingGps(false);
    }
  };

  // Debounced API Geocoding Search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setGeocodingResults([]);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      const results = await searchLocationIQ(searchQuery);
      setGeocodingResults(results);
      setIsSearchingApi(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredLocalIncidents = incidents.filter((inc) =>
    inc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Logo & User Role Switcher */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleUseDeviceLocation}>
              <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl shadow-lg shadow-red-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 fill-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>কারেন্টনাই</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                    LIVE BD
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Community Outage Detection Platform
                </p>
              </div>
            </div>

            {/* User Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                {userRole === 'ADMIN' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                ) : userRole === 'REGISTERED' ? (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{userRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Select Role View</div>
                  {(['GUEST', 'REGISTERED', 'ADMIN'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        dispatch(setUserRole(role));
                        setIsRoleMenuOpen(false);
                        if (role === 'ADMIN' && onOpenAdminConsole) {
                          onOpenAdminConsole();
                        }
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                        userRole === role ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{role} Mode</span>
                      {userRole === role && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Division & District Hierarchy Controls + Search */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* Division Dropdown (FR-02) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDivisionMenuOpen(!isDivisionMenuOpen);
                  setIsDistrictMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeDivInfo.bnName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDivisionMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                    Select Division (বিভাগ)
                  </div>
                  {BD_REGIONS.divisions.map((div) => (
                    <button
                      key={div.name}
                      onClick={() => handleDivisionChange(div.name)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                        selectedRegion.division === div.name
                          ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{div.bnName} ({div.name})</span>
                      {selectedRegion.division === div.name && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* District Dropdown (FR-02) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDistrictMenuOpen(!isDistrictMenuOpen);
                  setIsDivisionMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeDivInfo.districts.find((d) => d.name === selectedRegion.district)?.bnName || 'সকল জেলা'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDistrictMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                    {activeDivInfo.bnName} - জেলাসমূহ ({activeDivInfo.districts.length})
                  </div>
                  {activeDivInfo.districts.map((dist) => (
                    <button
                      key={dist.name}
                      onClick={() => handleDistrictChange(dist.name)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                        selectedRegion.district === dist.name
                          ? 'bg-emerald-600/20 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{dist.bnName} ({dist.name})</span>
                      {selectedRegion.district === dist.name && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px]">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Area (Mirpur, Banani, Agrabad)..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 max-h-72 overflow-y-auto">
                  {filteredLocalIncidents.length > 0 && (
                    <div>
                      <div className="px-3.5 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        Active Outage Hotspots
                      </div>
                      {filteredLocalIncidents.map((inc) => (
                        <button
                          key={inc.id}
                          onClick={() => {
                            handleLocationSelect(inc.area, inc.lat, inc.lng, inc.area);
                            dispatch(setSearchQuery(''));
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-700/70 text-xs flex items-center justify-between transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            <span className="font-semibold text-white">{inc.area}</span>
                          </div>
                          <span className="text-[10px] text-red-300 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                            {inc.reports} reports
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearchingApi ? (
                    <div className="px-3.5 py-3 text-xs text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Searching LocationIQ...
                    </div>
                  ) : (
                    geocodingResults.length > 0 && (
                      <div>
                        <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-700/50 mt-1 pt-1.5">
                          Map Locations
                        </div>
                        {geocodingResults.map((res) => (
                          <button
                            key={res.place_id}
                            onClick={() => {
                              handleLocationSelect(res.display_name.split(',')[0], res.lat, res.lng, res.display_name.split(',')[0]);
                              dispatch(setSearchQuery(''));
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-700/70 text-xs flex items-center gap-2 transition cursor-pointer text-slate-300"
                          >
                            <Globe2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{res.display_name}</span>
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Saved Location Picker */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{activeLocationFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50">
                  <button
                    onClick={handleUseDeviceLocation}
                    disabled={isGettingGps}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-slate-200 hover:bg-slate-700"
                  >
                    {isGettingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Navigation className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>Current Location</span>
                  </button>

                  <div className="my-1 border-t border-slate-700/50"></div>

                  {savedLocations.map((loc) => {
                    const icon =
                      loc.name === 'Home' ? <Home className="w-3.5 h-3.5 text-amber-400" /> :
                      loc.name === 'University' ? <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> :
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
                    const label = `${loc.name}: ${loc.area}`;

                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationSelect(label, loc.lat, loc.lng, loc.area)}
                        className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between text-slate-200 hover:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{loc.name}</span>
                        </div>
                        {activeLocationFilter === label && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};
