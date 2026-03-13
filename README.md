# SeeFood

Take a photo of anything — the app runs a Roboflow workflow to detect whether it’s a hotdog and shows a green overlay (Hotdog ✓) or red overlay (Not hotdog ✕).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 and allow camera access.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Environment (optional)

- `VITE_ROBOFLOW_API_KEY` – Roboflow API key for the workflow. If unset, the app uses a default key.
- `VITE_ROBOFLOW_WORKFLOW_BASE` – Override workflow API base (default: `https://detect.roboflow.com`). Set to `https://serverless.roboflow.com` if your workflow is only on serverless.

## Deploy (Vercel)

1. Push to GitHub.
2. In [Vercel](https://vercel.com), import the repo.
3. Build command: `npm run build`, output directory: `dist`.
4. Add `VITE_ROBOFLOW_API_KEY` in Project Settings → Environment Variables if you use a different key.
5. If you see "Amplitude Logger [Error]: Invalid API key" in the console, that’s from Vercel Analytics. Turn off Analytics in the Vercel project settings or ignore it; it doesn’t affect the app.

## Tech

- React + Vite
- Roboflow Serverless Workflow API (`michael-h89ju` / `custom-workflow-8`)
