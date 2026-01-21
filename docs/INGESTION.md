# Ingestion & Tutorials

Tutorial flows

- Flow files live in `src/tutorial/flows` and follow the `.flow.json` format. An example is `src/tutorial/flows/example.flow.json`.

Ingest process

1. `ingestFlowFiles()` (see `src/lib/actions/ingestFlows.ts`) reads all `.flow.json` files.
2. It generates embeddings for the flow description and step descriptions using `src/lib/ai/embedding.ts`.
3. It generates step audio (`public/tutorials/<tour>/<step>.mp3`) via `gtts`.
4. It POSTs each flow to `http://localhost:8080/insert` with payload `{ tour, description, step_descriptions, embedding }`.

Search

- The chat API calls `http://localhost:8080/search` with `{ queryEmbedding, minSimilarity, limit }` and expects a JSON array of tutorial records.

Troubleshooting

- If you see failures during ingestion, confirm the local search service is running and reachable at `localhost:8080`.
- Check console output for `INSERT FAILED:` messages returned by the ingest call.
