import React, { Suspense, lazy, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE = 'https://prod.spline.design/9xXFfLraU7B5PS0n/scene.splinecode';

/* ── The stage the sheet is laid on ───────────────────────────────
   Sheet 01 is laid over a live scene the way a specimen is laid on
   its mount. Decorative only: it carries nothing the determination
   sheet does not already state in type, so it is hidden from
   assistive tech and dropped entirely under reduced motion. The
   scrim is the mount board showing through — heaviest under the
   type, thinnest where the scene is allowed to read.
   ─────────────────────────────────────────────────────────────── */
export default function SplineStage() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Never pull down the runtime for a viewer who asked for less motion.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    setAllowed(true);
  }, []);

  return (
    <div className="spline-stage" aria-hidden="true">
      {allowed ? (
        <Suspense fallback={null}>
          <Spline scene={SCENE} className="spline-canvas" />
        </Suspense>
      ) : null}
      <div className="spline-scrim" />
    </div>
  );
}
