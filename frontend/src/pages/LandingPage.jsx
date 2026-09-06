import React, { useState, useEffect } from 'react';
import {
  Sprout, Activity, BarChart3, ArrowRight, ArrowUpRight,
  Satellite, CloudRain, Cpu, Radio, Send, Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSystemStats } from '../services/api';
import { SectionRule } from '../components/Sheet';
import SplineStage from '../components/SplineStage';

/* ─────────────────────────────────────────────────────────────────
   SHEET 01 · THE DETERMINATION SHEET

   The opening sheet of the register. It states what Krishi360
   determines, what it determines it from, and shows three worked
   determinations laid over one another like annotation slips.
   ───────────────────────────────────────────────────────────────── */

/** The problem the register was opened to answer. */
const GAPS = [
  {
    title: 'Crop selection',
    body: 'Farmers often lack data-driven crop recommendations and rely on traditional habits that misalign with altered rainfall or changing soil chemistry.',
  },
  {
    title: 'Disease detection',
    body: 'Crop diseases and foliar blights may be detected too late, resulting in catastrophic loss before agricultural officers or lab diagnostics can be mobilized.',
  },
  {
    title: 'Production uncertainty',
    body: 'Historical production and yield data is difficult to interpret, burying regional trends inside massive statistical tables that farmers cannot access.',
  },
  {
    title: 'Fragmented information',
    body: 'Agricultural information exists across disconnected portals, leaving growers without a single unified command system for their field.',
  },
];

/** The three instruments, each with its own dataset and its own model. */
const INSTRUMENTS = [
  {
    no: '01',
    route: 'crop-recommendation',
    icon: Sprout,
    name: 'Crop Intelligence',
    stamp: 'Accuracy 99.55%',
    body: 'Uses chemical soil test parameters and climatic conditions to recommend the optimal crop among 22 distinct Indian agricultural classes.',
    action: 'Launch crop recommendation',
    rows: [
      ['Dataset', 'Crop Recommendation Dataset'],
      ['Model', 'Random Forest Classifier · 100 trees'],
      ['Input', 'N, P, K, Temp, Humidity, pH, Rainfall'],
      ['Output', 'Ranked crops + confidence + SHAP importance'],
    ],
  },
  {
    no: '02',
    route: 'crop-health',
    icon: Activity,
    name: 'Plant Health Intelligence',
    stamp: '38 classes',
    body: 'Analyzes crop leaf photographs with computer vision, diagnosing foliar blights, rusts, bacterial spots, and healthy leaf conditions.',
    action: 'Scan a crop leaf',
    rows: [
      ['Dataset', 'PlantVillage · 54,303 images'],
      ['Model', 'MobileNetV2 deep neural network'],
      ['Input', 'Crop leaf image · 224×224 RGB'],
      ['Output', 'Diagnosis + symptoms + safe cultural steps'],
    ],
  },
  {
    no: '03',
    route: 'production',
    icon: BarChart3,
    name: 'Production Intelligence',
    stamp: '246K+ records',
    body: 'Delivers multi-year yield and production trends across Indian states and districts, powered by a Random Forest yield regressor.',
    action: 'View production analytics',
    rows: [
      ['Dataset', 'Crop Production India · 246,091 rows'],
      ['Model', 'Random Forest Regressor · R² = 0.898'],
      ['Input', 'State, District, Crop, Season, Area'],
      ['Output', 'Estimated yield (t/ha) & production charts'],
    ],
  },
];

/** Accessions the cabinet has room for but has not received. */
const PENDING = [
  { icon: Satellite, name: 'Satellite intelligence', body: 'Sentinel-2 multi-spectral field monitoring' },
  { icon: CloudRain, name: 'Live weather radar', body: 'IMD API hyperlocal 7-day precipitation forecasts' },
  { icon: Cpu, name: 'IoT soil sensors', body: 'Real-time volumetric soil moisture & EC' },
  { icon: Radio, name: 'NDVI monitoring', body: 'Normalized Difference Vegetation Index tracking' },
  { icon: Send, name: 'Drone analysis', body: 'High-resolution canopy thermal imaging' },
  { icon: Bell, name: 'SMS / IVR alerts', body: 'Direct phone alerts in vernacular Indian dialects' },
];

/** The determination line: the first half in ink, the rest in viridian. */
function Determination({ text }) {
  const words = String(text).trim().split(/\s+/);
  const split = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, split).join(' ')}{' '}
      <span style={{ color: 'var(--determ)' }}>{words.slice(split).join(' ')}</span>
    </>
  );
}

