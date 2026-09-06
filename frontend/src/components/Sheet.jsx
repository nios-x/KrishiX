import React, { useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────────
   THE SHEET · shared vocabulary

   Every surface in Krishi360 is one herbarium determination sheet:
   an accession stamp, a determination line, ruled registers, and
   label paper mounted on the board. Nothing here holds state or
   fetches — these are the sheet's typographic instruments only.
   ───────────────────────────────────────────────────────────────── */

/** The Krishi360 mark: a pressed specimen held by two mounting straps. */
export function SheetMark({ size = 28, ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="0.75" y="0.75" width="30.5" height="30.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 25V13.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M16 14.2C16 9.9 12.6 6.5 8.3 6.5c0 4.3 3.4 7.7 7.7 7.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 15.6c0-3.6 2.9-6.5 6.5-6.5 0 3.6-2.9 6.5-6.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 21.5h6M20 21.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The lay-down: the sheet's one authored motion. A block settles onto
 * the board and its shadow catches. Content is visible by default —
 * the hidden state exists only while `data-motion="on"`, which the boot
 * script in index.html sets when the viewer has not asked for less motion.
 *
 * `key` re-runs the observer when a page swaps in new blocks.
 */
export function useLayDown(deps = []) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== 'on') return;

    const targets = document.querySelectorAll('.lay:not(.laid), .draw-rule:not(.laid)');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('laid');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Every register sheet opens the same way: accession, determination, summary. */
export function SheetHeader({ accession, title, summary, stamp, actions, children }) {
  return (
    <header
      className="border-b px-5 py-7 sm:px-8 lg:px-10 lg:py-9"
      style={{ borderColor: 'var(--rule-strong)' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="label-typed-sm mb-2.5 lay" style={{ color: 'var(--stamp)' }}>
            {accession}
          </p>
          <h1 className="determination-sm m-0 lay lay-1" style={{ color: 'var(--ink)' }}>
            {title}
          </h1>
          {summary ? (
            <p
              className="mt-3.5 mb-0 text-[0.9375rem] leading-[1.6] lay lay-2"
              style={{ color: 'var(--ink-soft)', maxWidth: '64ch' }}
            >
              {summary}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end lay lay-2">
          {stamp ? <span className="stamp stamp-ink">{stamp}</span> : null}
          {actions}
        </div>
      </div>
      {children}
    </header>
  );
}

export function SheetBody({ children, className = '' }) {
  return <div className={`px-5 py-8 sm:px-8 lg:px-10 lg:py-10 ${className}`}>{children}</div>;
}

/** A mounted panel: label paper laid on the board, with its ruled header. */
export function Panel({ title, note, children, className = '', bodyClassName = 'p-5 sm:p-6' }) {
  return (
    <section className={`mount ${className}`}>
      {title ? (
        <div className="mount-head">
          <h2 className="label-typed m-0" style={{ color: 'var(--ink)' }}>
            {title}
          </h2>
          {note ? (
            <span className="label-typed-sm shrink-0" style={{ color: 'var(--ink-faint)' }}>
              {note}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** The band that opens a section of a long sheet: title left, folio right. */
export function SectionRule({ title, note, onInk = false, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b pb-2.5 ${className}`}
      style={{ borderColor: onInk ? 'var(--on-ink-rule)' : 'var(--rule-strong)' }}
    >
      <span className="label-typed" style={{ color: onInk ? 'var(--on-ink)' : 'var(--ink)' }}>
        {title}
      </span>
      {note ? (
        <span
          className="label-typed-sm shrink-0"
          style={{ color: onInk ? 'var(--on-ink-soft)' : 'var(--ink-faint)' }}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}

/** A label / value row on the ruled register. */
export function Row({ label, value, mono = false }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0"
      style={{ borderColor: 'var(--rule)' }}
    >
      <dt className="label-typed-sm shrink-0" style={{ color: 'var(--ink-faint)' }}>
        {label}
      </dt>
      <dd
        className={`m-0 text-right text-[0.8125rem] ${mono ? 'accession' : ''}`}
        style={{ color: 'var(--ink)' }}
      >
        {value}
      </dd>
    </div>
  );
}

/** A measurement set at scale: the reading and the unit it is in. */
export function Reading({ value, unit, label, tone = 'var(--ink)', size = '1.75rem' }) {
  return (
    <div>
      {label ? (
        <p className="label-typed-sm mb-1.5 m-0" style={{ color: 'var(--ink-faint)' }}>
          {label}
        </p>
      ) : null}
      <p className="reading m-0" style={{ color: tone }}>
        <span style={{ fontSize: size, fontWeight: 500, lineHeight: 1.05 }}>{value}</span>
        {unit ? (
          <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

/** A typed determination stamp. Status never rides on colour alone. */
export function Chip({ children, tone = 'var(--ink-soft)', filled = false, className = '' }) {
  return (
    <span
      className={`label-typed-sm inline-flex items-center gap-1.5 border px-1.5 py-1 ${className}`}
      style={
        filled
          ? { background: tone, borderColor: tone, color: 'var(--sheet-raised)' }
          : { color: tone, borderColor: `color-mix(in oklab, ${tone} 40%, transparent)` }
      }
    >
      {children}
    </span>
  );
}

/**
 * A surface that could not be read this visit. It names what is missing
 * and what would restore it, rather than showing an empty panel or
 * standing in a fabricated value.
 */
export function Unavailable({ what, why, fix }) {
  return (
    <div
      className="grain-sunk border p-4"
      style={{ borderColor: 'var(--rule-strong)', background: 'var(--sheet-sunk)' }}
      role="status"
    >
      <p className="label-typed-sm m-0" style={{ color: 'var(--stamp)' }}>
        {what} could not be read
      </p>
      <p className="mt-2 mb-0 text-[0.8125rem] leading-[1.6]" style={{ color: 'var(--ink-soft)' }}>
        {why}
        {fix ? ` ${fix}` : ''}
      </p>
    </div>
  );
}

/** A note in the margin — a caveat travelling with the reading it qualifies. */
export function Marginal({ children, tone = 'var(--ink-faint)', className = '' }) {
  return (
    <p className={`mt-3 mb-0 text-[0.75rem] leading-[1.55] ${className}`} style={{ color: tone }}>
      {children}
    </p>
  );
}

/** The determination sheet's own progress rule. */
export function Meter({ value, max = 100, tone = 'var(--determ)', height = 6 }) {
  const pct = Math.max(0, Math.min(100, (Number(value) / max) * 100));
  return (
    <div
      style={{ height, background: 'var(--sheet-sunk)', border: '1px solid var(--rule)' }}
      role="presentation"
    >
      <div style={{ width: `${pct}%`, height: '100%', background: tone }} />
    </div>
  );
}

/** Recharts tooltip, re-inked as a mounted label. */
export function SheetTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="mount px-3 py-2"
      style={{ background: 'var(--sheet-raised)', minWidth: '9rem' }}
    >
      {label != null && label !== '' ? (
        <p className="label-typed-sm m-0 mb-1.5" style={{ color: 'var(--ink-faint)' }}>
          {label}
        </p>
      ) : null}
      {payload.map((p, i) => (
        <p
          key={i}
          className="accession m-0 flex items-baseline justify-between gap-3 text-[0.8125rem]"
          style={{ color: 'var(--ink)' }}
        >
          <span className="label-typed-sm" style={{ color: p.color || 'var(--ink-faint)' }}>
            {p.name}
          </span>
          <span>
            {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  );
}

/** The chart palette, in sheet order. */
export const CHART_INKS = [
  'var(--determ)',
  'var(--specimen)',
  'var(--stamp)',
  'var(--specimen-hi)',
  'var(--ink-soft)',
  'var(--determ-soft)',
];
