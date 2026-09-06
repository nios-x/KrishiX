import React from 'react';
import {
  Sprout, Activity, BarChart3, MessageSquareText, ArrowRight
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { SheetHeader, SheetBody, Panel, SectionRule } from '../components/Sheet';

/* ─────────────────────────────────────────────────────────────────
   THE REGISTER · the parcel's own sheet. Everything the instruments
   have determined about this field so far, in one ruled surface.
   ───────────────────────────────────────────────────────────────── */

const SHORTCUTS = [
  { route: 'crop-recommendation', no: '02', icon: Sprout, label: 'Analyze soil', note: 'Crop suitability recommendations' },
  { route: 'crop-health', no: '03', icon: Activity, label: 'Scan crop leaf', note: 'Instant disease diagnostics' },
  { route: 'production', no: '04', icon: BarChart3, label: 'View production', note: '246K+ Indian crop records' },
  { route: 'advisor', no: '06', icon: MessageSquareText, label: 'Ask KrishiMitra', note: 'Conversational AI guidance' },
];

/** One reading on the parcel's ruled overview. */
function Field({ label, value, note, tone = 'var(--ink)' }) {
  return (
    <div className="p-4 sm:p-5" style={{ background: 'var(--sheet-sunk)' }}>
      <p className="label-typed-sm m-0" style={{ color: 'var(--ink-faint)' }}>
        {label}
      </p>
      <p
        className="accession m-0 mt-2.5 truncate text-[1.375rem] leading-none"
        style={{ color: tone }}
      >
        {value}
      </p>
      <p className="label-typed-sm mt-2.5 mb-0" style={{ color: 'var(--ink-faint)' }}>
        {note}
      </p>
    </div>
  );
}

/** An entry in the intelligence feed: a determination and its source. */
function FeedEntry({ stamp, headline, body, action, onAction }) {
  return (
    <div
      className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b py-5 first:pt-0 last:border-b-0 last:pb-0"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="min-w-0 flex-1">
        <p className="label-typed-sm m-0" style={{ color: 'var(--stamp)' }}>
          {stamp}
        </p>
        <p
          className="determination-xs m-0 mt-2.5"
          style={{ color: 'var(--ink)', fontSize: '1.0625rem' }}
        >
          {headline}
        </p>
        <p
          className="mt-2 mb-0 text-[0.875rem] leading-[1.6]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {body}
        </p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="label-typed shrink-0 cursor-pointer bg-transparent p-0"
        style={{ border: 0, color: 'var(--determ)' }}
      >
        {action} →
      </button>
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const { farmInfo, soilParams, latestRecommendation, latestHealth, latestYield } = useFarm();

  const prompts = [
    'What is the ideal NPK for Rice?',
    'How to treat early blight on potato?',
    'What is wheat yield in Punjab?',
  ];

  return (
    <div className="w-full">
      <SheetHeader
        accession={`Parcel register · ${farmInfo.district}, ${farmInfo.state}`}
        title="Agricultural command centre"
        summary={`Everything the instruments have determined about this field so far. Active parcel: ${farmInfo.district}, ${farmInfo.state} — ${farmInfo.area} hectares under ${farmInfo.currentCrop || 'Rice'}.`}
        stamp={`${farmInfo.area} ha`}
        actions={
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('farm-analysis')}
              className="btn btn-ink btn-sm"
            >
              Run complete analysis
              <ArrowRight width={14} height={14} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('advisor')}
              className="btn btn-outline btn-sm"
            >
              Ask KrishiMitra
            </button>
          </div>
        }
      />

      <SheetBody>
        {/* ── The index, as shortcuts ──────────────────────────── */}
        <SectionRule title="Register index" note="Four instruments" className="lay" />

        <div className="mt-6 grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'var(--rule)' }}>
          {SHORTCUTS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.route}
                type="button"
                onClick={() => onNavigate(s.route)}
                className={`lay lay-${i + 1} group cursor-pointer p-5 text-left transition-colors duration-200`}
                style={{ border: 0, background: 'var(--sheet-raised)' }}
              >
                <span className="flex items-center justify-between">
                  <Icon width={22} height={22} style={{ color: 'var(--specimen)' }} />
                  <span
                    className="accession text-[0.6875rem]"
                    style={{ color: 'var(--rule-strong)' }}
                  >
                    {s.no}
                  </span>
                </span>
                <span
                  className="label-typed mt-5 block transition-transform duration-300 group-hover:translate-x-0.5"
                  style={{ color: 'var(--ink)' }}
                >
                  {s.label}
                </span>
                <span
                  className="mt-2 block text-[0.8125rem] leading-[1.5]"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {s.note}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── The parcel's readings and its feed ───────────────── */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <Panel
              title="Active farm health & agronomic overview"
              note={`${farmInfo.district} · ${farmInfo.state}`}
              className="lay"
              bodyClassName="p-px"
            >
              <div className="grid grid-cols-2 gap-px sm:grid-cols-4" style={{ background: 'var(--rule)' }}>
                <Field
                  label="Farm scale"
                  value={`${farmInfo.area} ha`}
                  note="Cultivated area"
                />
                <Field
                  label="Current crop"
                  value={farmInfo.currentCrop || 'Rice'}
                  note="Active sowing"
                  tone="var(--determ)"
                />
                <Field
                  label="Soil health"
                  value={`pH ${soilParams.ph}`}
                  note={`NPK ${soilParams.n}-${soilParams.p}-${soilParams.k}`}
                />
                <Field
                  label="Leaf pathology"
                  value={latestHealth?.is_healthy ? 'Normal' : (latestHealth?.condition || 'No alert')}
                  note={latestHealth ? `${latestHealth.confidence}% conf.` : 'Awaiting scan'}
                  tone={latestHealth && !latestHealth.is_healthy ? 'var(--stamp)' : 'var(--ink)'}
                />
              </div>
            </Panel>

            <Panel title="AI intelligence feed" note="Latest determinations" className="lay lay-1">
              <FeedEntry
                stamp="Soil recommendation"
                headline={`${latestRecommendation?.recommended_crop || 'Rice (Paddy)'} recommended · ${latestRecommendation?.confidence || 94}% confidence`}
                body={`Optimal macronutrient balance for ${farmInfo.district}, read from the current soil card.`}
                action="View details"
                onAction={() => onNavigate('crop-recommendation')}
              />
              <FeedEntry
                stamp="Regional yield outlook"
                headline={`Estimated yield ${latestYield?.estimated_yield_tonnes_per_ha || 4.12} t/ha`}
                body={latestYield?.trend || '+7.0% above the regional multi-decade average.'}
                action="View yield model"
                onAction={() => onNavigate('yield')}
              />
            </Panel>
          </div>

          {/* ── The advisor's slip ─────────────────────────────── */}
          <div className="lg:col-span-4">
            <Panel title="Ask KrishiMitra" note="Instant advisory" className="lay lay-2">
              <p
                className="mt-0 mb-0 text-[0.875rem] leading-[1.65]"
                style={{ color: 'var(--ink-soft)' }}
              >
                Need guidance on crop rotation, disease symptoms, or fertilizer split
                dosages for {farmInfo.district}?
              </p>

              <div className="mt-6">
                <SectionRule title="Suggested queries" note="03" />
                <div className="mt-1">
                  {prompts.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onNavigate('advisor')}
                      className="flex w-full cursor-pointer items-baseline gap-3 border-b bg-transparent py-3 text-left last:border-b-0"
                      style={{ borderColor: 'var(--rule)' }}
                    >
                      <span
                        className="label-typed-sm shrink-0"
                        style={{ color: 'var(--rule-strong)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="min-w-0 flex-1 text-[0.8125rem] leading-[1.5]"
                        style={{ color: 'var(--ink-soft)' }}
                      >
                        {q}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('advisor')}
                className="btn btn-ink btn-sm mt-6 w-full"
              >
                Open KrishiMitra chat
                <ArrowRight width={14} height={14} />
              </button>
            </Panel>
          </div>
        </div>
      </SheetBody>
    </div>
  );
}
