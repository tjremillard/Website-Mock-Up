<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Easement project workflow

- Work on feature branches for meaningful features. Preserve existing working code and the original starter at `/starter`; ask the owner before removing or replacing major features.
- Run lint, typecheck, production build, and relevant browser tests after meaningful changes. Explain the result in plain English.
- Prepare descriptive commits; push only with owner authorization. Do not force-push or discard local changes. GitHub is the permanent source of truth once changes have been pushed.
- Keep `docs/DEVELOPER-HANDOFF.md` accurate. Demo actions must clearly distinguish local samples from real payments, analysis, messages, and warehouse data.
- Use the existing isolated checkout. Do not create a worktree unless requested.
