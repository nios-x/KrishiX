import React from 'react';
import { Compass, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { SheetHeader, SheetBody, SectionRule } from '../components/Sheet';

/* ─────────────────────────────────────────────────────────────────
   THE MISSION SHEET · why the register was opened, what it refuses
   to claim, and what it was built out of.
   ───────────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    no: '01',
    icon: Compass,
    title: 'Localized precision AI',
    body: 'Models calibrated specifically to Indian soil profiles, district administrative boundaries, and seasonal cropping patterns (Kharif, Rabi, Zaid).',
  },
  {
    no: '02',
    icon: Globe,
    title: 'Vernacular multilingual access',
    body: 'Built from day one with English, Hindi, and Hinglish vernacular support to eliminate linguistic barriers for regional farming communities.',
  },
  {
    no: '03',
    icon: ShieldCheck,
    title: 'Responsible & safe AI',
    body: 'Strict low-confidence thresholds preventing misdiagnosis, zero unsupported chemical pesticide prescriptions, and mandatory KVK referrals.',
  },
];

const PROBLEM = [
  ['Mismatched sowing', 'Growing water-intensive crops in soil deficient in key nutrients or facing receding monsoon trends.'],
  ['Delayed foliar diagnosis', 'Failure to recognize early fungal lesions like early blight, leading to indiscriminate fungicide spraying.'],
  ['Data isolation', '246,000+ government production records remain archived in government portals rather than directly accessible on farmers’ screens.'],
];

const SOLUTION = [
  ['Crop recommendation engine', '99.55% test accuracy Random Forest mapping NPK, temperature, humidity, pH, and rainfall to 22 crops.'],
  ['Plant pathology vision', 'MobileNetV2 classifying 38 disease categories with symptoms and safe cultural management guidance.'],
  ['Yield regressor & trends', 'R² = 0.898 regression engine forecasting harvest output and comparing against historical district benchmarks.'],
];

const STACK = [
  ['Frontend', 'React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts'],
  ['Backend REST API', 'Python 3.13, FastAPI, Uvicorn, Pydantic v2'],
  ['Machine learning', 'Scikit-Learn, PyTorch CPU, MobileNetV2, Pillow'],
  ['Report & storage', 'SQLite Indexed DB (246K rows), ReportLab PDF Engine'],
];

/** A ruled two-column register of claims. */
function ClaimList({ title, note, tone, items }) {
  return (
    <div>
      <div
        className="mb-1 flex items-baseline justify-between gap-3 border-b pb-2"
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <h2 className="label-typed m-0" style={{ color: tone }}>
          {title}
        </h2>
        <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
          {note}
        </span>
      </div>
      <ul className="m-0 list-none p-0">
        {items.map(([k, v]) => (
          <li
            key={k}
            className="border-b py-4 last:border-b-0"
            style={{ borderColor: 'var(--rule)' }}
          >
            <p className="label-typed m-0" style={{ color: 'var(--ink)' }}>
              {k}
            </p>
            <p
              className="mt-2 mb-0 text-[0.9375rem] leading-[1.6]"
              style={{ color: 'var(--ink-soft)' }}
            >
              {v}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage({ onNavigate }) {
  return (
    <div className="w-full">
      <SheetHeader
        accession="Mission & vision · KX-00"
        title="AI-driven precision agriculture for sustainable farming"
        summary="Krishi360 transforms fragmented agricultural datasets into simple, localized, and actionable field intelligence for Indian farmers, agronomists, and agricultural researchers."
        stamp="Mission sheet"
      />

      <SheetBody>
        {/* ── The three pillars ────────────────────────────────── */}
        <SectionRule title="What the register commits to" note="Three pillars" className="lay" />

        <div className="mt-8 grid gap-px lg:grid-cols-3" style={{ background: 'var(--rule)' }}>
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.no}
                className={`lay lay-${i + 1} p-6`}
                style={{ background: 'var(--sheet-raised)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon width={22} height={22} style={{ color: 'var(--specimen)' }} />
                  <span className="accession text-[0.6875rem]" style={{ color: 'var(--rule-strong)' }}>
                    {p.no}
                  </span>
                </div>
                <h3
                  className="determination-xs mt-5 mb-0"
                  style={{ color: 'var(--ink)', fontSize: '1.0625rem' }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-2.5 mb-0 text-[0.875rem] leading-[1.6]"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Condition on receipt vs. determination ───────────── */}
        <div className="mt-14">
          <SectionRule
            title="Condition on receipt, and what answers it"
            note="Problem · solution"
            className="lay"
          />

          <div className="mt-8 grid gap-x-14 gap-y-10 lg:grid-cols-2">
            <div className="lay">
              <p
                className="mb-6 text-[0.9375rem] leading-[1.65]"
                style={{ color: 'var(--ink-soft)' }}
              >
                Smallholder farmers across India cultivate over 85% of operational
                agricultural holdings. Despite rapid mobile internet penetration, farming
                decisions remain vulnerable to:
              </p>
              <ClaimList
                title="The agricultural problem in India"
                note="Observed"
                tone="var(--stamp)"
                items={PROBLEM}
              />
            </div>

            <div className="lay lay-1">
              <p
                className="mb-6 text-[0.9375rem] leading-[1.65]"
                style={{ color: 'var(--ink-soft)' }}
              >
                Krishi360 demonstrates one paradigm end to end —{' '}
                <span className="label-typed" style={{ color: 'var(--ink)' }}>
                  data → AI → insight → action
                </span>
                :
              </p>
              <ClaimList
                title="The Krishi360 determination"
                note="Returned"
                tone="var(--determ)"
                items={SOLUTION}
              />
            </div>
          </div>
        </div>

        {/* ── The instruments the sheet was made with ──────────── */}
        <section className="field-ink lay mt-14 p-6 sm:p-8">
          <SectionRule title="Technical architecture & stack" note="Four layers" onInk />

          <dl
            className="mt-8 grid gap-x-10 sm:grid-cols-2"
            style={{ borderColor: 'var(--on-ink-rule)' }}
          >
            {STACK.map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col gap-2 border-b py-4"
                style={{ borderColor: 'var(--on-ink-rule)' }}
              >
                <dt className="label-typed-sm m-0" style={{ color: 'var(--specimen-hi)' }}>
                  {k}
                </dt>
                <dd
                  className="m-0 text-[0.875rem] leading-[1.6]"
                  style={{ color: 'var(--on-ink-soft)' }}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── The demonstration ────────────────────────────────── */}
        <div className="lay mt-14 grid gap-x-14 gap-y-8 border-t pt-10 lg:grid-cols-12" style={{ borderColor: 'var(--rule-strong)' }}>
          <div className="lg:col-span-7">
            <p className="label-typed-sm m-0 mb-3" style={{ color: 'var(--stamp)' }}>
              Smart India Hackathon & HackQuest
            </p>
            <h2 className="determination-sm m-0" style={{ color: 'var(--ink)', maxWidth: '18ch' }}>
              Built to run, not to be described.
            </h2>
            <p className="prose-sheet mt-5 mb-0" style={{ maxWidth: '58ch' }}>
              Krishi360 is a functional, deployable application. Every machine learning
              model was trained on a real dataset, serialized as a persistent artifact,
              and serves live predictions at sub-second latency.
            </p>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('farm-analysis')}
              className="btn btn-ink w-full"
            >
              Launch the 3-minute demo
              <ArrowRight width={16} height={16} />
            </button>
            <p className="label-typed-sm mt-3 mb-0" style={{ color: 'var(--ink-faint)' }}>
              Six steps · soil to signed advisory
            </p>
          </div>
        </div>
      </SheetBody>
    </div>
  );
}
