import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

/* The prepared specimens. Four sheets already determined, laid out so an
   evaluator can pull one and watch the instruments read it. */

export default function DemoModal({ isOpen, onClose, onSelectDemo }) {
  const { loadDemoScenario } = useFarm();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 1,
      route: 'crop-recommendation',
      no: 'DEMO 01',
      title: 'Crop Recommendation',
      tag: 'Soil AI',
      desc: 'Preloads alluvial soil parameters (N: 85, P: 58, K: 41, pH: 6.8, Rainfall: 226mm) and runs Random Forest classification for high-rainfall rice cultivation.',
    },
    {
      id: 2,
      route: 'crop-health',
      no: 'DEMO 02',
      title: 'Disease Determination',
      tag: 'Computer Vision',
      desc: 'Preloads a high-resolution potato leaf photograph and runs the MobileNetV2 38-class diagnostic model to detect Early Blight with symptoms & safe cultural remedies.',
    },
    {
      id: 3,
      route: 'production',
      no: 'DEMO 03',
      title: 'Production Intelligence',
      tag: 'Historical Analytics',
      desc: 'Loads Maharashtra sugarcane agricultural records across 1997-2015, visualizing production trends, area vs production scatter, and seasonal shares.',
    },
    {
      id: 4,
      route: 'farm-analysis',
      no: 'DEMO 04',
      title: 'Complete Farm Intelligence Workflow',
      tag: 'End-to-End System',
      desc: 'Runs the unified 6-step farm advisory workflow connecting Soil → Crop Rec → Leaf Scan → Regional Yield → KrishiMitra AI Report with downloadable PDF.',
      featured: true,
    },
  ];

  const handleLaunch = (sc) => {
    loadDemoScenario(sc.id);
    onSelectDemo(sc.route, sc.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      style={{ background: 'color-mix(in oklab, var(--field) 72%, transparent)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Demo scenarios"
      onClick={onClose}
    >
      <div
        className="mount relative my-auto w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── The drawer label ──────────────────────────────────── */}
        <div className="mount-head">
          <h2 className="label-typed m-0" style={{ color: 'var(--ink)' }}>
            Prepared specimens
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border bg-transparent"
            style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-soft)' }}
          >
            <X width={15} height={15} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <p className="label-typed-sm m-0 mb-2.5" style={{ color: 'var(--stamp)' }}>
            Four scenarios · verified presets
          </p>
          <h3 className="determination-xs m-0" style={{ color: 'var(--ink)' }}>
            Pull a sheet the instruments have already read.
          </h3>
          <p
            className="mt-3 mb-0 text-[0.875rem] leading-[1.6]"
            style={{ color: 'var(--ink-soft)', maxWidth: '62ch' }}
          >
            Each scenario loads real parameters from a verified dataset into the active
            farm context, then opens the engine that determines them. Every preset is
            labelled as demo data on the sheet it lands on.
          </p>

          {/* ── The specimens ───────────────────────────────────── */}
          <div className="mt-7 grid gap-px" style={{ background: 'var(--rule)' }}>
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleLaunch(sc)}
                className="group flex w-full cursor-pointer flex-col items-start gap-2 p-4 text-left transition-colors duration-200 sm:flex-row sm:items-baseline sm:gap-5"
                style={{
                  border: 0,
                  background: sc.featured ? 'var(--sheet-sunk)' : 'var(--sheet-raised)',
                }}
              >
                <span
                  className="accession shrink-0 text-[0.6875rem] tracking-[0.15em] uppercase"
                  style={{ color: sc.featured ? 'var(--stamp)' : 'var(--rule-strong)' }}
                >
                  {sc.no}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                    <span
                      className="determination-xs"
                      style={{ color: 'var(--ink)', fontSize: '1.05rem' }}
                    >
                      {sc.title}
                    </span>
                    <span className="stamp stamp-ink">{sc.tag}</span>
                  </span>
                  <span
                    className="mt-2 block text-[0.8125rem] leading-[1.6]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {sc.desc}
                  </span>
                </span>

                <span
                  className="label-typed-sm flex shrink-0 items-center gap-1.5 self-end transition-transform duration-300 group-hover:translate-x-1 sm:self-center"
                  style={{ color: 'var(--determ)' }}
                >
                  Launch
                  <ArrowRight width={13} height={13} />
                </span>
              </button>
            ))}
          </div>

          <p className="label-typed-sm mt-5 mb-0" style={{ color: 'var(--ink-faint)' }}>
            Presets write to the active farm context and can be edited on any sheet.
          </p>
        </div>
      </div>
    </div>
  );
}
