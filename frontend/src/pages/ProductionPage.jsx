import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, MapPin, Filter, Layers, 
  ArrowRight, Download, RefreshCw, AlertCircle 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  getProductionStates, getProductionDistricts, getProductionCrops, 
  getProductionSeasons, getProductionAnalytics 
} from '../services/api';
import { useFarm } from '../context/FarmContext';

export default function ProductionPage({ onNavigate }) {
  const { farmInfo, setFarmInfo } = useFarm();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [crops, setCrops] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const [filters, setFilters] = useState({
    state: farmInfo.state || 'Punjab',
    district: farmInfo.district || 'LUDHIANA',
    crop: 'Wheat',
    season: 'All',
    start_year: 1997,
    end_year: 2015
  });

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial filter dropdowns
  useEffect(() => {
    Promise.all([
      getProductionStates(),
      getProductionSeasons()
    ]).then(([st, sn]) => {
      setStates(st);
      setSeasons(['All', ...sn]);
    }).catch(() => {});
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (filters.state && filters.state !== 'All') {
      getProductionDistricts(filters.state).then(distList => {
        setDistricts(['All', ...distList]);
        if (!distList.includes(filters.district)) {
          setFilters(prev => ({ ...prev, district: distList[0] || 'All' }));
        }
      }).catch(() => {});
    } else {
      setDistricts(['All']);
    }
  }, [filters.state]);

  // Update crops when state or district changes
  useEffect(() => {
    getProductionCrops(
      filters.state !== 'All' ? filters.state : null,
      filters.district !== 'All' ? filters.district : null
    ).then(cropList => {
      setCrops(['All', ...cropList]);
    }).catch(() => {});
  }, [filters.state, filters.district]);

  // Fetch analytics data
  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductionAnalytics(filters);
      setAnalytics(data);
      if (filters.state !== 'All') {
        setFarmInfo(prev => ({
          ...prev,
          state: filters.state,
          district: filters.district !== 'All' ? filters.district : prev.district,
          currentCrop: filters.crop !== 'All' ? filters.crop : prev.currentCrop
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load agricultural records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [filters.state, filters.district, filters.crop, filters.season]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
            <span>HISTORICAL ANALYTICS ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            India Agricultural Production Intelligence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Aggregated multi-decade insights across 246,091 official Ministry of Agriculture records (1997–2015).
          </p>
        </div>

        <button
          onClick={() => onNavigate('yield')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Predict Future Yield</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter Agricultural Records</span>
          </span>
          <span className="text-[11px] text-slate-400">Indexed Sub-millisecond Queries</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* State */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              District
            </label>
            <select
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Crop */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Crop
            </label>
            <select
              value={filters.crop}
              onChange={(e) => setFilters(prev => ({ ...prev, crop: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Season
            </label>
            <select
              value={filters.season}
              onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Action */}
          <div className="flex items-end">
            <button
              onClick={loadAnalytics}
              disabled={loading}
              className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Apply Filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* KPI Cards (Prompt #12) */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              Total Production
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.total_production.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Metric Tonnes</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              Cultivated Area
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.total_area.toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-600 font-bold">Hectares</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              Calculated Yield
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {analytics.calculated_yield}
            </div>
            <span className="text-[10px] text-slate-500">Tonnes / Hectare</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              Records Analyzed
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.record_count.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Survey Entries</span>
          </div>

        </div>
      )}

      {/* 5 Interactive Charts (Prompt #13) */}
      {analytics && !analytics.empty && (
        <div className="space-y-8">
          
          {/* Row 1: Chart 1 (Production Trend) & Chart 3 (Yield Trend) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Production Trend */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Chart 1: Production Trend (Tonnes vs Year)
                  </h3>
                  <p className="text-xs text-slate-500">Aggregated annual crop production volume</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.production_trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip 
                      formatter={(val) => [`${Number(val).toLocaleString()} Tonnes`, 'Production']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Calculated Yield Trend */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Chart 3: Historical Yield Trend (Tonnes/Ha)
                  </h3>
                  <p className="text-xs text-slate-500">Yield = Annual Production / Cultivated Area</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.yield_trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="year" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip 
                      formatter={(val) => [`${val} t/ha`, 'Yield']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="yield" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Chart 4 (Top Crops) & Chart 5 (Season Analysis) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Chart 4: Top Crops Horizontal Bar */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chart 4: Top Crops by Regional Production
                </h3>
                <p className="text-xs text-slate-500">Top 10 cultivated crops sorted by total harvest volume</p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={analytics.top_crops}
                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" fontSize={11} stroke="#94a3b8" />
                    <YAxis type="category" dataKey="crop" fontSize={11} stroke="#94a3b8" width={90} />
                    <Tooltip 
                      formatter={(val) => [`${Number(val).toLocaleString()} Tonnes`, 'Total Production']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="production" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 5: Season Distribution Pie */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chart 5: Seasonal Agricultural Share
                </h3>
                <p className="text-xs text-slate-500">Kharif, Rabi, Summer, Winter &amp; Whole Year</p>
              </div>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.season_distribution}
                      dataKey="production"
                      nameKey="season"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={45}
                      paddingAngle={4}
                      label={({ season, percent }) => `${season} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {analytics.season_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [`${Number(val).toLocaleString()} Tonnes`, 'Production']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 3: Chart 2 (Area vs Production Scatter Plot) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Chart 2: Area vs Production Correlation
              </h3>
              <p className="text-xs text-slate-500">Scatter distribution showing production density across farm plot sizes</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" dataKey="area" name="Area (ha)" fontSize={11} stroke="#94a3b8" />
                  <YAxis type="number" dataKey="production" name="Production (t)" fontSize={11} stroke="#94a3b8" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val, name) => [Number(val).toLocaleString(), name]}
                  />
                  <Scatter name="Farms" data={analytics.area_vs_production} fill="#10b981" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Empty State */}
      {analytics?.empty && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No agricultural records found for this selection.
          </h3>
          <p className="text-xs text-slate-500">
            Please broaden your filter selections (e.g. choose "All" seasons or select a major crop like Rice or Wheat).
          </p>
        </div>
      )}

    </div>
  );
}
