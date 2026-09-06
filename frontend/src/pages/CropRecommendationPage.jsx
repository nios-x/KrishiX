import React, { useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { recommendCrop } from '../services/api';
import { useFarm } from '../context/FarmContext';
import { SheetHeader, SheetBody, Panel, SectionRule, Meter, Marginal } from '../components/Sheet';

/* ─────────────────────────────────────────────────────────────────
   SHEET 02 · SOIL & CLIMATE DETERMINATION
   Seven measurements are entered on the left; the register on the
   right ranks 22 crops against them and shows its working.
   ───────────────────────────────────────────────────────────────── */

const PRESETS = [
  { id: 'rice', label: 'Rice (Paddy)' },
  { id: 'cotton', label: 'Cotton' },
  { id: 'chickpea', label: 'Chickpea (Gram)' },
  { id: 'apple', label: 'Apple' },
];

/** A boxed measurement field with its admissible range. */
function Measure({ label, range, ...input }) {
  return (
    <label className="block">
      <span className="label-typed-sm mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>
        {label}
      </span>
      <input className="field-box" {...input} />
      {range ? (
        <span
          className="label-typed-sm mt-1.5 block"
          style={{ color: 'var(--rule-strong)', letterSpacing: '0.08em' }}
        >
          {range}
        </span>
      ) : null}
    </label>
  );
}

/** A measuring rule: the value travels along the scale it is read on. */
function Scale({ label, value, unit, min, max, step, onChange, marks }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
          {label}
        </span>
        <span className="accession text-[0.8125rem]" style={{ color: 'var(--determ)' }}>
          {value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="slider-ruled"
        aria-label={label}
      />
      <div className="mt-1.5 flex justify-between">
        {marks.map((m) => (
          <span
            key={m}
            className="label-typed-sm"
            style={{ color: 'var(--rule-strong)', fontSize: '0.5625rem' }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CropRecommendationPage({ onNavigate }) {
  const { soilParams, setSoilParams, farmInfo, setFarmInfo, setLatestRecommendation } = useFarm();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setSoilParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleFarmInfoChange = (field, value) => {
    setFarmInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadPreset = (cropType) => {
    if (cropType === 'rice') {
      setSoilParams({ n: 90, p: 42, k: 43, temperature: 24.5, humidity: 82.0, ph: 6.5, rainfall: 220.0 });
    } else if (cropType === 'cotton') {
      setSoilParams({ n: 120, p: 40, k: 20, temperature: 26.0, humidity: 80.0, ph: 7.2, rainfall: 75.0 });
    } else if (cropType === 'apple') {
      setSoilParams({ n: 25, p: 130, k: 200, temperature: 22.0, humidity: 92.0, ph: 6.0, rainfall: 110.0 });
    } else if (cropType === 'chickpea') {
      setSoilParams({ n: 40, p: 68, k: 80, temperature: 18.5, humidity: 16.5, ph: 7.3, rainfall: 80.0 });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        n: soilParams.n,
        p: soilParams.p,
        k: soilParams.k,
        temperature: soilParams.temperature,
        humidity: soilParams.humidity,
        ph: soilParams.ph,
        rainfall: soilParams.rainfall,
        state: farmInfo.state,
        district: farmInfo.district,
        farm_area: farmInfo.area
      };

      const data = await recommendCrop(payload);
      setResult(data);
      setLatestRecommendation(data);
    } catch (err) {
      setError(err.message || 'Failed to generate crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <SheetHeader
        accession="Soil & climate engine · KX-02"
        title="Find the right crop for your farm"
        summary="Enter the localized soil chemistry and atmospheric readings for this parcel. The register evaluates agro-climatic suitability across 22 crops and shows the working behind its determination."
        stamp="22 crops"
        actions={
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
              Quick presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p.id)}
                  className="label-typed-sm cursor-pointer border px-2 py-1.5 transition-colors duration-200"
                  style={{
                    borderColor: 'var(--rule-strong)',
                    color: 'var(--ink-soft)',
                    background: 'transparent',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <SheetBody>
        <div className="grid items-start gap-8 lg:grid-cols-12">

          {/* ══ The entry register ═══════════════════════════════ */}
          <div className="lg:col-span-5">
            <Panel title="Farm & soil parameters" note="7 measurements" className="lay">
              <form onSubmit={handleSubmit}>

                {/* ── Where the sample was taken ───────────────── */}
                <SectionRule title="Accession" note="Location" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Measure
                    label="State"
                    type="text"
                    value={farmInfo.state}
                    onChange={(e) => handleFarmInfoChange('state', e.target.value)}
                    placeholder="e.g. Punjab"
                  />
                  <Measure
                    label="District"
                    type="text"
                    value={farmInfo.district}
                    onChange={(e) => handleFarmInfoChange('district', e.target.value)}
                    placeholder="e.g. Ludhiana"
                  />
                  <div className="col-span-2">
                    <Measure
                      label="Cultivated area"
                      range="Hectares"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={farmInfo.area}
                      onChange={(e) => handleFarmInfoChange('area', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {/* ── Macronutrients ──────────────────────────── */}
                <div className="mt-8">
                  <SectionRule title="Macronutrients" note="NPK · kg/ha" />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <Measure
                      label="Nitrogen"
                      range="0 – 140"
                      type="number"
                      value={soilParams.n}
                      onChange={(e) => handleInputChange('n', e.target.value)}
                      placeholder="kg/ha"
                    />
                    <Measure
                      label="Phosphorus"
                      range="5 – 145"
                      type="number"
                      value={soilParams.p}
                      onChange={(e) => handleInputChange('p', e.target.value)}
                      placeholder="kg/ha"
                    />
                    <Measure
                      label="Potassium"
                      range="5 – 205"
                      type="number"
                      value={soilParams.k}
                      onChange={(e) => handleInputChange('k', e.target.value)}
                      placeholder="kg/ha"
                    />
                  </div>
                </div>

                {/* ── Climate & soil properties ───────────────── */}
                <div className="mt-8">
                  <SectionRule title="Climate & soil properties" note="4 readings" />
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <Scale
                      label="Soil pH"
                      value={soilParams.ph}
                      min="3.5"
                      max="9.5"
                      step="0.1"
                      onChange={(e) => handleInputChange('ph', e.target.value)}
                      marks={['Acidic 3.5', 'Neutral 7.0', 'Alkaline 9.5']}
                    />
                    <Scale
                      label="Rainfall"
                      value={soilParams.rainfall}
                      unit="mm"
                      min="20"
                      max="300"
                      step="5"
                      onChange={(e) => handleInputChange('rainfall', e.target.value)}
                      marks={['Arid 20', 'Moderate 150', 'Wet 300']}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Measure
                      label="Temperature"
                      range="Degrees Celsius"
                      type="number"
                      step="0.5"
                      value={soilParams.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                    />
                    <Measure
                      label="Humidity"
                      range="Percent relative"
                      type="number"
                      step="1"
                      min="10"
                      max="100"
                      value={soilParams.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="mt-7 flex items-start gap-2.5 border-l-2 py-2 pl-4"
                    style={{ borderColor: 'var(--stamp)' }}
                    role="alert"
                  >
                    <AlertCircle
                      width={15}
                      height={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--stamp)' }}
                    />
                    <span className="text-[0.8125rem] leading-[1.55]" style={{ color: 'var(--stamp)' }}>
                      {error}
                    </span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn btn-ink mt-8 w-full">
                  {loading ? 'Computing Random Forest suitability…' : 'Determine the crop'}
                  {!loading && <ArrowRight width={15} height={15} />}
                </button>
              </form>
            </Panel>
          </div>

          {/* ══ The determination ════════════════════════════════ */}
          <div className="flex flex-col gap-6 lg:col-span-7">

            {!result && !loading && (
              <div
                className="grain-sunk lay border p-10 text-center sm:p-14"
                style={{ borderColor: 'var(--rule-strong)', background: 'var(--sheet-sunk)' }}
              >
                <p className="label-typed-sm m-0" style={{ color: 'var(--stamp)' }}>
                  Awaiting determination
                </p>
                <h3 className="determination-xs mt-4 mb-0" style={{ color: 'var(--ink)' }}>
                  The sheet is ready to be read.
                </h3>
                <p
                  className="mx-auto mt-4 mb-0 text-[0.875rem] leading-[1.65]"
                  style={{ color: 'var(--ink-soft)', maxWidth: '46ch' }}
                >
                  Enter the soil parameters or load one of the presets above, then determine
                  the crop to see ranked confidence and the feature attribution behind it.
                </p>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="btn btn-sheet btn-sm mt-7"
                >
                  Run with current values
                </button>
              </div>
            )}

            {result && (
              <>
                {/* ── The determination line ─────────────────── */}
                <section className="field-ink p-6 sm:p-8">
                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
                    <div className="min-w-0">
                      <p className="label-typed-sm m-0 mb-3" style={{ color: 'var(--specimen-hi)' }}>
                        Top recommendation
                      </p>
                      <h2
                        className="determination m-0"
                        style={{ color: 'var(--on-ink)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
                      >
                        {result.recommended_crop}
                      </h2>
                      <p
                        className="mt-4 mb-0 text-[0.875rem] leading-[1.6]"
                        style={{ color: 'var(--on-ink-soft)', maxWidth: '40ch' }}
                      >
                        Highly compatible with the soil chemistry recorded for{' '}
                        {farmInfo.district}, {farmInfo.state}.
                      </p>
                    </div>

                    <dl
                      className="m-0 shrink-0 border-l pl-6"
                      style={{ borderColor: 'var(--on-ink-rule)' }}
                    >
                      <dt className="label-typed-sm m-0" style={{ color: 'var(--on-ink-soft)' }}>
                        Confidence
                      </dt>
                      <dd
                        className="accession m-0 mt-2 text-[2.75rem] leading-none"
                        style={{ color: 'var(--specimen-hi)' }}
                      >
                        {result.confidence}%
                      </dd>
                      <dd
                        className="label-typed-sm mt-4 mb-0"
                        style={{ color: 'var(--on-ink-soft)' }}
                      >
                        22 crops evaluated
                      </dd>
                      <dd
                        className="label-typed-sm mt-1.5 mb-0"
                        style={{ color: 'var(--on-ink-rule)' }}
                      >
                        Random Forest · 100 trees
                      </dd>
                    </dl>
                  </div>
                </section>

                {/* ── The ranked register ────────────────────── */}
                <Panel title="Ranked by probability" note="Actual model output">
                  {result.top_recommendations.map((item, idx) => (
                    <div
                      key={item.crop_id}
                      className="border-b py-3.5 first:pt-0 last:border-b-0 last:pb-0"
                      style={{ borderColor: 'var(--rule)' }}
                    >
                      <div className="mb-2 flex items-baseline justify-between gap-4">
                        <span
                          className="label-typed"
                          style={{ color: idx === 0 ? 'var(--ink)' : 'var(--ink-soft)' }}
                        >
                          <span style={{ color: 'var(--rule-strong)' }}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>{' '}
                          {item.crop}
                        </span>
                        <span
                          className="accession text-[0.8125rem]"
                          style={{ color: idx === 0 ? 'var(--determ)' : 'var(--ink-faint)' }}
                        >
                          {item.confidence}%
                        </span>
                      </div>
                      <Meter
                        value={item.confidence}
                        tone={idx === 0 ? 'var(--determ)' : 'var(--specimen)'}
                      />
                    </div>
                  ))}
                </Panel>

                {/* ── The working ────────────────────────────── */}
                <Panel
                  title={`Why ${result.recommended_crop}?`}
                  note="Feature attribution"
                >
                  <p
                    className="mt-0 mb-0 text-[0.875rem] leading-[1.6]"
                    style={{ color: 'var(--ink-soft)', maxWidth: '64ch' }}
                  >
                    Calculated alignment of each measurement against the optimal agronomic
                    envelope the model learned for this crop.
                  </p>

                  <div className="mt-7 grid gap-px sm:grid-cols-2" style={{ background: 'var(--rule)' }}>
                    {result.feature_explanations.map((feat) => {
                      const optimal = feat.status === 'Optimal';
                      return (
                        <div
                          key={feat.feature}
                          className="p-4"
                          style={{ background: 'var(--sheet-sunk)' }}
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="label-typed" style={{ color: 'var(--ink)' }}>
                              {feat.display_name}
                            </span>
                            <span
                              className="stamp shrink-0"
                              style={{ color: optimal ? 'var(--determ)' : 'var(--stamp)' }}
                            >
                              {feat.status}
                            </span>
                          </div>

                          <div className="mt-3 mb-2.5 flex items-baseline justify-between gap-3">
                            <span
                              className="accession text-[0.75rem]"
                              style={{ color: 'var(--ink-soft)' }}
                            >
                              Yours {feat.value}
                            </span>
                            <span
                              className="accession text-[0.75rem]"
                              style={{ color: 'var(--ink-faint)' }}
                            >
                              Optimal {feat.optimal_mean}
                            </span>
                          </div>

                          <Meter
                            value={feat.suitability_percent}
                            tone={optimal ? 'var(--determ)' : 'var(--stamp)'}
                            height={4}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* ── The determiner's note ────────────────── */}
                  <div
                    className="mt-7 border-l-2 py-1 pl-4"
                    style={{ borderColor: 'var(--determ)' }}
                  >
                    <p className="label-typed-sm m-0" style={{ color: 'var(--determ)' }}>
                      Model insight
                    </p>
                    <p
                      className="mt-2 mb-0 text-[0.875rem] leading-[1.65]"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {result.model_insight}
                    </p>
                  </div>

                  <div
                    className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
                    style={{ borderColor: 'var(--rule-strong)' }}
                  >
                    <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
                      Next · scan the leaf or read the district history
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('crop-health')}
                      className="btn btn-ink btn-sm"
                    >
                      Proceed to crop health
                      <ArrowRight width={14} height={14} />
                    </button>
                  </div>
                </Panel>

                {/* ── The caveat that travels with the reading ─ */}
                <div
                  className="border-l-2 py-1 pl-4"
                  style={{ borderColor: 'var(--rule-strong)' }}
                  role="note"
                >
                  <p className="label-typed-sm m-0" style={{ color: 'var(--ink-faint)' }}>
                    Responsible AI notice
                  </p>
                  <Marginal>
                    {result.disclaimer} Never treat a model prediction as guaranteed success
                    or as a substitute for professional soil laboratory testing.
                  </Marginal>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetBody>
    </div>
  );
}