/** An annotation slip: one determination, laid over the ones before it. */
function Slip({ no, engine, date, title, body, reading, onClick, style }) {
  return (
    <button type="button" onClick={onClick} className="slip" style={style}>
      <span className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="label-typed-sm" style={{ color: 'var(--stamp)' }}>
          {no}
        </span>
        <span className="label-typed-sm" style={{ color: 'var(--ink)' }}>
          {engine}
        </span>
        <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
          {date}
        </span>
        <span className="stamp stamp-determ ml-auto">{reading}</span>
      </span>
      <span
        className="determination-xs block"
        style={{ color: 'var(--ink)', fontSize: '1.0625rem' }}
      >
        {title}
      </span>
      {body ? (
        <span
          className="mt-2 block text-[0.8125rem] leading-[1.6]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {body}
        </span>
      ) : null}
    </button>
  );
}

export default function LandingPage({ onNavigate, onOpenDemo }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    integrated_datasets: 3,
    plant_health_images: '50K+',
    production_records: '246,091+',
    soil_parameters: 7
  });

  useEffect(() => {
    getSystemStats()
      .then(res => {
        if (res?.headline_stats) {
          setStats(res.headline_stats);
        }
      })
      .catch(() => {});
  }, []);

  const holdings = [
    {
      value: stats.integrated_datasets,
      label: t('stats_data_sources'),
      note: 'Kaggle & Ministry of Agriculture',
    },
    {
      value: stats.plant_health_images,
      label: t('stats_plant_images'),
      note: '38 disease classes · PlantVillage',
    },
    {
      value: stats.production_records,
      label: t('stats_production_records'),
      note: 'All Indian states · 1997–2015',
    },
    {
      value: stats.soil_parameters,
      label: t('stats_soil_params'),
      note: 'N, P, K, Temp, Humidity, pH, Rain',
    },
  ];

  return (
    <div className="w-full">

      {/* ══ SHEET 01 · The determination ═══════════════════════════ */}
      <section className="slide slide-stage" aria-labelledby="s1">
        <SplineStage />
        <div className="shell relative z-10">
          <SectionRule
            title={`Determination sheet · KX-${new Date().getFullYear()}`}
            note="Sheet 01 / 06"
            className="lay draw-rule"
          />

          <div className="mt-10 grid gap-x-12 gap-y-14 lg:mt-14 lg:grid-cols-12">
            {/* ── The determination line ─────────────────────────── */}
            <div className="lg:col-span-7">
              <h1
                id="s1"
                className="determination lay lay-1 m-0"
                style={{ color: 'var(--ink)' }}
              >
                <Determination text={t('hero_title')} />
              </h1>

              <p className="prose-sheet lay lay-2 mt-7 mb-0" style={{ maxWidth: '54ch' }}>
                {t('hero_subtitle')}
              </p>

              <p
                className="label-typed lay lay-2 mt-5 mb-0"
                style={{ color: 'var(--specimen)' }}
              >
                {t('hero_tagline')}
              </p>

              <div className="lay lay-3 mt-9 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('farm-analysis')}
                  className="btn btn-ink"
                >
                  {t('cta_analyze_farm')}
                  <ArrowRight width={16} height={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('crop-recommendation')}
                  className="btn btn-outline"
                >
                  {t('cta_explore')}
                </button>
                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="label-typed cursor-pointer bg-transparent px-1 py-2"
                  style={{ border: 0, color: 'var(--stamp)' }}
                >
                  {t('cta_try_demo')} →
                </button>
              </div>

              {/* ── What the sheet was determined from ───────────── */}
              <dl
                className="lay lay-4 mt-11 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4"
                style={{ borderColor: 'var(--rule)' }}
              >
                {[
                  ['Soil', '7 parameters'],
                  ['Vision', 'PlantVillage'],
                  ['Production', '1997–2015'],
                  ['Scope', 'All Indian states'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label-typed-sm mb-1.5" style={{ color: 'var(--ink-faint)' }}>
                      {k}
                    </dt>
                    <dd className="accession m-0 text-[0.8125rem]" style={{ color: 'var(--ink)' }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ── The annotation record ──────────────────────────── */}
            <div className="lay lay-2 lg:col-span-5">
              <SectionRule
                title="Annotation record"
                note="Three engines · one field"
                className="mb-6"
              />

              <div className="flex flex-col gap-3.5">
                <Slip
                  no="ANNOT. 03"
                  engine="Yield"
                  date="LUDHIANA · PB"
                  reading="4.12 t/ha"
                  title="Regional yield set against the district mean"
                  body="The production regressor read 246,091 historical rows for this district and returned an estimate a farmer can hold against their own last harvest."
                  onClick={() => onNavigate('yield')}
                />
                <Slip
                  no="ANNOT. 02"
                  engine="Leaf"
                  date="POTATO · SCAN"
                  reading="Healthy"
                  title="Foliar determination from one photograph"
                  onClick={() => onNavigate('crop-health')}
                  style={{ marginLeft: '1.25rem' }}
                />
                <Slip
                  no="ANNOT. 01"
                  engine="Soil"
                  date="pH 6.5 · N 90"
                  reading="Rice · 94%"
                  title="Twenty-two crops ranked against one soil test"
                  onClick={() => onNavigate('crop-recommendation')}
                  style={{ marginLeft: '2.5rem' }}
                />
              </div>

              <p
                className="mt-6 mb-0 text-[0.8125rem] leading-[1.6]"
                style={{ color: 'var(--ink-faint)' }}
              >
                Three worked determinations from the demo register. Each one names the
                dataset it was read from — nothing on this sheet is a projection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SHEET 02 · Verified holdings ═══════════════════════════ */}
      <section className="slide" aria-labelledby="s2">
        <div className="shell">
          <SectionRule title="Verified holdings" note="Sheet 02 / 06" className="lay" />

          <h2 id="s2" className="sr-only">
            What the register holds
          </h2>

          <dl className="mt-10 grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: 'var(--rule)' }}>
            {holdings.map((h, i) => (
              <div
                key={h.label}
                className={`lay lay-${i + 1} p-5 sm:p-6`}
                style={{ background: 'var(--sheet-raised)' }}
              >
                <dd
                  className="accession m-0 text-[2rem] leading-none sm:text-[2.5rem]"
                  style={{ color: 'var(--determ)' }}
                >
                  {h.value}
                </dd>
                <dt
                  className="label-typed mt-3.5"
                  style={{ color: 'var(--ink)' }}
                >
                  {h.label}
                </dt>
                <p
                  className="mt-2 mb-0 text-[0.75rem] leading-[1.5]"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {h.note}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ SHEET 03 · Condition on receipt ════════════════════════ */}
      <section className="slide" aria-labelledby="s3">
        <div className="shell">
          <SectionRule title="Condition on receipt" note="Sheet 03 / 06" className="lay" />

          <div className="mt-10 grid gap-x-14 gap-y-10 lg:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2
                id="s3"
                className="determination-sm lay m-0"
                style={{ color: 'var(--ink)', maxWidth: '16ch' }}
              >
                Indian agriculture needs better intelligence.
              </h2>
              <p className="prose-sheet lay lay-1 mt-6 mb-0" style={{ maxWidth: '44ch' }}>
                Millions of Indian farmers face persistent uncertainties that can be
                resolved through localized machine learning and open agricultural data.
              </p>
            </div>

            <ul className="m-0 list-none p-0 lg:col-span-7">
              {GAPS.map((g, i) => (
                <li
                  key={g.title}
                  className={`lay lay-${i + 1} grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b py-5 first:pt-0`}
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <span className="label-typed-sm" style={{ color: 'var(--stamp)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      className="determination-xs m-0"
                      style={{ color: 'var(--ink)', fontSize: '1.0625rem' }}
                    >
                      {g.title}
                    </h3>
                    <p
                      className="mt-2 mb-0 text-[0.9375rem] leading-[1.6]"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {g.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ SHEET 04 · The instruments ═════════════════════════════ */}
      <section className="slide" id="solution-engines" aria-labelledby="s4">
        <div className="shell">
          <SectionRule title="The instruments" note="Sheet 04 / 06" className="lay" />

          <div className="mt-10 lg:mt-14">
            <h2
              id="s4"
              className="determination-sm lay m-0"
              style={{ color: 'var(--ink)', maxWidth: '20ch' }}
            >
              One platform. Three intelligence engines.
            </h2>
            <p className="prose-sheet lay lay-1 mt-6 mb-0" style={{ maxWidth: '60ch' }}>
              Krishi360 uses a dedicated dataset for each intelligence task rather than
              forcing unrelated datasets into a single black-box model. Each engine names
              what it read and what it returns.
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {INSTRUMENTS.map((ins, i) => {
                const Icon = ins.icon;
                return (
                  <button
                    key={ins.route}
                    type="button"
                    onClick={() => onNavigate(ins.route)}
                    className={`mount lay lay-${i + 1} group flex cursor-pointer flex-col p-0 text-left transition-transform duration-500`}
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span className="mount-head">
                      <span className="label-typed" style={{ color: 'var(--ink)' }}>
                        Instrument {ins.no}
                      </span>
                      <span className="stamp stamp-determ shrink-0">{ins.stamp}</span>
                    </span>

                    <span className="flex flex-1 flex-col p-5 sm:p-6">
                      <Icon
                        width={26}
                        height={26}
                        style={{ color: 'var(--specimen)' }}
                        className="mb-4"
                      />
                      <span
                        className="determination-xs block"
                        style={{ color: 'var(--ink)' }}
                      >
                        {ins.name}
                      </span>
                      <span
                        className="mt-3 block text-[0.875rem] leading-[1.6]"
                        style={{ color: 'var(--ink-soft)' }}
                      >
                        {ins.body}
                      </span>

                      <span className="mt-5 block">
                        {ins.rows.map(([k, v]) => (
                          <span
                            key={k}
                            className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
                            style={{ borderColor: 'var(--rule)' }}
                          >
                            <span
                              className="label-typed-sm shrink-0"
                              style={{ color: 'var(--ink-faint)' }}
                            >
                              {k}
                            </span>
                            <span
                              className="accession text-right text-[0.75rem]"
                              style={{ color: 'var(--ink)' }}
                            >
                              {v}
                            </span>
                          </span>
                        ))}
                      </span>

                      <span
                        className="label-typed mt-auto flex items-center gap-2 pt-6 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: 'var(--determ)' }}
                      >
                        {ins.action}
                        <ArrowRight width={14} height={14} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SHEET 05 · Pending accessions ══════════════════════════ */}
      <section className="slide field-ink" aria-labelledby="s5">
        <div className="shell">
          <SectionRule title="Pending accessions" note="Sheet 05 / 06" onInk className="lay" />

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 lg:mt-14">
            <h2
              id="s5"
              className="determination-sm lay m-0"
              style={{ color: 'var(--on-ink)', maxWidth: '18ch' }}
            >
              Cabinet space is reserved, not filled.
            </h2>
            <p
              className="lay lay-1 m-0 border-l-2 py-1 pl-4 text-[0.8125rem] leading-[1.6]"
              style={{ borderColor: 'var(--stamp)', color: 'var(--on-ink-soft)', maxWidth: '38ch' }}
            >
              These instruments are declared but not yet accessioned. Nothing below returns
              a reading today, and none of it is filled in with synthetic data.
            </p>
          </div>

          <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--on-ink-rule)' }}>
            {PENDING.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.name}
                  className={`lay lay-${(i % 6) + 1} flex items-start gap-4 p-5`}
                  style={{ background: 'var(--field)' }}
                >
                  <Icon
                    width={20}
                    height={20}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--specimen-hi)' }}
                  />
                  <div className="min-w-0">
                    <p className="label-typed m-0" style={{ color: 'var(--on-ink)' }}>
                      {p.name}
                    </p>
                    <p
                      className="mt-2 mb-0 text-[0.8125rem] leading-[1.55]"
                      style={{ color: 'var(--on-ink-soft)' }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SHEET 06 · Open the register ═══════════════════════════ */}
      <section className="slide" aria-labelledby="s6">
        <div className="shell">
          <SectionRule title="Open the register" note="Sheet 06 / 06" className="lay" />

          <div className="mt-10 grid gap-x-14 gap-y-8 lg:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2
                id="s6"
                className="determination lay m-0"
                style={{ color: 'var(--ink)', fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
              >
                Ready to determine{' '}
                <span style={{ color: 'var(--determ)' }}>your field?</span>
              </h2>
              <p className="prose-sheet lay lay-1 mt-6 mb-0" style={{ maxWidth: '50ch' }}>
                The six-step guided analysis connects soil chemistry, computer-vision leaf
                diagnosis and regional Indian yield trends into a single advisory sheet you
                can carry off the platform.
              </p>
            </div>

            <div className="lay lay-2 flex flex-col justify-end gap-3 lg:col-span-5">
              <button
                type="button"
                onClick={() => onNavigate('farm-analysis')}
                className="btn btn-ink w-full"
              >
                Start complete farm analysis
                <ArrowRight width={16} height={16} />
              </button>
              <button
                type="button"
                onClick={onOpenDemo}
                className="btn btn-outline w-full"
              >
                Launch a demo preset
                <ArrowUpRight width={15} height={15} />
              </button>
              <p className="label-typed-sm mt-1 mb-0" style={{ color: 'var(--ink-faint)' }}>
                No account required · every reading names its source
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
