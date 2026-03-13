const WORKFLOW_BASE = 'https://serverless.roboflow.com';
const WORKSPACE = 'michael-h89ju';
const WORKFLOW_ID = 'custom-workflow-8';

/**
 * Run Roboflow workflow on a base64 image.
 * @param {string} base64Image - Data URL or raw base64 string (no data URL prefix)
 * @returns {Promise<{ isHotdog: boolean, raw: object }>}
 */
export async function runWorkflow(base64Image) {
  let value = base64Image;
  if (value.includes(',')) {
    value = value.split(',')[1];
  }

  const apiKey = import.meta.env.VITE_ROBOFLOW_API_KEY || 'jIlsPhHeCYPv0LCOooQT';
  const url = `${WORKFLOW_BASE}/infer/workflows/${WORKSPACE}/${WORKFLOW_ID}`;

  const body = {
    api_key: apiKey,
    inputs: {
      image: { type: 'base64', value },
      dog: { type: 'base64', value },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Workflow failed: ${res.status}`);
  }

  const raw = await res.json();
  const isHotdog = parseWorkflowResult(raw);
  return { isHotdog, raw };
}

/**
 * Map workflow output to yes (hotdog) / no (not hotdog).
 * Handles classification top class, result field, or predictions array.
 */
function parseWorkflowResult(data) {
  if (data?.result === true || data?.result === 'yes') return true;
  if (data?.result === false || data?.result === 'no') return false;
  const top = data?.top ?? data?.outputs?.top ?? data?.predictions?.[0]?.class;
  if (typeof top === 'string') {
    const lower = top.toLowerCase();
    if (lower.includes('hotdog') || lower === 'hot dog' || lower === 'yes') return true;
    if (lower.includes('not') || lower === 'no') return false;
  }
  const preds = data?.predictions ?? data?.outputs?.predictions;
  if (Array.isArray(preds) && preds.length > 0) {
    const c = preds[0].class ?? preds[0].className;
    if (c && String(c).toLowerCase().includes('hotdog')) return true;
  }
  return false;
}
