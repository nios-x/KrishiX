import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SheetMark } from './Sheet';

/* The colophon: who determined this sheet, from what, and with what
   caveat. It sits on the ink field — the cabinet the sheets live in. */

const ENGINES = [
  { route: 'crop-recommendation', label: 'Crop Recommendation', note: '22 classes' },
  { route: 'crop-health', label: 'Plant Disease Scanner', note: '38 classes' },
  { route: 'production', label: 'Production Intelligence', note: '246K+ records' },
  { route: 'yield', label: 'Yield Prediction Regressor', note: 'Regression' },
  { route: 'advisor', label: 'KrishiMitra AI Assistant', note: 'Advisory' },
];

const SOURCES = [
  { route: 'data-sources', label: 'Crop Recommendation', note: 'Kaggle' },
  { route: 'data-sources', label: 'PlantVillage Dataset', note: '54K images' },
  { route: 'data-sources', label: 'Crop Production India', note: 'Min. of Agri.' },
  { route: 'ai-models', label: 'Model Specifications', note: 'Metrics' },
];

function ColophonList({ title, no, items, onNavigate }) {
  return (
    <div>
      <div
        className="mb-1 flex items-baseline justify-between gap-3 border-b pb-2"
        style={{ borderColor: 'var(--on-ink-rule)' }}
      >
        <h4 className="label-typed m-0" style={{ color: 'var(--on-ink)' }}>
          {title}
        </h4>
        <span className="label-typed-sm" style={{ color: 'var(--on-ink-rule)' }}>
          {no}
        </span>
      </div>
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onNavigate(item.route)}
              className="group flex w-full cursor-pointer items-baseline justify-between gap-3 border-b bg-transparent py-2.5 text-left text-[0.8125rem] transition-colors duration-200 last:border-b-0"
              style={{ borderColor: 'var(--on-ink-rule)', color: 'var(--on-ink-soft)' }}
            >
              <span className="min-w-0 flex-1">{item.label}</span>
              <span className="label-typed-sm shrink-0" style={{ color: 'var(--on-ink-rule)' }}>
                {item.note}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <footer className="field-ink mt-auto w-full">
      <div className="shell py-14">
        {/* ── Colophon head ─────────────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-4 border-b pb-3"
          style={{ borderColor: 'var(--on-ink-soft)' }}
        >
          <span className="label-typed" style={{ color: 'var(--on-ink)' }}>
            Colophon
          </span>
          <span className="label-typed-sm" style={{ color: 'var(--on-ink-soft)' }}>
            Krishi360 · KX-{new Date().getFullYear()}
          </span>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-4">
          {/* ── The mark and the thesis ─────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5" style={{ color: 'var(--on-ink)' }}>
              <SheetMark size={26} />
              <span
                className="text-[1.05rem] font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Krishi360
              </span>
            </div>
            <p
              className="mt-4 mb-0 text-[0.875rem] leading-[1.65]"
              style={{ color: 'var(--on-ink-soft)', maxWidth: '30ch' }}
            >
              Smarter farming, better decisions, sustainable growth. Every reading on
              this sheet is traced back to a named public dataset.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="label-typed mt-5 inline-flex cursor-pointer items-center gap-1.5 bg-transparent p-0"
              style={{ border: 0, color: 'var(--specimen-hi)' }}
            >
              Read the mission
              <ArrowUpRight width={13} height={13} />
            </button>
          </div>

          <ColophonList
            title="Intelligence engines"
            no="05"
            items={ENGINES}
            onNavigate={onNavigate}
          />
          <ColophonList
            title="Verified datasets"
            no="04"
            items={SOURCES}
            onNavigate={onNavigate}
          />

          {/* ── The determination caveat ────────────────────────── */}
          <div>
            <div
              className="mb-1 flex items-baseline justify-between gap-3 border-b pb-2"
              style={{ borderColor: 'var(--on-ink-rule)' }}
            >
              <h4 className="label-typed m-0" style={{ color: 'var(--on-ink)' }}>
                Responsible AI
              </h4>
              <span className="label-typed-sm" style={{ color: 'var(--on-ink-rule)' }}>
                Note
              </span>
            </div>
            <p
              className="mt-3 mb-0 text-[0.8125rem] leading-[1.65]"
              style={{ color: 'var(--on-ink-soft)' }}
            >
              Built for Indian farmers, agronomists and evaluators. This sheet never
              claims perfect disease accuracy or guaranteed crop profit — a
              determination is a reading, not a verdict.
            </p>
          </div>
        </div>

        {/* ── The disclaimer, stamped into the board ────────────── */}
        <div
          className="mt-12 border-l-2 py-1 pl-4"
          style={{ borderColor: 'var(--stamp)' }}
          role="note"
        >
          <p className="label-typed-sm m-0 mb-2" style={{ color: 'var(--stamp)' }}>
            Determination caveat
          </p>
          <p
            className="m-0 text-[0.8125rem] leading-[1.65]"
            style={{ color: 'var(--on-ink-soft)', maxWidth: '92ch' }}
          >
            {t('disclaimer_text')} Predictions are data-assisted estimates and should be
            corroborated with soil test laboratories and regional Krishi Vigyan Kendras
            (KVK).
          </p>
        </div>

        {/* ── Accession line ────────────────────────────────────── */}
        <div
          className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center"
          style={{ borderColor: 'var(--on-ink-rule)' }}
        >
          <p className="label-typed-sm m-0" style={{ color: 'var(--on-ink-rule)' }}>
            &copy; {new Date().getFullYear()} Krishi360 · Machine learning on open
            agricultural datasets
          </p>
          <div className="flex items-center gap-6">
            {[
              ['about', 'About'],
              ['ai-models', 'Models'],
              ['data-sources', 'Datasets'],
            ].map(([route, label]) => (
              <button
                key={route}
                type="button"
                onClick={() => onNavigate(route)}
                className="label-typed-sm cursor-pointer bg-transparent p-0 transition-colors duration-200"
                style={{ border: 0, color: 'var(--on-ink-soft)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
