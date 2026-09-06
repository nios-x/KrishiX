const API_BASE = '/api';

export async function recommendCrop(params) {
  const res = await fetch(`${API_BASE}/crop/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to fetch recommendation' }));
    throw new Error(err.detail || 'Failed to fetch recommendation');
  }
  return res.json();
}

export async function getCropMetrics() {
  const res = await fetch(`${API_BASE}/crop/metrics`);
  return res.json();
}

export async function analyzeCropHealth(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/health/analyze`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to analyze crop leaf' }));
    throw new Error(err.detail || 'Failed to analyze crop leaf');
  }
  return res.json();
}

export async function analyzeSampleLeaf(sampleId) {
  const res = await fetch(`${API_BASE}/health/sample/${sampleId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Sample not found' }));
    throw new Error(err.detail || 'Failed to analyze sample');
  }
  return res.json();
}

export async function getHealthSamples() {
  const res = await fetch(`${API_BASE}/health/samples`);
  return res.json();
}

export async function getProductionStates() {
  const res = await fetch(`${API_BASE}/production/states`);
  return res.json();
}

export async function getProductionDistricts(state) {
  const q = state ? `?state=${encodeURIComponent(state)}` : '';
  const res = await fetch(`${API_BASE}/production/districts${q}`);
  return res.json();
}

export async function getProductionCrops(state, district) {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (district) params.append('district', district);
  const res = await fetch(`${API_BASE}/production/crops?${params.toString()}`);
  return res.json();
}

export async function getProductionSeasons() {
  const res = await fetch(`${API_BASE}/production/seasons`);
  return res.json();
}

export async function getProductionAnalytics(filters) {
  const params = new URLSearchParams();
  if (filters.state && filters.state !== 'All') params.append('state', filters.state);
  if (filters.district && filters.district !== 'All') params.append('district', filters.district);
  if (filters.crop && filters.crop !== 'All') params.append('crop', filters.crop);
  if (filters.season && filters.season !== 'All') params.append('season', filters.season);
  if (filters.start_year) params.append('start_year', filters.start_year);
  if (filters.end_year) params.append('end_year', filters.end_year);

  const res = await fetch(`${API_BASE}/production/analytics?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load production analytics');
  return res.json();
}

export async function getRegionalTrends(state, district, crop) {
  const params = new URLSearchParams({ state, district, crop });
  const res = await fetch(`${API_BASE}/production/trends?${params.toString()}`);
  return res.json();
}

export async function predictYield(data) {
  const res = await fetch(`${API_BASE}/yield/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Yield prediction failed');
  return res.json();
}

export async function getYieldMetrics() {
  const res = await fetch(`${API_BASE}/yield/metrics`);
  return res.json();
}

export async function chatAdvisor(message, context, language = 'en') {
  const res = await fetch(`${API_BASE}/advisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context, language })
  });
  if (!res.ok) throw new Error('Advisor request failed');
  return res.json();
}

export async function generateReportSummary(reportData) {
  const res = await fetch(`${API_BASE}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  return res.json();
}

export async function downloadReportPdf(reportData) {
  const res = await fetch(`${API_BASE}/report/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  if (!res.ok) throw new Error('Failed to generate PDF');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Krishi360_Farm_Intelligence_Report.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function getSystemStats() {
  const res = await fetch(`${API_BASE}/system/stats`);
  return res.json();
}
