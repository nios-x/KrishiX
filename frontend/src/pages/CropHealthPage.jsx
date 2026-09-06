import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Activity, CheckCircle2, AlertTriangle, 
  X, Camera, Sparkles, ShieldCheck, ArrowRight, RefreshCw, FileText
} from 'lucide-react';
import { analyzeCropHealth, analyzeSampleLeaf } from '../services/api';
import { useFarm } from '../context/FarmContext';

export default function CropHealthPage({ onNavigate }) {
  const { setLatestHealth, setFarmInfo } = useFarm();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const sampleLeaves = [
    { id: 'potato_early_blight', name: 'Potato (Early Blight)', image: '/samples/potato_early_blight.jpg' },
    { id: 'potato_healthy', name: 'Potato (Healthy)', image: '/samples/potato_healthy.jpg' },
    { id: 'apple_scab', name: 'Apple (Apple Scab)', image: '/samples/apple_scab.jpg' },
    { id: 'corn_common_rust', name: 'Corn (Common Rust)', image: '/samples/corn_common_rust.jpg' },
    { id: 'bell_pepper_bacterial_spot', name: 'Bell Pepper (Bacterial Spot)', image: '/samples/bell_pepper_bacterial_spot.jpg' },
    { id: 'corn_healthy', name: 'Corn (Healthy)', image: '/samples/corn_healthy.jpg' },
  ];

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a JPG, JPEG or PNG image.');
      return;
    }
    setSelectedFile(file);
    setActiveSampleId(null);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample) => {
    setActiveSampleId(sample.id);
    setSelectedFile(null);
    setPreviewUrl(sample.image);
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeSampleLeaf(sample.id);
      setResult(data);
      if (data.confident) {
        setLatestHealth(data);
        setFarmInfo(prev => ({ ...prev, currentCrop: data.crop }));
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze sample leaf');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeCropHealth(selectedFile);
      setResult(data);
      if (data.confident) {
        setLatestHealth(data);
        setFarmInfo(prev => ({ ...prev, currentCrop: data.crop }));
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze leaf image');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveSampleId(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-xs font-semibold text-red-800 dark:text-red-300 mb-2">
          <span>PLANT PATHOLOGY VISION ENGINE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Scan Your Crop
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Upload a clear photograph of a crop leaf to detect diseases, evaluate foliar symptoms, and obtain safe agricultural next steps.
        </p>
      </div>

      {/* Quick Sample Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Try Official PlantVillage Samples (1-Click Instant Scan):</span>
          </span>
          <span className="text-[11px] text-slate-400">38 Classes Dataset</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {sampleLeaves.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`p-2 rounded-xl border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                activeSampleId === sample.id
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/40'
              }`}
            >
              <img
                src={sample.image}
                alt={sample.name}
                className="w-16 h-16 object-cover rounded-lg shadow-2xs"
              />
              <span className="text-[11px] font-semibold text-center text-slate-700 dark:text-slate-200 line-clamp-1">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Drag & Drop Upload */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span>Upload Leaf Photograph</span>
            </h2>
            {previewUrl && (
              <button
                onClick={clearImage}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drag and drop a crop leaf image, or click to browse
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports JPG, JPEG, PNG (Up to 10MB)
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 flex items-center justify-center max-h-80">
                <img
                  src={previewUrl}
                  alt="Leaf Preview"
                  className="w-full h-auto max-h-72 object-contain rounded-xl"
                />
                {activeSampleId && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    Sample: {sampleLeaves.find(s => s.id === activeSampleId)?.name}
                  </span>
                )}
              </div>

              {selectedFile && !result && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Classifying with MobileNetV2...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Analyze Crop Health</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Camera Capture on Mobile */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
            <span>Using a mobile device?</span>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Photo</span>
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Diagnostic Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {!result && !loading && (
            <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Awaiting Leaf Photograph
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Upload your leaf image or click one of the pre-loaded <strong>PlantVillage test samples</strong> above to receive instant pathological classification.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Running Neural Network Inference...
              </div>
              <p className="text-xs text-slate-500">
                Evaluating against 38 plant pathology classes trained on 54,303 PlantVillage images.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Low Confidence State Handling (Prompt #11: Responsible AI) */}
              {!result.confident ? (
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>{result.message}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                    {result.guidance}
                  </p>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Responsible AI Safety Check:</strong> Top candidate probability ({result.confidence}%) fell below our {result.threshold}% confidence threshold. We strictly avoid forcing potentially erroneous disease diagnoses.
                  </div>
                </div>
              ) : (
                <>
                  {/* Diagnosis Header Card */}
                  <div className={`p-6 rounded-2xl border shadow-sm ${
                    result.is_healthy
                      ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white border-emerald-500'
                      : 'bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="space-y-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
                          result.is_healthy ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                          {result.status}
                        </span>
                        <div className="text-xs text-slate-300 font-medium">
                          Crop: <strong className="text-white">{result.crop}</strong>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                          {result.condition}
                        </h2>
                        {result.pathogen !== 'None' && (
                          <p className="text-xs text-slate-400">
                            Pathogen: <span className="font-mono text-emerald-400">{result.pathogen}</span>
                          </p>
                        )}
                      </div>

                      {/* Confidence Gauge */}
                      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center sm:text-right min-w-[130px]">
                        <div className="text-2xl font-black">{result.confidence}%</div>
                        <div className="text-[10px] uppercase text-emerald-200 font-bold tracking-wide">Confidence</div>
                        <div className="text-[9px] text-slate-300 mt-0.5">MobileNetV2</div>
                      </div>

                    </div>
                  </div>

                  {/* What We Found Section (Symptoms) */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>What We Found (Pathological Symptoms)</span>
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {result.symptoms?.map((symptom, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Next Steps Section (Safe Guidance Only) */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Recommended Next Steps (Cultural &amp; Safe Guidance)</span>
                    </h3>

                    <div className="space-y-2.5 pt-1">
                      {result.next_steps?.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                            0{idx + 1}.
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                      <strong>Agronomic Safety Rule:</strong> Krishi360 does not provide unsupported chemical pesticide dosages. Consult your nearest Krishi Vigyan Kendra (KVK) or block agriculture officer for certified site-specific spray recommendations.
                    </div>
                  </div>

                  {/* Alternative Candidate Predictions */}
                  {result.alternative_candidates?.length > 1 && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Other Evaluated Classes:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {result.alternative_candidates.slice(1, 4).map((alt, i) => (
                          <div key={i} className="flex justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-400">{alt.condition}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{alt.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation to Next Step */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Next: Inspect historical production and regional yield trends.
                    </span>
                    <button
                      onClick={() => onNavigate('production')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Production Intelligence</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {/* Responsible AI Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  {result.disclaimer}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
