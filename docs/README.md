# Tutorial Engine — Documentation

This repository is a Next.js application that provides a guided "tutorial engine" powered by AI embeddings and a small local search/ingest service.

Key points:

- Framework: Next.js 16 + React 19 + TypeScript
- AI: Cohere (`@ai-sdk/cohere`) and the `ai` SDK for embeddings and model calls
- Tutorials: flow files live in `src/tutorial/flows` and public assets in `public/tutorials`
- API: the app exposes `/api/chat` which uses embeddings and a local search service at `http://localhost:8080`

Quick start

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open: http://localhost:3000

Where to look next

- Code: `src/` — app routes, components, and tutorial engine
- Tutorials: `src/tutorial/flows` and `public/tutorials`
