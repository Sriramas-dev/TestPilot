# TestPilot

An AI-powered API test generation platform. Paste an endpoint spec, get a complete, runnable Pytest or Cypress test suite in seconds.

## What it does

- Accepts an HTTP method, URL, headers, and request body
- Generates Pytest (Python) or Cypress (JavaScript) test suites via Claude AI
- Covers happy paths, edge cases, auth failures, and schema validation
- Outputs syntax-highlighted, copy-paste-ready code
- Supports one-click copy and download as `.py` or `.js`

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios, react-syntax-highlighter |
| Backend | FastAPI, Python 3.10+, Anthropic SDK, Pydantic |
| Deployment | Frontend → Vercel, Backend → Render |

## Project structure

```
testpilot/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── render.yaml
│   ├── .env.example
│   ├── models/
│   │   ├── request.py
│   │   └── response.py
│   ├── routes/
│   │   └── generate.py
│   └── services/
│       └── claude_service.py
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── Features.jsx
        │   ├── InputPanel.jsx
        │   ├── OutputPanel.jsx
        │   └── Footer.jsx
        ├── hooks/
        │   └── useGenerator.js
        └── lib/
            ├── api.js
            └── utils.js
```

## Local development

### Prerequisites

- Python 3.10+
- Node.js 18+
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=sk-ant-...

uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`.  
API docs at `http://localhost:8000/docs`.

### Frontend setup

```bash
cd frontend
npm install

cp .env.example .env.local
# .env.local already points to http://localhost:8000

npm run dev
```

Frontend will be available at `http://localhost:5173`.

The Vite dev server proxies `/api/*` requests to `localhost:8000`, so no CORS issues during development.

## API reference

### `POST /api/generate-tests`

**Request body:**

```json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "headers": { "Content-Type": "application/json" },
  "body": { "name": "Alice", "email": "alice@example.com" },
  "framework": "pytest",
  "categories": ["happy_path", "edge_cases", "auth_failures", "schema_validation"]
}
```

**Response:**

```json
{
  "tests": "import pytest\nimport requests\n...",
  "test_count": 10,
  "framework": "pytest",
  "generated_at": "2025-01-15T10:30:00+00:00"
}
```

**Supported frameworks:** `pytest`, `cypress`  
**Supported categories:** `happy_path`, `edge_cases`, `auth_failures`, `schema_validation`

## Deployment

### Deploy backend to Render

1. Push the `backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo and set root directory to `backend`
4. Set environment variables:
   - `ANTHROPIC_API_KEY` → your key from Anthropic console
   - `ALLOWED_ORIGINS` → `["https://your-app.vercel.app"]`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Render will provide a URL like `https://testpilot-api.onrender.com`.

### Deploy frontend to Vercel

1. Push the `frontend/` folder (or the monorepo root) to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set framework preset to **Vite**
4. Add environment variable:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://testpilot-api.onrender.com`)
5. Deploy

### Update CORS after deployment

Once your Vercel URL is known, update the backend `ALLOWED_ORIGINS` env var on Render:

```
["https://testpilot.vercel.app"]
```

Redeploy the backend after updating environment variables.

## Environment variables

### Backend (`.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✓ | — | Anthropic API key |
| `ALLOWED_ORIGINS` | | `["http://localhost:5173"]` | CORS allowed origins |
| `CLAUDE_MODEL` | | `claude-sonnet-4-20250514` | Claude model to use |
| `MAX_TOKENS` | | `4096` | Max tokens per generation |

### Frontend (`.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | | `""` (empty) | Backend base URL. Empty = use Vite proxy in dev |

## Notes

- The Anthropic API key lives exclusively in the backend. It is never sent to the browser.
- On Render's free tier, the service sleeps after inactivity. First request may take ~30 seconds to cold-start.
- Test count detection uses regex against the generated code. Minor count variance is expected depending on framework and model output.
