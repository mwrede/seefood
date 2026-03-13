const WORKSPACE = 'michael-h89ju';
const WORKFLOW_BASE = import.meta.env.VITE_ROBOFLOW_WORKFLOW_BASE || 'https://detect.roboflow.com';
const WORKFLOW_ID = 'custom-workflow-8';
const MAX_IMAGE_DIM = 1024;

/**
 * Resize image to max dimension for smaller payload and fewer 400s.
 */
function resizeImageToDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w <= MAX_IMAGE_DIM && h <= MAX_IMAGE_DIM) {
        resolve(dataUrl);
        return;
      }
      if (w > h) {
        h = Math.round((h * MAX_IMAGE_DIM) / w);
        w = MAX_IMAGE_DIM;
      } else {
        w = Math.round((w * MAX_IMAGE_DIM) / h);
        h = MAX_IMAGE_DIM;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}

/**
 * Run Roboflow workflow on a base64 image.
 * @param {string} base64Image - Data URL or raw base64 string (no data URL prefix)
 * @returns {Promise<{ isHotdog: boolean, raw: object }>}
 */
export async function runWorkflow(base64Image) {
  const resized = await resizeImageToDataUrl(base64Image);
  let value = resized;
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

  const text = await res.text();
  if (!res.ok) {
    let msg = text || `Workflow failed: ${res.status}`;
    try {
      const errJson = JSON.parse(text);
      if (errJson?.message) msg = errJson.message;
      else if (errJson?.detail) msg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
    } catch (_) {}
    throw new Error(msg);
  }

  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Invalid response from workflow');
  }
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
