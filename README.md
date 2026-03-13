# SeeFood

Detect hotdogs with your camera. Take a photo — get a green overlay and sound for hotdog, red overlay and sound for not hotdog.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000

## Deploy to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `seefood`). Do **not** add a README or .gitignore (this repo already has them).

2. In the project folder, run:

```bash
cd "/Users/michaelwrede/Downloads/hot dog app"
git init
git add .
git commit -m "Initial commit: SeeFood app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).

2. Click **Add New…** → **Project**.

3. **Import** your SeeFood GitHub repo. Vercel will detect the Flask app.

4. Leave **Root Directory** as `.` and **Framework Preset** as Other (or Flask if shown). Click **Deploy**.

5. After deploy, your app will be at `https://your-project.vercel.app`. The main page is served from `public/`; `/predict` runs the Flask backend.

**Note:** Camera and microphone need a **secure context** (HTTPS). Vercel gives you HTTPS, so the camera will work on the deployed URL. For local HTTP, some browsers may restrict camera access.
