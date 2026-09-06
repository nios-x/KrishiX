import React from 'react';
import { Layers, Activity, TrendingUp } from 'lucide-react';
import { SheetHeader, SheetBody, SectionRule } from '../components/Sheet';

/* -----------------------------------------------------------------
   THE MODEL REGISTER - what each instrument was fitted on, what it
   scored, and where it refuses to answer. Every metric below was
   computed during training; none of it is a claim.
   ----------------------------------------------------------------- */

export default function AIModelsPage() {
  const models = [
    {
      id: 'crop_rec',
      no: '01',
      title: 'Crop Recommendation Model',
      engine: 'Soil & Climate Suitability',
      dataset: 'Crop Recommendation Dataset (Kaggle)',
      samples: '2,200 Balanced Records (100 per crop)',
      algorithm: 'Random Forest Classifier (100 Decision Trees)',
      icon: Layers,
      inputs: [
        'Nitrogen (N in kg/ha)',
        'Phosphorus (P in kg/ha)',
        'Potassium (K in kg/ha)',
        'Ambient Temperature (°C)',
        'Relative Humidity (%)',
        'Soil pH (3.5 - 10.0)',
        'Annual Rainfall (mm)'
      ],
      output: 'Probability Distribution over 22 Crop Classes + Top Recommendation',
      metrics: [
        { label: 'Test Accuracy', val: '99.55%' },
        { label: 'Macro F1-Score', val: '0.9955' },
        { label: 'Weighted Precision', val: '0.9961' },
        { label: 'Target Classes', val: '22 Crops' }
      ],
      classes: [
        'Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 'Mothbeans', 
        'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 'Banana', 'Mango', 
        'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya', 
        'Coconut', 'Cotton', 'Jute', 'Coffee'
      ],
      explanationTech: 'Normalized agronomic envelope distance comparison against training class centroids for SHAP-style feature attribution.'
    },
    {
      id: 'plant_disease',
      no: '02',
      title: 'Plant Disease Diagnostic Model',
      engine: 'Computer Vision Foliar Pathology',
      dataset: 'PlantVillage Dataset (Penn State Univ / Kaggle)',
      samples: '54,303 Expert-Curated Leaf Photographs',
      algorithm: 'MobileNetV2 Deep Convolutional Neural Network',
      icon: Activity,
      inputs: [
        'RGB Leaf Image (224 x 224 x 3 channels)',
        'Normalized with ImageNet Mean ([0.485, 0.456, 0.406]) and Std ([0.229, 0.224, 0.225])'
      ],
      output: 'Diagnostic Classification among 38 Disease & Healthy Classes + Confidence %',
      metrics: [
        { label: 'Validation Accuracy', val: '98.2%' },
        { label: 'Total Parameters', val: '2.25 Million' },
        { label: 'Inference Latency', val: '~18 ms (CPU)' },
        { label: 'Classification Classes', val: '38 Pathologies' }
      ],
      classes: [
        'Apple (Scab, Black Rot, Cedar Rust, Healthy)',
        'Corn (Gray Leaf Spot, Common Rust, Northern Blight, Healthy)',
        'Grape (Black Rot, Esca, Leaf Blight, Healthy)',
        'Potato (Early Blight, Late Blight, Healthy)',
        'Tomato (Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mite, Target Spot, Mosaic, Healthy)',
        'Bell Pepper (Bacterial Spot, Healthy)',
        'Orange (Citrus Greening)',
        'Peach (Bacterial Spot, Healthy)'
      ],
      explanationTech: 'Low-confidence gating: If top softmax probability < 45%, model flags uncertainty to prevent unsafe pesticide deployment.'
    },
    {
      id: 'yield_regressor',
      no: '03',
      title: 'Yield Prediction Regressor',
      engine: 'Historical Production Analytics',
      dataset: 'Crop Production Data India (Ministry of Agriculture)',
      samples: '246,091 Historical Records (1997–2015)',
      algorithm: 'Random Forest Regressor Pipeline (OneHotEncoder + Regressor)',
      icon: TrendingUp,
      inputs: [
        'State Name (Categorical)',
        'District Name (Categorical)',
        'Crop Name (Categorical)',
        'Season (Kharif, Rabi, Summer, Whole Year)',
        'Cultivated Area (Hectares)',
        'Crop Year (1997 - 2024)'
      ],
      output: 'Estimated Yield (Tonnes/Ha) & Total Production (Tonnes)',
      metrics: [
        { label: 'Coefficient of Determination (R²)', val: '0.8983' },
        { label: 'Mean Absolute Error (MAE)', val: '1.186 t/ha' },
        { label: 'Root Mean Squared Error (RMSE)', val: '2.675 t/ha' },
        { label: 'Historical Benchmarks', val: '1,164 Combinations' }
      ],
      classes: [
        'Trained on major Indian crops including Rice, Wheat, Sugarcane, Maize, Cotton, Groundnut, Gram, Pulses, Mustard, and Millets across all 33 States and 646 Districts.'
      ],
      explanationTech: 'Trained on 60,000 verified non-outlier records with coconut nut unit separation and 99th percentile yield clipping.'
    }
  ];

  return (
    <div className="w-full">
      <SheetHeader
        accession="Model register - KX-ML"
        title="AI models & architectural specifications"
        summary="Actual evaluation metrics computed during machine learning training. Krishi360 keeps complete scientific integrity - nothing on this sheet is an invented performance claim."
        stamp="3 instruments"
      />

      <SheetBody>
        <SectionRule title="Fitted instruments" note="Metric / input / scope" className="lay" />

        <div className="mt-8 flex flex-col gap-8">
          {models.map((m, idx) => {
            const Icon = m.icon;
            return (
              <section key={m.id} className={`mount lay lay-${idx + 1}`}>
                <div className="mount-head">
                  <h2 className="label-typed m-0" style={{ color: 'var(--ink)' }}>
                    Instrument {m.no} &middot; {m.engine}
                  </h2>
                  <span className="label-typed-sm shrink-0" style={{ color: 'var(--ink-faint)' }}>
                    {m.samples}
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  {/* -- What it is -------------------------------- */}
                  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <Icon
                        width={24}
                        height={24}
                        className="mt-1 shrink-0"
                        style={{ color: 'var(--specimen)' }}
                      />
                      <div className="min-w-0">
                        <h3 className="determination-xs m-0" style={{ color: 'var(--ink)' }}>
                          {m.title}
                        </h3>
                        <p
                          className="accession mt-2 mb-0 text-[0.8125rem]"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          {m.algorithm}
                        </p>
                      </div>
                    </div>
                    <p
                      className="label-typed-sm m-0 shrink-0"
                      style={{ color: 'var(--ink-faint)', maxWidth: '30ch' }}
                    >
                      {m.dataset}
                    </p>
                  </div>

                  {/* -- What it scored ---------------------------- */}
                  <dl
                    className="mt-7 grid grid-cols-2 gap-px sm:grid-cols-4"
                    style={{ background: 'var(--rule)', border: '1px solid var(--rule)' }}
                  >
                    {m.metrics.map((met, i) => (
                      <div key={i} className="p-4" style={{ background: 'var(--sheet-sunk)' }}>
                        <dt className="label-typed-sm m-0" style={{ color: 'var(--ink-faint)' }}>
                          {met.label}
                        </dt>
                        <dd
                          className="accession m-0 mt-2 text-[1.375rem] leading-none"
                          style={{ color: 'var(--determ)' }}
                        >
                          {met.val}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {/* -- What it reads and returns ----------------- */}
                  <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <div>
                      <SectionRule title="Input features" note={`${m.inputs.length} fields`} />
                      <ul className="m-0 mt-1 list-none p-0">
                        {m.inputs.map((inp, i) => (
                          <li
                            key={i}
                            className="grid grid-cols-[2rem_1fr] items-baseline gap-x-2 border-b py-2.5 last:border-b-0"
                            style={{ borderColor: 'var(--rule)' }}
                          >
                            <span className="label-typed-sm" style={{ color: 'var(--rule-strong)' }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span
                              className="text-[0.8125rem] leading-[1.55]"
                              style={{ color: 'var(--ink-soft)' }}
                            >
                              {inp}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <SectionRule title="Determination returned" note="Output" />
                      <p
                        className="mt-4 mb-0 text-[0.9375rem] leading-[1.6]"
                        style={{ color: 'var(--ink)' }}
                      >
                        {m.output}
                      </p>

                      <p className="label-typed-sm mt-7 mb-0" style={{ color: 'var(--stamp)' }}>
                        Where it refuses to answer
                      </p>
                      <p
                        className="mt-2.5 mb-0 border-l-2 py-1 pl-4 text-[0.8125rem] leading-[1.6]"
                        style={{ borderColor: 'var(--stamp)', color: 'var(--ink-soft)' }}
                      >
                        {m.explanationTech}
                      </p>
                    </div>
                  </div>

                  {/* -- Its scope --------------------------------- */}
                  <div className="mt-8">
                    <SectionRule title="Target classes & scope" note={`${m.classes.length} entries`} />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.classes.map((cls, i) => (
                        <span
                          key={i}
                          className="accession border px-2 py-1.5 text-[0.6875rem]"
                          style={{
                            color: 'var(--ink-soft)',
                            borderColor: 'var(--rule)',
                            background: 'var(--sheet-sunk)',
                          }}
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </SheetBody>
    </div>
  );
}
