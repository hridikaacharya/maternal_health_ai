# Sathi — Maternal Health Decision Support System (prototype)

A bilingual (English / Nepali) triage prototype for pregnant women and Female
Community Health Volunteers (FCHVs). Built as a hybrid expert system:

- **`src/services/clinicalEngine.js`** — a deterministic, rule-based triage
  engine. Zero AI involved. Same inputs always produce the same result, and
  every result carries a `ruleId` so a reviewer can trace exactly why it fired.
- **`src/services/geminiService.js`** — the *only* file that talks to a
  generative model. It receives the engine's already-decided result and turns
  it into warm, plain-language English + Nepali. It cannot change the decision.

## Run it

```bash
npm install
cp .env.example .env.local   # then paste in a Gemini API key
npm run dev
```

Get a free key at https://aistudio.google.com/apikey.

## Project structure

```
src/
├── App.jsx                     # global state: current view, alert log
├── components/
│   ├── Layout/Header.jsx       # brand + Patient/FCHV view toggle
│   ├── PatientForm/
│   │   ├── FormWizard.jsx      # orchestrates the 3-step intake + result
│   │   ├── ProgressSteps.jsx   # "terrace" step indicator
│   │   ├── Step1Profile.jsx
│   │   ├── Step2Symptoms.jsx
│   │   ├── Step3History.jsx
│   │   └── TriageOutput.jsx    # risk result + elevation band + bilingual panel
│   └── FchvDashboard/
│       ├── DashboardMain.jsx
│       └── AlertRow.jsx
└── services/
    ├── clinicalEngine.js
    └── geminiService.js
```

Routing was intentionally left out — this is a two-view SPA, and a router
would be pure overhead. `App.jsx` toggles between views with plain state.

## Swapping in your Python backend later

Open `src/services/geminiService.js`. Flip one flag:

```js
const USE_PYTHON_BACKEND = true;
const PYTHON_BACKEND_URL = 'http://localhost:8000/api/explain-triage';
```

Nothing else in the app needs to change — the wizard, the dashboard, and the
clinical engine only ever call `generateBilingualExplanation()`. Your Python
server just needs to accept `{ form_data, clinical_result, prompt }` as JSON
and return `{ explanation_text: "ENGLISH EXPLANATION:\n...\n\nNEPALI EXPLANATION:\n..." }`
in the same format the parser already expects.

## Notes on the Nepali text

The Nepali explanations are generated live by the model, not hand-written —
before using this with real patients, have a native Nepali speaker (ideally a
health worker) review a batch of generated explanations for accuracy and tone.

## Build & deploy

```bash
npm run build
```

Outputs static assets to `dist/`. Drag that folder onto Vercel or Netlify, or
push to GitHub Pages — no server required for the prototype (the browser
calls the Gemini API directly). Move the API key server-side before handling
real patient data in production.

## Next steps

- Move the model call behind a real Python/Node API gateway (keeps the key
  off the client and lets you log/audit every triage).
- Persist alerts in a database instead of in-memory React state.
- Add authenticated FCHV accounts before this ever touches real patient data.
