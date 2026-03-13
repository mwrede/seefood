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

## Deploy (Vercel)

1. Push to GitHub.
2. In [Vercel](https://vercel.com), import the repo.
3. Build command: `npm run build`, output directory: `dist`.
4. Add `VITE_ROBOFLOW_API_KEY` in Project Settings → Environment Variables if you use a different key.

## Tech

- React + Vite
- Roboflow Serverless Workflow API (`michael-h89ju` / `custom-workflow-8`)
