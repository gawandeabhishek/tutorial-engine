# Components & Notable Files

Top-level component groups

- `src/components/ai-elements` — custom UI elements used for AI interactions (messages, reasoning, plan, loader, etc.)
- `src/components/ui` — primitives and design-system components (buttons, inputs, dialogs)

Notable files

- `src/tutorial/TutorialEngine.tsx` — orchestration and entry for the tutorial system
- `src/tutorial/tutorial.store.ts` — store for active tutorial state
- `src/app/api/chat/route.ts` — server-side chat handler that queries the search service and streams model replies
- `src/lib/ai/embedding.ts` — embedding helpers
- `src/lib/actions/ingestFlows.ts` — ingestion helper that creates audio and inserts flows

When adding components

- Keep presentation components in `ui`, and AI-specific message/prompt components in `ai-elements`.
