# Architecture & Data Flow

User → Frontend → `/api/chat` → embedding + local search → model → streamed response

Key pieces

- Frontend: UI components in `src/components` and `src/app` pages.
- API: `src/app/api/chat/route.ts` handles message streams, uses `convertToModelMessages`, and exposes a `getTutorial` tool that calls the local search service.
- Embeddings: `src/lib/ai/embedding.ts` wraps Cohere embedding calls and chunking logic.
- Ingest: `src/lib/actions/ingestFlows.ts` reads `.flow.json` files from `src/tutorial/flows`, generates embeddings, optionally creates step audio, and posts to `http://localhost:8080/insert`.

Local search service

- The repo expects a small service that supports `/insert` and `/search` to store embeddings and return the best match for a query embedding. During development this can be a simple vector store (e.g., a small Python/Node server using FAISS, Annoy, or a simple in-memory nearest neighbor search).
