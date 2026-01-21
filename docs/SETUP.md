# Setup & Environment

Prerequisites

- Node.js 18+ (or latest LTS)
- npm / pnpm / yarn

Install

```bash
npm install
```

Environment variables

- `COHERE_API_KEY` — Cohere API key (used by `@ai-sdk/cohere` and embedding functions)
- If you use another AI provider, follow that provider's env var conventions (e.g., `AI_API_KEY`).

Local services

- The app expects a simple search API at `http://localhost:8080` with endpoints:
  - `POST /insert` — insert a tutorial document (used by `ingestFlowFiles`)
  - `POST /search` — search for nearest tutorial by embedding (used by `/api/chat`)

If you don't have a local search service, the tutorial ingestion and search features will fail; you can stub the endpoints for local development.
