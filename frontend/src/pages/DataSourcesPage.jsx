import React from 'react';
import { ExternalLink, Layers, Activity, BarChart3 } from 'lucide-react';
import { SheetHeader, SheetBody, SectionRule, Row } from '../components/Sheet';

/* ─────────────────────────────────────────────────────────────────
   PROVENANCE · where every reading on the register came from.
   A determination is only as good as the sheet it was read from,
   so each holding is entered with its source, licence and volume.
   ───────────────────────────────────────────────────────────────── */

export default function DataSourcesPage() {
  const datasets = [
    {
      id: 'crop_rec',
      no: '01',
      name: 'Crop Recommendation Dataset',
      source: 'Kaggle (atharvaingle/crop-recommendation-dataset)',
      url: 'https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset',
      purpose: 'Recommends suitable crops based on soil macronutrients (NPK) and agro-climatic conditions.',
      records: '2,200 Balanced Records (100 per crop)',
      inputs: 'Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, Soil pH, Rainfall',
      target: '22 Crop Classes (Rice, Maize, Chickpea, Cotton, Groundnut, etc.)',
      license: 'Open Database License (ODbL) / Public Research Use',
      engine: 'Crop Intelligence Engine',
      icon: Layers,
    },
    {
      id: 'plantvillage',
      no: '02',
      name: 'PlantVillage Dataset',
      source: 'Kaggle (abdallahalidev/plantvillage-dataset) & Penn State University',
      url: 'https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset',
      purpose: 'Enables deep learning computer vision classification of foliar crop diseases and healthy leaf foliage.',
      records: '54,303 Expert-Verified Leaf Photographs across 38 Classes',
      inputs: 'Leaf RGB Image (224x224 pixels)',
      target: '38 Pathological Classes (Early Blight, Late Blight, Scab, Rust, Black Rot, etc.)',
      license: 'Creative Commons CC-BY-SA 4.0 / Public Benchmark',
      engine: 'Plant Health Vision Engine',
      icon: Activity,
    },
    {
      id: 'crop_prod',
      no: '03',
      name: 'Crop Production Data India',
      source: 'Ministry of Agriculture and Farmers Welfare & Kaggle (iamtapendu/crop-production-data-india)',
      url: 'https://www.kaggle.com/datasets/iamtapendu/crop-production-data-india',
      purpose: 'Supplies historical Indian agricultural harvest data to power regional yield forecasting and trend analytics.',
      records: '246,091 Agricultural Survey Records (1997–2015)',
      inputs: 'State Name, District Name, Crop, Season, Crop Year, Cultivated Area (Hectares)',
      target: 'Production (Tonnes) and Derived Yield (Production / Area in Tonnes/Hectare)',
      license: 'Government Open Data License - India (GODL) / Open Data',
      engine: 'Production Analytics & Yield Regressor',
      icon: BarChart3,
    }
  ];

  return (
    <div className="w-full">
      <SheetHeader
        accession="Provenance · KX-DS"
        title="Agricultural datasets & data provenance"
        summary="Every recommendation and statistical chart in Krishi360 is read from a real, open-source agricultural dataset. Each holding below is entered with its origin, its volume and the licence it travels under."
        stamp="3 holdings"
      />

      <SheetBody>
        {/* ── The engineering principle, stamped into the board ── */}
        <section
          className="field-ink lay border-l-2 p-6 sm:p-8"
          style={{ borderColor: 'var(--stamp)' }}
        >
          <p className="label-typed-sm m-0 mb-4" style={{ color: 'var(--specimen-hi)' }}>
            Core engineering principle
          </p>
          <p
            className="determination-xs m-0"
            style={{ color: 'var(--on-ink)', maxWidth: '46ch' }}
          >
            Krishi360 uses different datasets for different intelligence tasks rather than
            forcing unrelated datasets into a single model.
          </p>
          <p
            className="mt-5 mb-0 text-[0.875rem] leading-[1.65]"
            style={{ color: 'var(--on-ink-soft)', maxWidth: '78ch' }}
          >
            Soil chemistry parameters belong in agronomic suitability modeling, leaf
            photography belongs in convolutional computer vision, and multi-decade state
            survey records belong in spatial-temporal time series and regression pipelines.
            By decoupling the engines, each machine learning component operates only on the
            domain it was verified against.
          </p>
        </section>

        {/* ── The holdings ─────────────────────────────────────── */}
        <div className="mt-12">
          <SectionRule title="Accessioned holdings" note="Source · volume · licence" className="lay" />

          <div className="mt-8 flex flex-col gap-6">
            {datasets.map((ds, i) => {
              const Icon = ds.icon;
              return (
                <section key={ds.id} className={`mount lay lay-${i + 1}`}>
                  <div className="mount-head">
                    <h2 className="label-typed m-0" style={{ color: 'var(--ink)' }}>
                      Holding {ds.no} · {ds.engine}
                    </h2>
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-typed-sm inline-flex shrink-0 items-center gap-1.5 no-underline"
                      style={{ color: 'var(--determ)' }}
                    >
                      View on Kaggle
                      <ExternalLink width={12} height={12} />
                    </a>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4">
                      <Icon
                        width={24}
                        height={24}
                        className="mt-1 shrink-0"
                        style={{ color: 'var(--specimen)' }}
                      />
                      <div className="min-w-0">
                        <h3 className="determination-xs m-0" style={{ color: 'var(--ink)' }}>
                          {ds.name}
                        </h3>
                        <p
                          className="mt-2.5 mb-0 text-[0.9375rem] leading-[1.6]"
                          style={{ color: 'var(--ink-soft)', maxWidth: '72ch' }}
                        >
                          {ds.purpose}
                        </p>
                      </div>
                    </div>

                    <dl
                      className="mt-7 grid gap-x-10 border-t pt-2 md:grid-cols-2"
                      style={{ borderColor: 'var(--rule-strong)' }}
                    >
                      <Row label="Source" value={ds.source} />
                      <Row label="Input features" value={ds.inputs} mono />
                      <Row label="Record volume" value={ds.records} mono />
                      <Row label="Target / output" value={ds.target} mono />
                      <Row label="Licence" value={ds.license} />
                      <Row label="Determined by" value={ds.engine} />
                    </dl>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </SheetBody>
    </div>
  );
}
