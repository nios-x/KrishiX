import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calculator, ShieldCheck, AlertCircle, 
  ArrowRight, Compass, Sparkles, BarChart2 
} from 'lucide-react';
import { predictYield, getProductionStates, getProductionDistricts, getProductionCrops } from '../services/api';
import { useFarm } from '../context/FarmContext';

export default function YieldPage({ onNavigate }) {
  const { farmInfo, setFarmInfo, setLatestYield } = useFarm();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [crops, setCrops] = useState([]);

  const [formData, setFormData] = useState({
    state: farmInfo.state || 'Punjab',
    district: farmInfo.district || 'LUDHIANA',
    crop: farmInfo.currentCrop || 'Wheat',
    season: 'Rabi',
    area: farmInfo.area || 3.5,
    year: 2024
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductionStates().then(setStates).catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.state) {
      getProductionDistricts(formData.state).then(dList => {
        setDistricts(dList);
        if (!dList.includes(formData.district)) {
          setFormData(prev => ({ ...prev, district: dList[0] || '' }));
        }
      }).catch(() => {});
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.state) {
      getProductionCrops(formData.state, formData.district).then(cList => {
        setCrops(cList);
        if (!cList.includes(formData.crop)) {
          setFormData(prev => ({ ...prev, crop: cList[0] || 'Wheat' }));
        }
      }).catch(() => {});
    }
  }, [formData.state, formData.district]);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await predictYield(formData);
      setResult(data);
      setLatestYield(data);
    } catch (err) {
      setError(err.message || 'Failed to estimate yield');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
          <span>STATISTICAL REGRESSION ENGINE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Yield Intelligence &amp; Harvest Estimation
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Estimate harvest yield using our Random Forest regressor trained on 246K+ Indian agricultural records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Field Parameters</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Random Forest (R² = 0.898)</span>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            
            {/* State & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Crop & Season */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Crop
                </label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Agricultural Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Whole Year">Whole Year</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </div>
            </div>

            {/* Area & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Cultivated Area (Hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) || 1 }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Crop Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 2024 }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculating Regression Estimates...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Estimate Yield &amp; Total Production</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {!result && !loading && (
            <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <BarChart2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Ready for Yield Estimation
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Select your state, district, crop, and farm area, then click <strong>"Estimate Yield &amp; Total Production"</strong> to view model estimates vs historical state benchmarks.
              </p>
              <button
                type="button"
                onClick={() => handlePredict()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                Run with Current Values
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Output Header Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-xl shadow-emerald-800/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                    AI ESTIMATED PRODUCTION
                  </span>
                  <span className="text-xs text-emerald-100 font-mono">
                    {result.crop} • {result.season}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-emerald-100 font-medium">Estimated Yield</span>
                    <div className="text-3xl sm:text-4xl font-black mt-0.5">
                      {result.estimated_yield_tonnes_per_ha} <span className="text-lg font-normal text-emerald-200">t/ha</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-100 font-medium">Estimated Harvest</span>
                    <div className="text-3xl sm:text-4xl font-black mt-0.5">
                      {result.estimated_production_tonnes} <span className="text-lg font-normal text-emerald-200">tonnes</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-emerald-100">
                    Location: <strong>{result.district}, {result.state}</strong> ({result.cultivated_area_hectares} ha)
                  </div>
                  <div className="font-semibold text-emerald-200">
                    {result.trend} ({result.difference_from_average_percent > 0 ? '+' : ''}{result.difference_from_average_percent}%)
                  </div>
                </div>
              </div>

              {/* Benchmark Comparison Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Historical Regional Benchmark Comparison
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-xs text-slate-500">Historical State Average</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {result.historical_average_yield} <span className="text-xs font-normal text-slate-400">t/ha</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Based on {result.historical_records_basis} surveyed seasons
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-xs text-slate-500">Model Performance</span>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      R² = {result.model_metadata?.r2_score}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      MAE: {result.model_metadata?.mae} tonnes/ha on test records
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Agronomic Yield Insight</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Expected output is {result.difference_from_average_percent >= 0 ? 'favorable compared to' : 'slightly below'} regional multi-year averages. Maintaining scheduled irrigation and balanced basal NPK will help realize optimal potential.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Next: Ask KrishiMitra AI for conversational recommendations.
                  </span>
                  <button
                    onClick={() => onNavigate('advisor')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open AI Advisor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Responsible AI Disclaimer (Prompt #15: Never guaranteed) */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Responsible AI Notice:</strong> {result.disclaimer}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
